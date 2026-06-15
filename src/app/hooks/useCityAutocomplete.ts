import { useState, useCallback, useEffect, useRef } from 'react';

interface City {
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        sigla: string;
      };
    };
  };
}

interface UseCityAutocompleteProps {
  minLength?: number;
  maxResults?: number;
  debounceMs?: number;
}

let cachedCities: City[] | null = null;
let isFetching = false;

/**
 * Hook customizado para autocomplete de cidades brasileiras
 * Usa a API do IBGE para buscar cidades por nome
 */
export const useCityAutocomplete = ({
  minLength = 2,
  maxResults = 5,
  debounceMs = 300
}: UseCityAutocompleteProps = {}) => {
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCities = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < minLength) {
      setCities([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!cachedCities && !isFetching) {
        isFetching = true;
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar cidades');
        }
        cachedCities = await response.json();
        isFetching = false;
      }
      
      while (!cachedCities && isFetching) {
        await new Promise(r => setTimeout(r, 100));
      }

      const filteredCities = (cachedCities || [])
        .filter((city: City) => 
          city.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, maxResults)
        .map((city: City) => `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`);

      setCities(filteredCities);
      setShowSuggestions(filteredCities.length > 0);
    } catch (err) {
      setError('Erro ao carregar cidades');
      setCities([]);
      setShowSuggestions(false);
      isFetching = false;
    } finally {
      setIsLoading(false);
    }
  }, [minLength, maxResults]);

  const searchCities = useCallback((searchTerm: string) => {
    // Cancela busca anterior se estiver em andamento
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchTerm.length < minLength) {
      setCities([]);
      setShowSuggestions(false);
      return;
    }

    // Adiciona debounce para evitar muitas requisições
    debounceRef.current = setTimeout(() => {
      fetchCities(searchTerm);
    }, debounceMs);
  }, [fetchCities, debounceMs, minLength]);

  // Limpa o timeout quando o componente desmonta
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const selectCity = useCallback((city: string) => {
    setShowSuggestions(false);
    return city;
  }, []);

  const clearCities = useCallback(() => {
    setCities([]);
    setShowSuggestions(false);
    setError(null);
  }, []);

  return {
    cities,
    isLoading,
    error,
    showSuggestions,
    searchCities,
    selectCity,
    clearCities,
    setShowSuggestions
  };
};

/**
 * Função utilitária para validar formato de cidade
 * Exemplo: "Fortaleza - CE"
 */
export const isValidCityFormat = (city: string): boolean => {
  const cityRegex = /^[A-Za-zÀ-ÿ\s]+\s-\s[A-Z]{2}$/;
  return cityRegex.test(city);
};

/**
 * Função para extrair nome da cidade e UF de uma string formatada
 */
export const parseCityString = (city: string): { city: string; state: string } | null => {
  const match = city.match(/^(.+)\s-\s([A-Z]{2})$/);
  if (match) {
    return {
      city: match[1].trim(),
      state: match[2]
    };
  }
  return null;
};
import { useState, useCallback } from 'react';

/**
 * Hook customizado para formatar números de telefone brasileiros
 * Aceita tanto celular quanto telefone fixo
 * Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const usePhoneMask = () => {
  const [phone, setPhone] = useState('');

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    if (digits.length <= 10) {
      // Telefone fixo: (XX) XXXX-XXXX
      return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
      // Celular: (XX) XXXXX-XXXX
      return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
  };

  const handlePhoneChange = useCallback((value: string) => {
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
    const masked = formatPhoneNumber(digitsOnly);
    setPhone(masked);
    return masked;
  }, []);

  const setPhoneValue = useCallback((value: string) => {
    const masked = formatPhoneNumber(value);
    setPhone(masked);
  }, []);

  return {
    phone,
    setPhone: setPhoneValue,
    handlePhoneChange,
    formatPhoneNumber
  };
};

/**
 * Função utilitária para formatar números de telefone
 * Pode ser usada fora de componentes React
 */
export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  
  if (digits.length === 0) return '';
  if (digits.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  } else {
    // Celular: (XX) XXXXX-XXXX
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  }
};

/**
 * Função para validar se um número de telefone é válido
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  
  // Telefone fixo: 10 dígitos (DDD + 8 dígitos)
  if (digits.length === 10) {
    return /^[1-9]{2}[2-5]{1}[0-9]{7}$/.test(digits);
  }
  
  // Celular: 11 dígitos (DDD + 9 dígitos)
  if (digits.length === 11) {
    return /^[1-9]{2}9[0-9]{8}$/.test(digits);
  }
  
  return false;
};
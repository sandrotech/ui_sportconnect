import { useState, useCallback } from 'react';

/**
 * Hook customizado para formatar datas brasileiras (DD/MM/YYYY)
 * Aceita datas no formato brasileiro com máscara automática
 */
export const useDateMask = () => {
  const [date, setDate] = useState('');

  const formatDate = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    if (digits.length <= 2) {
      // Dia: DD
      return digits;
    } else if (digits.length <= 4) {
      // Dia/Mês: DD/MM
      return digits.replace(/(\d{2})(\d{0,2})/, '$1/$2');
    } else {
      // Dia/Mês/Ano: DD/MM/YYYY
      return digits.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    }
  };

  const handleDateChange = useCallback((value: string) => {
    // Limita a 8 dígitos (DDMMAAAA)
    const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
    const masked = formatDate(digitsOnly);
    setDate(masked);
    return masked;
  }, []);

  const setDateValue = useCallback((value: string) => {
    const masked = formatDate(value);
    setDate(masked);
  }, []);

  return {
    date,
    setDate: setDateValue,
    handleDateChange,
    formatDate
  };
};

/**
 * Função utilitária para formatar datas
 * Pode ser usada fora de componentes React
 */
export const formatDate = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  
  if (digits.length === 0) return '';
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 4) {
    return digits.replace(/(\d{2})(\d{0,2})/, '$1/$2');
  } else {
    return digits.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
  }
};

/**
 * Função para validar se uma data é válida
 * Verifica dias, meses e anos bissextos
 */
export const isValidDate = (date: string): boolean => {
  const digits = date.replace(/\D/g, '');
  
  if (digits.length !== 8) return false;
  
  const day = parseInt(digits.substring(0, 2));
  const month = parseInt(digits.substring(2, 4));
  const year = parseInt(digits.substring(4, 8));
  
  // Verificar mês válido
  if (month < 1 || month > 12) return false;
  
  // Verificar dia válido
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Verificar ano bissexto
  if (month === 2 && isLeapYear(year)) {
    daysInMonth[1] = 29;
  }
  
  if (day < 1 || day > daysInMonth[month - 1]) return false;
  
  // Verificar ano (não pode ser futuro)
  const currentYear = new Date().getFullYear();
  if (year > currentYear) return false;
  
  // Verificar idade mínima (não pode ser menor de 10 anos)
  const currentDate = new Date();
  const birthDate = new Date(year, month - 1, day);
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 10;
};

/**
 * Função para verificar se um ano é bissexto
 */
const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

/**
 * Função para converter data do formato DD/MM/YYYY para YYYY-MM-DD
 * Útil para enviar para APIs que esperam o formato ISO
 */
export const convertDateToISO = (date: string): string => {
  const digits = date.replace(/\D/g, '');
  if (digits.length !== 8) return '';
  
  const day = digits.substring(0, 2);
  const month = digits.substring(2, 4);
  const year = digits.substring(4, 8);
  
  return `${year}-${month}-${day}`;
};

import { useCallback, useState } from 'react';
import { API_URL, type SummaryResponse } from '../services/api';

export function useReports() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const fetchSummary = useCallback(async (startDate: string, endDate: string) => {
    setIsLoading(true);
    setErro(null);
    setSummary(null);
    
    try {
      const url = `${API_URL}/api/reports/summary/?start_date=${startDate}&end_date=${endDate}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.erro || data.detail) {
        throw new Error(data.erro || data.detail);
      }
      
      setSummary(data);

    } catch (error: any) {
      console.error("Erro ao buscar resumo:", error);
      setErro(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    summary, 
    isLoading, 
    erro, 
    fetchSummary
  };
}
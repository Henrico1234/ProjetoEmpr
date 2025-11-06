

import { useCallback, useEffect, useState } from 'react';

import { API_URL, type Divida, type NovaDivida } from '../services/api';

export function useDebts(monthYear: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [erro, setErro] = useState<string | null>(null);


  const fetchDebts = useCallback(async (currentMonthYear: string) => {
    setIsLoading(true);
    setErro(null);
    
    try {
      const url = `${API_URL}/api/debts/list/?month_year_filter=${currentMonthYear}`;
      console.log(`Buscando dívidas para ${currentMonthYear}...`, url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.erro) {
        throw new Error(data.erro);
      }
      
      setDividas(data || []);

    } catch (error: any) {
      console.error("Erro ao buscar dívidas:", error);
      setErro(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    if (monthYear) {
      fetchDebts(monthYear);
    }
  }, [monthYear, fetchDebts]);


  const addDebt = async (novaDivida: NovaDivida) => {
    try {
      const response = await fetch(`${API_URL}/api/debts/add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaDivida),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao adicionar dívida');
      }
      
      await fetchDebts(monthYear);
      return true;
    } catch (error: any) {
      console.error("Erro ao adicionar dívida:", error);
      throw error;
    }
  };

  const payDebt = async (debt_id: string, mesAnoTransacao: string) => {
    try {
      const payload = {
        current_month_year_for_transaction: mesAnoTransacao
      };
      
      const response = await fetch(`${API_URL}/api/debts/pay/${debt_id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao pagar dívida');
      }
      
      await fetchDebts(monthYear);
      return true;

    } catch (error: any) {
      console.error("Erro ao pagar dívida:", error);
      throw error; 
    }
  };

  const deleteDebt = async (debt_id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/debts/delete/${debt_id}/`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao excluir dívida');
      }
      
      await fetchDebts(monthYear);
      return true;

    } catch (error: any) {
      console.error("Erro ao excluir dívida:", error);
      throw error;
    }
  };

  return { 
    dividas, 
    isLoading, 
    erro, 
    refreshDebts: () => fetchDebts(monthYear),
    addDebt,
    payDebt,
    deleteDebt
  };
}
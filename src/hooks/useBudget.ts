// src/hooks/useBudget.ts

import { useCallback, useEffect, useState } from 'react';
import { API_URL, type NovoOrcamento, type Orcamento, type OrcamentoExcedido } from '../services/api';

export function useBudget(monthYear: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [excedidos, setExcedidos] = useState<OrcamentoExcedido[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const fetchBudgetData = useCallback(async (currentMonthYear: string) => {
    setIsLoading(true);
    setErro(null);
    
    let orcamentosData: Orcamento[] = [];
    let excedidosData: OrcamentoExcedido[] = [];
    let fetchError: string | null = null;

    try {
      const responseOrcamentos = await fetch(`${API_URL}/api/budget/${currentMonthYear}/`);
      const dataOrcamentos = await responseOrcamentos.json();
      if (!responseOrcamentos.ok || dataOrcamentos.erro) {
        throw new Error(`Orçamentos (${responseOrcamentos.status}): ${dataOrcamentos.detail || 'Erro'}`);
      }
      orcamentosData = dataOrcamentos || [];
    } catch (error: any) {
      console.error("Erro ao buscar orçamentos:", error);
      fetchError = error.message;
    }

    if (!fetchError) {
      try {
        const responseCheck = await fetch(`${API_URL}/api/budget/check/${currentMonthYear}/`);
        const dataCheck = await responseCheck.json();
        if (!responseCheck.ok || dataCheck.erro) {
          throw new Error(`Check Orçamento (${responseCheck.status}): ${dataCheck.detail || 'Erro'}`);
        }
        excedidosData = dataCheck || [];
      } catch (error: any) {
        console.error("Erro ao checar orçamentos:", error);
        fetchError = error.message; 
      }
    }
    
    if (!fetchError) {
      setOrcamentos(orcamentosData);
      setExcedidos(excedidosData);
      setErro(null);
    } else {
      setErro(fetchError);
      setOrcamentos([]);
      setExcedidos([]);
    }

    setIsLoading(false);

  }, []); 

  useEffect(() => {
    if (monthYear) {
      fetchBudgetData(monthYear);
    }
  }, [monthYear, fetchBudgetData]);

  const setBudget = async (novoOrcamento: NovoOrcamento) => {
    try {
      const response = await fetch(`${API_URL}/api/budget/${monthYear}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoOrcamento),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao definir orçamento');
      }
      
      await fetchBudgetData(monthYear);
      return true;

    } catch (error: any) {
      console.error("Erro ao definir orçamento:", error);
      throw error; 
    }
  };

  const deleteBudget = async (categoryName: string) => {
    try {
      const response = await fetch(`${API_URL}/api/budget/${monthYear}/${encodeURIComponent(categoryName)}/`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao excluir orçamento');
      }
      
      await fetchBudgetData(monthYear);
      return true;

    } catch (error: any) {
      console.error("Erro ao excluir orçamento:", error);
      throw error;
    }
  };

  return { 
    orcamentos, 
    excedidos,
    isLoading, 
    erro, 
    refreshBudgets: () => fetchBudgetData(monthYear),
    setBudget,
    deleteBudget
  };
}
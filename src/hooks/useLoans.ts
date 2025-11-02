// src/hooks/useLoans.ts

import { useCallback, useEffect, useState } from 'react';
import { API_URL, type Emprestimo, type NovoEmprestimo, type PagamentoEmprestimo } from '../services/api';

export function useLoans() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const fetchLoans = useCallback(async () => {
    setIsLoading(true);
    setErro(null);
    
    try {
      const url = `${API_URL}/api/loans/active/`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.erro) {
        throw new Error(data.erro);
      }
      
      setEmprestimos(data || []);

    } catch (error: any) {
      console.error("Erro ao buscar empréstimos:", error);
      setErro(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const registerLoan = async (novoEmprestimo: NovoEmprestimo) => {
    try {
      const response = await fetch(`${API_URL}/api/loans/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoEmprestimo),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao registrar empréstimo');
      }
      
      await fetchLoans();
      return true;

    } catch (error: any) {
      console.error("Erro ao registrar empréstimo:", error);
      throw error;
    }
  };

  const payInstallment = async (loan_id: string, pagamento: PagamentoEmprestimo) => {
    try {
      const response = await fetch(`${API_URL}/api/loans/pay/${loan_id}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagamento),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao pagar parcela');
      }
      
      await fetchLoans();
      return true;

    } catch (error: any) {
      console.error("Erro ao pagar parcela:", error);
      throw error; 
    }
  };

  const deleteLoan = async (loan_id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/loans/delete/${loan_id}/`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao excluir empréstimo');
      }
      
      await fetchLoans();
      return true;

    } catch (error: any) {
      console.error("Erro ao excluir empréstimo:", error);
      throw error;
    }
  };

  return { 
    emprestimos, 
    isLoading, 
    erro, 
    refreshLoans: fetchLoans,
    registerLoan,
    payInstallment,
    deleteLoan
  };
}
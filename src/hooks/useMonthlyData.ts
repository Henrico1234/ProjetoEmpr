// src/hooks/useMonthlyData.ts

import { useCallback, useEffect, useState } from 'react'; // Adiciona useCallback
// Usa o caminho relativo correto
import { API_URL, type Saldos, type Transacao } from '../services/api';

export function useMonthlyData(monthYear: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saldos, setSaldos] = useState<Saldos | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  // 1. Transformámos a lógica de busca numa função "useCallback"
const fetchData = useCallback(async () => {
    // ... (if !monthYear, setErro(null), setIsLoading(true))
    
    // CORREÇÃO: Vamos separar os try...catch
    let saldosData: Saldos | null = null;
    let transacoesData: Transacao[] = [];
    let fetchError: string | null = null;

    try {
      // --- Chamada 1: Buscar Saldos ---
      console.log(`Buscando saldos para ${monthYear}...`);
      const responseSaldos = await fetch(`${API_URL}/api/saldos/${monthYear}`);
      const dataSaldos = await responseSaldos.json();
      if (!responseSaldos.ok || dataSaldos.erro) {
         // Lança erro específico
         throw new Error(`Saldos (${responseSaldos.status}): ${dataSaldos.erro || dataSaldos.detail || 'Erro desconhecido'}`);
      }
      saldosData = dataSaldos.saldos;
      console.log("Saldos recebidos:", saldosData);

    } catch (error: any) {
        console.error("Erro ao buscar SALDOS:", error);
        fetchError = error.message; // Guarda o primeiro erro
    }

    // Só busca transações se os saldos funcionaram (ou se não precisarmos deles)
    if (!fetchError) {
        try {
          // --- Chamada 2: Buscar Transações ---
          console.log(`Buscando transações para ${monthYear}...`);
          const responseTransacoes = await fetch(`${API_URL}/api/transacoes/${monthYear}`);
          const dataTransacoes = await responseTransacoes.json();
          if (!responseTransacoes.ok || dataTransacoes.erro) {
            // Lança erro específico
            throw new Error(`Transações (${responseTransacoes.status}): ${dataTransacoes.erro || dataTransacoes.detail || 'Erro desconhecido'}`);
          }
          transacoesData = dataTransacoes.transacoes;
          console.log("Transações recebidas:", transacoesData);

        } catch (error: any) {
            console.error("Erro ao buscar TRANSAÇÕES:", error);
            fetchError = error.message; // Guarda o erro (pode sobrescrever o de saldos se ambos falharem)
        }
    }
    
    // Atualiza os estados APENAS SE não houve erro
    if (!fetchError) {
        setSaldos(saldosData);
        setTransacoes(transacoesData);
        setErro(null); // Limpa erros antigos
    } else {
        setErro(fetchError); // Mostra o erro que ocorreu
        // Opcional: limpar dados antigos se der erro?
        // setSaldos(null);
        // setTransacoes([]);
    }

    setIsLoading(false); // Termina o loading independentemente do resultado

  }, [monthYear]); 

  // 2. O useEffect agora apenas chama o fetchData na primeira vez
  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  // 3. ESTA É A CORREÇÃO: Retornamos os dados E a função de recarregar!
  return { isLoading, saldos, transacoes, erro, refreshData: fetchData };
}
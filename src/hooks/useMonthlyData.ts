
import { useCallback, useEffect, useState } from 'react';
import { API_URL, type Saldos, type Transacao } from '../services/api';

export function useMonthlyData(monthYear: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saldos, setSaldos] = useState<Saldos | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [erro, setErro] = useState<string | null>(null);

const fetchData = useCallback(async () => {

    let saldosData: Saldos | null = null;
    let transacoesData: Transacao[] = [];
    let fetchError: string | null = null;

    try {
      console.log(`Buscando saldos para ${monthYear}...`);
      const responseSaldos = await fetch(`${API_URL}/api/saldos/${monthYear}`);
      const dataSaldos = await responseSaldos.json();
      if (!responseSaldos.ok || dataSaldos.erro) {
         throw new Error(`Saldos (${responseSaldos.status}): ${dataSaldos.erro || dataSaldos.detail || 'Erro desconhecido'}`);
      }
      saldosData = dataSaldos.saldos;
      console.log("Saldos recebidos:", saldosData);

    } catch (error: any) {
        console.error("Erro ao buscar SALDOS:", error);
        fetchError = error.message;
    }

    if (!fetchError) {
        try {
          console.log(`Buscando transações para ${monthYear}...`);
          const responseTransacoes = await fetch(`${API_URL}/api/transacoes/${monthYear}`);
          const dataTransacoes = await responseTransacoes.json();
          if (!responseTransacoes.ok || dataTransacoes.erro) {
            throw new Error(`Transações (${responseTransacoes.status}): ${dataTransacoes.erro || dataTransacoes.detail || 'Erro desconhecido'}`);
          }
          transacoesData = dataTransacoes.transacoes;
          console.log("Transações recebidas:", transacoesData);

        } catch (error: any) {
            console.error("Erro ao buscar TRANSAÇÕES:", error);
            fetchError = error.message;
        }
    }
    
    if (!fetchError) {
        setSaldos(saldosData);
        setTransacoes(transacoesData);
        setErro(null);
    } else {
        setErro(fetchError);
    }

    setIsLoading(false);

  }, [monthYear]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  return { isLoading, saldos, transacoes, erro, refreshData: fetchData };
}
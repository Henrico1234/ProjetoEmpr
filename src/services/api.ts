// src/services/api.ts

// 1. Define o IP da API num único local
export const API_URL = 'http://192.168.1.104:8000';

// 2. Define os "Tipos" de dados que esperamos
export interface Transacao {
  ID: string | number;
  Data: string;
  Tipo: 'Ganho' | 'Despesa';
  Descricao: string;
  Categoria: string;
  Valor: number;
  MeioPagamento: string;
}

export interface Saldos {
  saldo_conta: number;
  saldo_maos: number;
  ganhos_mes: number;
  despesas_mes: number;
  saldo_liquido: number;
}
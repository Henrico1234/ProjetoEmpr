
export const API_URL = 'http://192.168.1.100:8000';

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

export interface Divida {
  ID: string;
  Descricao: string;
  Valor: number;
  DataVencimento: string;
  Status: 'Pendente' | 'Paga';
  Recorrencia: string;
  RecorrenciaMeses: number;
  Categoria: string;
}

export interface NovaDivida {
  description: string;
  value: number;
  due_date: string;
  status: string;
  recurrence: string;
  recurrence_months: number;
  category: string;
}
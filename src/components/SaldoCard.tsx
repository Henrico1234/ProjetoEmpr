// src/components/SaldoCard.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type Saldos } from '../services/api'; // Importa o tipo

// O componente recebe os saldos como uma "prop"
interface Props {
  saldos: Saldos | null;
  monthYear: string;
}

export function SaldoCard({ saldos, monthYear }: Props) {
  return (
    <View style={styles.saldosContainer}>
      <Text style={styles.saldosTitulo}>Saldos (Mês: {monthYear})</Text>
      
      <View style={styles.saldosLinha}>
        <Text style={styles.saldosLabel}>Saldo em Conta:</Text>
        <Text style={styles.saldosValor}>R$ {saldos?.saldo_conta.toFixed(2)}</Text>
      </View>
      <View style={styles.saldosLinha}>
        <Text style={styles.saldosLabel}>Saldo em Mãos:</Text>
        <Text style={styles.saldosValor}>R$ {saldos?.saldo_maos.toFixed(2)}</Text>
      </View>
      <View style={styles.saldosLinha}>
        <Text style={styles.saldosLabel}>Ganhos:</Text>
        <Text style={[styles.saldosValor, styles.valorGanho]}>R$ {saldos?.ganhos_mes.toFixed(2)}</Text>
      </View>
      <View style={styles.saldosLinha}>
        <Text style={styles.saldosLabel}>Despesas:</Text>
        <Text style={[styles.saldosValor, styles.valorDespesa]}>R$ {saldos?.despesas_mes.toFixed(2)}</Text>
      </View>
      
      <View style={styles.saldosSeparador} />
      
      <View style={styles.saldosLinha}>
        <Text style={styles.saldosLabelTotal}>Saldo Líquido:</Text>
        <Text style={[styles.saldosValorTotal, saldos?.saldo_liquido ?? 0 >= 0 ? styles.valorGanho : styles.valorDespesa]}>
          R$ {saldos?.saldo_liquido.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

// Os estilos são locais para o componente
const styles = StyleSheet.create({
  saldosContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saldosTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  saldosLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  saldosLabel: {
    fontSize: 16,
    color: '#555',
  },
  saldosValor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  saldosSeparador: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  saldosLabelTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  saldosValorTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  valorGanho: {
    color: '#28a745',
  },
  valorDespesa: {
    color: '#dc3545',
  },
});
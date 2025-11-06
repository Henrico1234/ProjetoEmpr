import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';
import { type Saldos } from '../services/api';

interface Props {
  saldos: Saldos | null;
  monthYear: string;
}

export function SaldoCard({ saldos, monthYear }: Props) {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  // Função auxiliar para formatar moeda
  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value ?? 0);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.header}>
        <Text style={styles.monthLabel}>Resumo de {monthYear}</Text>
        <Ionicons name="wallet-outline" size={24} color="rgba(255,255,255,0.8)" />
      </View>

      <View style={styles.mainBalance}>
        <Text style={styles.balanceLabel}>Saldo Líquido</Text>
        <Text style={styles.balanceValue}>
          {formatCurrency(saldos?.saldo_liquido)}
        </Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <View style={styles.detailHeader}>
            <Ionicons name="arrow-down-circle" size={16} color="#4ade80" style={{marginRight: 4}} />
            <Text style={styles.detailLabel}>Ganhos</Text>
          </View>
          <Text style={styles.detailValue}>{formatCurrency(saldos?.ganhos_mes)}</Text>
        </View>

        <View style={[styles.separator, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />

        <View style={styles.detailItem}>
          <View style={styles.detailHeader}>
            <Ionicons name="arrow-up-circle" size={16} color="#f87171" style={{marginRight: 4}} />
            <Text style={styles.detailLabel}>Despesas</Text>
          </View>
          <Text style={styles.detailValue}>{formatCurrency(saldos?.despesas_mes)}</Text>
        </View>
      </View>
      
      {/* Mini rodapé para saldos específicos */}
      <View style={[styles.footer, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
        <Text style={styles.footerText}>Conta: {formatCurrency(saldos?.saldo_conta)}</Text>
        <Text style={styles.footerText}> | </Text>
        <Text style={styles.footerText}>Mãos: {formatCurrency(saldos?.saldo_maos)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    margin: 16,
    paddingTop: 20,
    overflow: 'hidden', // Para o footer não sair do borderRadius
    elevation: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  monthLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  mainBalance: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
  balanceValue: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  detailValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  separator: {
    width: 1,
    height: '80%',
    marginHorizontal: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  footerText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '500',
  }
});
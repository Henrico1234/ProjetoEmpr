import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';
import { type Orcamento, type OrcamentoExcedido } from '../services/api';

interface Props {
  item: Orcamento;
  excedidoInfo?: OrcamentoExcedido; 
  onDelete: () => void;
}

export function BudgetItem({ item, excedidoInfo, onDelete }: Props) {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  
  const isExcedido = !!excedidoInfo;
  
  // Configuração visual baseada no status
  const statusColor = isExcedido ? colors.danger : colors.primary;
  const iconName = isExcedido ? 'alert-circle' : 'pie-chart';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        
        {/* Ícone Esquerdo */}
        <View style={[styles.iconContainer, { backgroundColor: `${statusColor}15` }]}>
          <Ionicons name={iconName} size={24} color={statusColor} />
        </View>

        {/* Informações Centrais */}
        <View style={styles.contentContainer}>
          <Text style={[styles.categoria, { color: colors.text }]} numberOfLines={1}>
            {item.category}
          </Text>
          
          <View style={styles.limitRow}>
            <Text style={[styles.limitLabel, { color: colors.textSecondary }]}>Limite: </Text>
            <Text style={[styles.limitValue, { color: colors.text }]}>
              {formatCurrency(item.limit)}
            </Text>
          </View>

          {isExcedido && (
            <View style={[styles.badgeExcedido, { backgroundColor: `${colors.danger}15` }]}>
              <Text style={[styles.textoExcedido, { color: colors.danger }]}>
                Excedido em {formatCurrency(excedidoInfo.Excedente)}
              </Text>
            </View>
          )}
        </View>
        
        {/* Botão de Excluir à Direita */}
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton} activeOpacity={0.6}>
          <Ionicons name="trash-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    // Sombras suaves modernas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoria: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  limitLabel: {
    fontSize: 14,
  },
  limitValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  badgeExcedido: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  textoExcedido: {
    fontSize: 12,
    fontWeight: '700',
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
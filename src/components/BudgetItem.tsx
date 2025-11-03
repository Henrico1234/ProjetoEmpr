import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type Orcamento, type OrcamentoExcedido } from '../services/api';

interface Props {
  item: Orcamento;
  excedidoInfo?: OrcamentoExcedido; 
  onDelete: () => void;
}

export function BudgetItem({ item, excedidoInfo, onDelete }: Props) {
  
  const isExcedido = !!excedidoInfo;
  
  return (
    <View style={[styles.itemLista, isExcedido && styles.itemExcedido]}>
      <View style={styles.infoContainer}>
        <Text style={styles.itemCategoria}>{item.category}</Text>
        
        {isExcedido ? (
          <View>
            <Text style={styles.infoExcedido}>
              Gasto: R$ {excedidoInfo.GastoAtual.toFixed(2)}
            </Text>
            <Text style={[styles.infoExcedido, styles.valorExcedente]}>
              Excedeu: R$ {excedidoInfo.Excedente.toFixed(2)}
            </Text>
          </View>
        ) : (
          <Text style={styles.infoLimite}>
            Limite: R$ {item.limit.toFixed(2)}
          </Text>
        )}
      </View>

      <View style={styles.limiteContainer}>
        {isExcedido ? (
            <Text style={[styles.itemLimite, styles.limiteExcedido]}>
              (Limite: R$ {item.limit.toFixed(2)})
            </Text>
        ) : (
            <Ionicons name="checkmark-circle-outline" size={24} color="#28a745" />
        )}
      </View>
      
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={22} color="#555" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemLista: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginHorizontal: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
  },
  itemExcedido: {
    borderLeftColor: '#dc3545',
    backgroundColor: '#fff8f8',
  },
  infoContainer: {
    flex: 1,
  },
  itemCategoria: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoLimite: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
  },
  infoExcedido: {
      fontSize: 15,
      color: '#dc3545',
      marginTop: 2,
      fontWeight: '600',
  },
  valorExcedente: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  limiteContainer: {
      alignItems: 'flex-end',
      marginHorizontal: 10,
  },
    itemLimite: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  limiteExcedido: {
    fontStyle: 'italic',
    color: '#777',
    fontSize: 13,
  },
  deleteButton: {
    padding: 5,
  }
});
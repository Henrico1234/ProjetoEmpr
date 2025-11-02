// src/components/DebtItem.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type Divida } from '../services/api';

interface Props {
  item: Divida;
  onPress: () => void;
}

export function DebtItem({ item, onPress }: Props) {
  const formatarData = (dataStr: string) => {
    try {
      const [ano, mes, dia] = dataStr.split('-');
      return `${dia}/${mes}/${ano}`;
    } catch (e) {
      return dataStr;
    }
  };
  
  const isPendente = item.Status.toLowerCase() === 'pendente';

  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <View style={[styles.itemLista, !isPendente && styles.itemPago]}>
        
        <View style={styles.infoContainer}>
          <Text style={styles.itemDescricao}>{item.Descricao}</Text>
          <Text style={styles.itemCategoria}>{item.Categoria}</Text>
          <Text style={styles.itemData}>
            Vencimento: {formatarData(item.DataVencimento)}
          </Text>
        </View>
        
        <View style={styles.valorContainer}>
          <Text style={[styles.itemValor, isPendente ? styles.valorPendente : styles.valorPago]}>
            R$ {item.Valor.toFixed(2)}
          </Text>
          <View style={[styles.statusBadge, isPendente ? styles.badgePendente : styles.badgePago]}>
            <Text style={styles.statusTexto}>{item.Status}</Text>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 10,
    marginHorizontal: 15,
  },
  itemLista: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#dc3545',
  },
  itemPago: {
    borderLeftColor: '#28a745',
    backgroundColor: '#f9f9f9',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  valorContainer: {
    alignItems: 'flex-end',
  },
  itemDescricao: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemCategoria: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  itemData: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    fontStyle: 'italic',
  },
  itemValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  valorPendente: {
    color: '#dc3545',
  },
  valorPago: {
    color: '#28a745',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginTop: 5,
  },
  badgePendente: {
    backgroundColor: '#dc3545',
  },
  badgePago: {
    backgroundColor: '#28a745',
  },
  statusTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
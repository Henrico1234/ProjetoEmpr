import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type Transacao } from '../services/api';

interface Props {
  item: Transacao;
  onPress: () => void;
}

export function TransacaoItem({ item, onPress }: Props) {
  const corValor = item.Tipo.toLowerCase() === 'ganho' ? styles.valorGanho : styles.valorDespesa;
  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <View style={styles.itemLista}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemDescricao}>{item.Descricao}</Text>
          <Text style={styles.itemCategoria}>{item.Categoria} | {item.MeioPagamento}</Text>
        </View>
        <Text style={[styles.itemValor, corValor]}>
          {item.Tipo.toLowerCase() === 'ganho' ? '+' : '-'} R$ {item.Valor.toFixed(2)}
        </Text>
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
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemDescricao: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  itemCategoria: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  itemValor: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  valorGanho: {
    color: '#28a745',
  },
  valorDespesa: {
    color: '#dc3545',
  },
});
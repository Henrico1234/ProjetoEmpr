// src/components/LoanItem.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type Emprestimo } from '../services/api';

interface Props {
  item: Emprestimo;
  onPress: () => void;
}

export function LoanItem({ item, onPress }: Props) {
  
  const isRecebido = item.Tipo.toLowerCase() === 'recebido';
  const corValor = isRecebido ? styles.valorRecebido : styles.valorConcedido;
  const corBorda = isRecebido ? styles.bordaRecebido : styles.bordaConcedido;

  const progresso = `${item.ParcelasPagas} / ${item.NumParcelas}`;
  
  const juros = item['Juros%'];
  const valorParcelaAprox = (item.ValorOriginal * (1 + juros / 100)) / item.NumParcelas;

  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <View style={[styles.itemLista, corBorda]}>
        
        <View style={styles.infoContainer}>
          <Text style={styles.itemParte}>{item.ParteEnvolvida}</Text>
          <Text style={styles.itemTipo}>
            {item.Tipo}
          </Text>
          <Text style={styles.itemStatus}>
            Parcelas: {progresso} (Aprox. R$ {valorParcelaAprox.toFixed(2)})
          </Text>
        </View>
        
        <View style={styles.valorContainer}>
          <Text style={[styles.itemValor, corValor]}>
            R$ {item.ValorOriginal.toFixed(2)}
          </Text>
          <Text style={styles.itemJuros}>
            {juros.toFixed(2)}% juros
          </Text>
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
  },
  bordaRecebido: {
    borderLeftColor: '#28a745',
  },
  bordaConcedido: {
    borderLeftColor: '#007bff',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  valorContainer: {
    alignItems: 'flex-end',
  },
  itemParte: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemTipo: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
    fontWeight: 'bold',
  },
  itemStatus: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  itemValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  valorRecebido: {
    color: '#28a745',
  },
  valorConcedido: {
    color: '#007bff',
  },
  itemJuros: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  }
});
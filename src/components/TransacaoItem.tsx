<<<<<<< HEAD
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';
=======
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
import { type Transacao } from '../services/api';

interface Props {
  item: Transacao;
  onPress: () => void;
}

export function TransacaoItem({ item, onPress }: Props) {
<<<<<<< HEAD
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  
  const isGanho = item.Tipo.toLowerCase() === 'ganho';
  const valorFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(item.Valor);

  // Formatar data curta (ex: 26 Out)
  const dataObj = new Date(item.Data);
  const dia = dataObj.getDate().toString().padStart(2, '0');
  // Array simples para meses já que o Intl as vezes falha no Hermes antigo
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const mes = meses[dataObj.getMonth()];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        
        {/* Ícone Esquerdo */}
        <View style={[styles.iconContainer, { backgroundColor: isGanho ? `${colors.success}15` : `${colors.danger}15` }]}>
          <Ionicons 
            name={isGanho ? "arrow-down" : "arrow-up"} 
            size={20} 
            color={isGanho ? colors.success : colors.danger} 
          />
        </View>

        {/* Informações Centrais */}
        <View style={styles.contentContainer}>
          <Text style={[styles.descricao, { color: colors.text }]} numberOfLines={1}>
            {item.Descricao}
          </Text>
          <View style={styles.metaContainer}>
            <Text style={[styles.categoria, { color: colors.textSecondary }]}>
              {item.Categoria} • {item.MeioPagamento}
            </Text>
          </View>
        </View>

        {/* Valor e Data à Direita */}
        <View style={styles.rightContainer}>
          <Text style={[
            styles.valor, 
            { color: isGanho ? colors.success : colors.text } // Despesa com cor normal ou vermelho, sua escolha. Normal fica mais limpo.
          ]}>
            {isGanho ? '+' : '-'} {valorFormatado}
          </Text>
          <Text style={[styles.data, { color: colors.textSecondary }]}>
            {dia} {mes}
          </Text>
        </View>
=======
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
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  wrapper: {
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    // Sombras mais suaves e modernas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  descricao: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoria: {
    fontSize: 13,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  valor: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  data: {
    fontSize: 12,
    fontWeight: '500',
  }
=======
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
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
});
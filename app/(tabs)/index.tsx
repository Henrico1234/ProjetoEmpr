// app/tabs/index.tsx
// (Agora com Exclusão)

import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { AddTransactionModal } from '../../src/components/AddTransactionModal';
import { MonthYearPicker } from '../../src/components/MonthYearPicker';
import { SaldoCard } from '../../src/components/SaldoCard';
import { TransacaoItem } from '../../src/components/TransacaoItem';
import { useMonthlyData } from '../../src/hooks/useMonthlyData';
import { API_URL, type Transacao } from '../../src/services/api';

function getMesAnoAtual(): string {
  const date = new Date('2025-10-26T12:00:00'); 
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${month}-${year}`;
}

export default function GerenciamentoMensalScreen() {
  
  const [monthYear, setMonthYear] = useState(getMesAnoAtual());
  const { isLoading, saldos, transacoes, erro, refreshData } = useMonthlyData(monthYear);
  const [modalVisible, setModalVisible] = useState(false);
  const [listaCategorias, setListaCategorias] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCategorias = async () => {
        try {
          const response = await fetch(`${API_URL}/api/categorias`);
          const data = await response.json();
          if (data.categorias) {
            setListaCategorias(data.categorias);
          }
        } catch (e) { console.error("Falha ao buscar categorias", e); }
      };
      fetchCategorias();
    }, [])
  );

  const handleOpenModal = () => setModalVisible(true);
  
  const handleCloseModal = (sucesso: boolean) => {
    setModalVisible(false);
    if (sucesso) {
      refreshData();
    }
  };

  // --- 2. NOVA LÓGICA DE EXCLUSÃO ---
  const handleItemPress = (item: Transacao) => {
    // Mostra um pop-up de confirmação nativo
    Alert.alert(
      "Excluir Transação", // Título
      `Tem a certeza que deseja excluir "${item.Descricao}"?`, // Mensagem
      [
        // Botão 1: Cancelar
        {
          text: "Cancelar",
          style: "cancel" // Estilo iOS para "cancelar"
        },
        // Botão 2: Excluir (Ação Destrutiva)
        {
          text: "Excluir",
          style: "destructive", // Estilo iOS para "destrutivo" (vermelho)
          onPress: () => deleteTransaction(item.ID.toString()) // Chama a nossa função de API
        }
      ]
    );
  };

  // 3. Função que chama a API DELETE
  const deleteTransaction = async (transaction_id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/transacoes/${monthYear}/${transaction_id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || data.erro) {
        throw new Error(data.detail || 'Erro ao excluir');
      }

      Alert.alert("Sucesso", "Transação excluída!");
      refreshData(); // Recarrega os dados!

    } catch (error: any) {
      Alert.alert("Falha", error.message);
    }
  };
  // --- FIM DA NOVA LÓGICA ---


  if (isLoading && !saldos) { 
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>A buscar dados do mês...</Text>
      </View>
    );
  }
  // (O resto do ecrã de Erro e Loading continua igual...)
  if (erro) {
    return (
      <View style={styles.containerCentro}>
        <Text style={styles.textoErro}>Falha ao buscar dados!</Text>
        <Text>Erro: {erro}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <MonthYearPicker
        currentMonthYear={monthYear}
        onChange={(newMonthYear) => setMonthYear(newMonthYear)}
      />
      
      <SaldoCard saldos={saldos} monthYear={monthYear} />

      <Text style={styles.tituloLista}>Lançamentos do Mês</Text>
      <FlatList
        data={transacoes}
        // 4. Passa a função de "press" para o componente
        renderItem={({ item }) => (
          <TransacaoItem 
            item={item} 
            onPress={() => handleItemPress(item)} // Passa a função de clique
          />
        )}
        keyExtractor={(item: Transacao) => item.ID.toString()}
        ListEmptyComponent={
          <View style={styles.containerCentroVazio}>
            <Text>Nenhuma transação este mês.</Text>
          </View>
        }
        style={styles.lista}
      />

      {/* (O Botão Flutuante e o Modal continuam iguais) */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleOpenModal}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
      
      <AddTransactionModal
        visible={modalVisible}
        onClose={handleCloseModal}
        monthYear={monthYear}
        categorias={listaCategorias}
      />
    </SafeAreaView>
  );
}

// (Os Estilos 'styles' permanecem exatamente os mesmos)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  containerCentro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  containerCentroVazio: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  textoErro: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  tituloLista: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  lista: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    fontSize: 30,
    color: 'white',
    lineHeight: 30,
    paddingBottom: 2,
  },
});
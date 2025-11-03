import { useActionSheet } from '@expo/react-native-action-sheet';
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
import { getMesAnoAtual } from '../../src/utils/date';

export default function GerenciamentoMensalScreen() {
  const [monthYear, setMonthYear] = useState(getMesAnoAtual());
  const { isLoading, saldos, transacoes, erro, refreshData } = useMonthlyData(monthYear);
  const [modalVisible, setModalVisible] = useState(false);
  const [listaCategorias, setListaCategorias] = useState<string[]>([]);
  
  const [selectedItem, setSelectedItem] = useState<Transacao | null>(null);

  const { showActionSheetWithOptions } = useActionSheet();

  useFocusEffect(
    React.useCallback(() => {
      
      refreshData();

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
    }, [refreshData])
  );

  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setModalVisible(true);
  };
  
  const handleOpenEditModal = (item: Transacao) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = (sucesso: boolean) => {
    setModalVisible(false);
    setSelectedItem(null);
    if (sucesso) {
      refreshData();
    }
  };

  const handleItemPress = (item: Transacao) => {
    const options = ['Editar', 'Excluir', 'Cancelar'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: item.Descricao,
        message: `R$ ${item.Valor.toFixed(2)} - ${item.Categoria}`
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            handleOpenEditModal(item);
            break;
          case 1:
            confirmDelete(item);
            break;
          case 2:
            break;
        }
      }
    );
  };

  const confirmDelete = (item: Transacao) => {
    Alert.alert(
      "Excluir Transação",
      `Tem a certeza que deseja excluir "${item.Descricao}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteTransaction(item.ID.toString())
        }
      ]
    );
  };

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
      refreshData();
    } catch (error: any) {
      Alert.alert("Falha", error.message);
    }
  };

  if (isLoading && !saldos) { 
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>A buscar dados do mês...</Text>
      </View>
    );
  }

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
        renderItem={({ item }) => (
          <TransacaoItem 
            item={item} 
            onPress={() => handleItemPress(item)} 
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

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleOpenAddModal}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
      
      <AddTransactionModal
        visible={modalVisible}
        onClose={handleCloseModal}
        monthYear={monthYear}
        categorias={listaCategorias}
        transactionData={selectedItem} 
      />
    </SafeAreaView>
  );
}

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
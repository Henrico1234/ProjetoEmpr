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

import { AddDebtModal } from '../../src/components/AddDebtModal';
import { DebtItem } from '../../src/components/DebtItem';
import { MonthYearPicker } from '../../src/components/MonthYearPicker';
import { useDebts } from '../../src/hooks/useDebts';
import { API_URL, type Divida } from '../../src/services/api';
import { getMesAnoAtual } from '../../src/utils/date';

export default function DividasScreen() {
  const [monthYear, setMonthYear] = useState(getMesAnoAtual());
  
  const { 
    dividas, 
    isLoading, 
    erro, 
    refreshDebts, 
    addDebt, 
    payDebt, 
    deleteDebt 
  } = useDebts(monthYear);
  
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
  
  const { showActionSheetWithOptions } = useActionSheet();

  const handleItemPress = (item: Divida) => {
    
    const options: any[] = [];
    if (item.Status.toLowerCase() === 'pendente') {
      options.push('Marcar como Paga');
    }
    options.push('Excluir Dívida');
    options.push('Cancelar');

    const destructiveButtonIndex = options.indexOf('Excluir Dívida');
    const cancelButtonIndex = options.indexOf('Cancelar');

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: item.Descricao,
        message: `R$ ${item.Valor.toFixed(2)} - Vence em ${item.DataVencimento}`
      },
      (selectedIndex?: number) => {
        const selectedOption = options[selectedIndex ?? -1];
        switch (selectedOption) {
          case 'Marcar como Paga':
            confirmPay(item);
            break;
          case 'Excluir Dívida':
            confirmDelete(item);
            break;
          case 'Cancelar':
            break;
        }
      }
    );
  };
  
  const confirmPay = (item: Divida) => {
    Alert.alert(
      "Pagar Dívida",
      `Tem a certeza que deseja marcar "${item.Descricao}" como paga? \nIsto também irá criar uma transação de despesa no mês ${monthYear}.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar Pagamento",
          style: "default",
          onPress: async () => {
            try {
              await payDebt(item.ID, monthYear);
              Alert.alert("Sucesso", "Dívida paga e transação registrada!");
            } catch (error: any) {
              Alert.alert("Falha", error.message);
            }
          }
        }
      ]
    );
  };
  
  const confirmDelete = (item: Divida) => {
    Alert.alert(
      "Excluir Dívida",
      `Tem a certeza que deseja excluir "${item.Descricao}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDebt(item.ID);
              Alert.alert("Sucesso", "Dívida excluída!");
            } catch (error: any) {
              Alert.alert("Falha", error.message);
            }
          }
        }
      ]
    );
  };
  
  const handleOpenAddModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = (sucesso: boolean) => {
    setModalVisible(false);
  };
  
  if (isLoading && !dividas.length) { 
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>A buscar dívidas do mês...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <MonthYearPicker
        currentMonthYear={monthYear}
        onChange={(newMonthYear) => setMonthYear(newMonthYear)}
      />
      
      <Text style={styles.tituloLista}>Dívidas e Contas ({monthYear})</Text>

      {erro && (
        <View style={styles.containerCentro}>
          <Text style={styles.textoErro}>Falha ao buscar dados: {erro}</Text>
        </View>
      )}

      <FlatList
        data={dividas}
        renderItem={({ item }) => (
          <DebtItem 
            item={item} 
            onPress={() => handleItemPress(item)} 
          />
        )}
        keyExtractor={(item: Divida) => item.ID.toString()}
        ListEmptyComponent={
          !erro ? (
            <View style={styles.containerCentroVazio}>
              <Text>Nenhuma dívida encontrada para este mês.</Text>
            </View>
          ) : null
        }
        style={styles.lista}
        onRefresh={refreshDebts}
        refreshing={isLoading}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleOpenAddModal}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
      
      <AddDebtModal
        visible={modalVisible}
        onClose={handleCloseModal}
        categorias={listaCategorias}
        onSubmit={(novaDivida) => addDebt(novaDivida)}
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
    marginBottom: 15,
    marginTop: 15,
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
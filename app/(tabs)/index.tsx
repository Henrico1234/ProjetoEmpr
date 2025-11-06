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
<<<<<<< HEAD
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
=======
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
import { AddTransactionModal } from '../../src/components/AddTransactionModal';
import { MonthYearPicker } from '../../src/components/MonthYearPicker';
import { SaldoCard } from '../../src/components/SaldoCard';
import { TransacaoItem } from '../../src/components/TransacaoItem';
import { useMonthlyData } from '../../src/hooks/useMonthlyData';
import { API_URL, type Transacao } from '../../src/services/api';
import { getMesAnoAtual } from '../../src/utils/date';

export default function GerenciamentoMensalScreen() {
<<<<<<< HEAD
  // Hooks de Tema
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  // Estados e Lógica existentes
=======
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
  const [monthYear, setMonthYear] = useState(getMesAnoAtual());
  const { isLoading, saldos, transacoes, erro, refreshData } = useMonthlyData(monthYear);
  const [modalVisible, setModalVisible] = useState(false);
  const [listaCategorias, setListaCategorias] = useState<string[]>([]);
<<<<<<< HEAD
=======
  
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
  const [selectedItem, setSelectedItem] = useState<Transacao | null>(null);

  const { showActionSheetWithOptions } = useActionSheet();

  useFocusEffect(
    React.useCallback(() => {
<<<<<<< HEAD
      refreshData();
=======
      
      refreshData();

>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
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

<<<<<<< HEAD
  // Renderização condicional para Loading e Erro
  if (isLoading && !saldos) { 
    return (
      <View style={[styles.containerCentro, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ color: colors.textSecondary, marginTop: 20 }}>A atualizar dados...</Text>
=======
  if (isLoading && !saldos) { 
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>A buscar dados do mês...</Text>
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
      </View>
    );
  }

  if (erro) {
    return (
<<<<<<< HEAD
      <View style={[styles.containerCentro, { backgroundColor: colors.background }]}>
        <Text style={styles.textoErro}>Falha ao buscar dados!</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 10 }}>{erro}</Text>
        <TouchableOpacity onPress={refreshData} style={{ marginTop: 20, padding: 10, backgroundColor: colors.card, borderRadius: 8 }}>
          <Text style={{ color: colors.tint }}>Tentar Novamente</Text>
        </TouchableOpacity>
=======
      <View style={styles.containerCentro}>
        <Text style={styles.textoErro}>Falha ao buscar dados!</Text>
        <Text>Erro: {erro}</Text>
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
      </View>
    );
  }

  return (
<<<<<<< HEAD
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
=======
    <SafeAreaView style={styles.safeArea}>
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
      
      <MonthYearPicker
        currentMonthYear={monthYear}
        onChange={(newMonthYear) => setMonthYear(newMonthYear)}
      />
      
<<<<<<< HEAD
=======
      <SaldoCard saldos={saldos} monthYear={monthYear} />

      <Text style={styles.tituloLista}>Lançamentos do Mês</Text>
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
      <FlatList
        data={transacoes}
        renderItem={({ item }) => (
          <TransacaoItem 
            item={item} 
            onPress={() => handleItemPress(item)} 
          />
        )}
        keyExtractor={(item: Transacao) => item.ID.toString()}
<<<<<<< HEAD
        ListHeaderComponent={
          <>
            <SaldoCard saldos={saldos} monthYear={monthYear} />
            <Text style={[styles.tituloLista, { color: colors.text }]}>Lançamentos Recentes</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.containerCentroVazio}>
            <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
              Nenhuma transação este mês.
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8 }}>
              Toque no botão "+" para começar.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
=======
        ListEmptyComponent={
          <View style={styles.containerCentroVazio}>
            <Text>Nenhuma transação este mês.</Text>
          </View>
        }
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
        style={styles.lista}
      />

      <TouchableOpacity
<<<<<<< HEAD
        style={[styles.floatingButton, { backgroundColor: colors.tint }]}
        onPress={handleOpenAddModal}
        activeOpacity={0.8}
      >
=======
        style={styles.floatingButton}
        onPress={handleOpenAddModal}>
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
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
<<<<<<< HEAD
=======
    backgroundColor: '#f0f4f7',
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
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
<<<<<<< HEAD
    paddingVertical: 60,
    opacity: 0.7,
  },
  textoErro: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
=======
    padding: 20,
    marginTop: 50,
  },
  textoErro: {
    fontSize: 16,
    color: 'red',
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
    textAlign: 'center',
  },
  tituloLista: {
    fontSize: 20,
<<<<<<< HEAD
    fontWeight: '700',
    marginLeft: 24,
    marginBottom: 16,
    marginTop: 8,
    letterSpacing: 0.5,
=======
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 10,
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
  },
  lista: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
<<<<<<< HEAD
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  floatingButtonText: {
    fontSize: 36,
    color: 'white',
    marginTop: -4,
    fontWeight: '300',
=======
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
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
  },
});
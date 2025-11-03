import { useActionSheet } from '@expo/react-native-action-sheet';
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

import { AddLoanModal } from '../src/components/AddLoanModal';
import { LoanItem } from '../src/components/LoanItem';
import { PayLoanModal } from '../src/components/PayLoanModal';
import { useLoans } from '../src/hooks/useLoans';
import { type Emprestimo } from '../src/services/api';

function getMesAnoAtual(): string {
  const date = new Date('2025-10-26T12:00:00'); 
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${month}-${year}`;
}

export default function EmprestimosScreen() {
  const { 
    emprestimos, 
    isLoading, 
    erro, 
    refreshLoans, 
    registerLoan, 
    payInstallment, 
    deleteLoan 
  } = useLoans();
  
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Emprestimo | null>(null);
  
  const { showActionSheetWithOptions } = useActionSheet();

  const handleItemPress = (item: Emprestimo) => {
    setSelectedLoan(item);
    
    const options = ['Pagar Parcela', 'Excluir Empréstimo', 'Cancelar'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: item.ParteEnvolvida,
        message: `Progresso: ${item.ParcelasPagas} / ${item.NumParcelas}`
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            setPayModalVisible(true);
            break;
          case 1:
            confirmDelete(item);
            break;
          case 2:
            setSelectedLoan(null);
            break;
        }
      }
    );
  };
  
  const confirmDelete = (item: Emprestimo) => {
    Alert.alert(
      "Excluir Empréstimo",
      `Tem a certeza que deseja excluir "${item.ParteEnvolvida}"?`,
      [
        { text: "Cancelar", style: "cancel", onPress: () => setSelectedLoan(null) },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteLoan(item.ID);
              Alert.alert("Sucesso", "Empréstimo excluído!");
            } catch (error: any) {
              Alert.alert("Falha", error.message);
            } finally {
              setSelectedLoan(null);
            }
          }
        }
      ]
    );
  };
  
  const handleCloseAddModal = (sucesso: boolean) => {
    setAddModalVisible(false);
  };

  const handleClosePayModal = (sucesso: boolean) => {
    setPayModalVisible(false);
    setSelectedLoan(null);
  };

  if (isLoading && !emprestimos.length) { 
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>A buscar empréstimos ativos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <FlatList
        data={emprestimos}
        renderItem={({ item }) => (
          <LoanItem 
            item={item} 
            onPress={() => handleItemPress(item)} 
          />
        )}
        keyExtractor={(item: Emprestimo) => item.ID.toString()}
        ListHeaderComponent={
          <>
            {erro && (
              <View style={styles.containerCentro}>
                <Text style={styles.textoErro}>Falha ao buscar dados: {erro}</Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !erro && !isLoading ? (
            <View style={styles.containerCentroVazio}>
              <Text>Nenhum empréstimo ativo encontrado.</Text>
            </View>
          ) : null
        }
        style={styles.lista}
        onRefresh={refreshLoans}
        refreshing={isLoading}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setAddModalVisible(true)}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
      
      <AddLoanModal
        visible={addModalVisible}
        onClose={handleCloseAddModal}
        onSubmit={registerLoan}
      />
      
      <PayLoanModal
        visible={payModalVisible}
        onClose={handleClosePayModal}
        onSubmit={payInstallment}
        loan={selectedLoan}
        currentMonthYear={getMesAnoAtual()}
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
    padding: 20,
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
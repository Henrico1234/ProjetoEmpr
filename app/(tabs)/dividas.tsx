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
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { AddDebtModal } from '../../src/components/AddDebtModal';
import { DebtItem } from '../../src/components/DebtItem';
import { MonthYearPicker } from '../../src/components/MonthYearPicker';
import { useDebts } from '../../src/hooks/useDebts';
import { API_URL, type Divida } from '../../src/services/api';
import { getMesAnoAtual } from '../../src/utils/date';

export default function DividasScreen() {
  // Hooks de Tema
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

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
    // Verifica se NÃO está paga para mostrar a opção de pagar
    if (item.Status.toLowerCase() !== 'paga' && item.Status.toLowerCase() !== 'pago') {
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
        message: `R$ ${item.Valor.toFixed(2)} - Vence a ${item.DataVencimento}`
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
      `Deseja marcar "${item.Descricao}" como paga neste mês (${monthYear})?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "default",
          onPress: async () => {
            try {
              await payDebt(item.ID, monthYear);
              Alert.alert("Sucesso", "Dívida paga!");
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
  
  // Renderização condicional para Loading
  if (isLoading && !dividas.length) { 
    return (
      <View style={[styles.containerCentro, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ color: colors.textSecondary, marginTop: 20 }}>A carregar dívidas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      
      <MonthYearPicker
        currentMonthYear={monthYear}
        onChange={(newMonthYear) => setMonthYear(newMonthYear)}
      />
      
      <FlatList
        data={dividas}
        renderItem={({ item }) => (
          <DebtItem 
            item={item} 
            onPress={() => handleItemPress(item)} 
          />
        )}
        keyExtractor={(item: Divida) => item.ID.toString()}
        ListHeaderComponent={
          <View>
             <Text style={[styles.tituloLista, { color: colors.text }]}>
               Contas de {monthYear}
             </Text>
             {erro && (
                <View style={styles.erroContainer}>
                  <Text style={styles.textoErro}>Falha ao buscar: {erro}</Text>
                </View>
              )}
          </View>
        }
        ListEmptyComponent={
          !erro ? (
            <View style={styles.containerCentroVazio}>
              <Text style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center' }}>
                Nenhuma conta ou dívida para este mês.
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8, textAlign: 'center' }}>
                Toque em "+" para agendar um pagamento.
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        style={styles.lista}
        onRefresh={refreshDebts}
        refreshing={isLoading}
      />

      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: colors.tint }]}
        onPress={handleOpenAddModal}
        activeOpacity={0.8}
      >
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
    padding: 40,
    opacity: 0.7,
  },
  erroContainer: {
    padding: 10,
    alignItems: 'center',
  },
  textoErro: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
  tituloLista: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 24,
    marginBottom: 16,
    marginTop: 16,
    letterSpacing: 0.5,
  },
  lista: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
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
  },
});
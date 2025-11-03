import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddBudgetModal } from '../../src/components/AddBudgetModal';
import { BudgetItem } from '../../src/components/BudgetItem';
import { MonthYearPicker } from '../../src/components/MonthYearPicker';
import { useBudget } from '../../src/hooks/useBudget';
import { API_URL, type Orcamento, type OrcamentoExcedido } from '../../src/services/api';

function getMesAnoAtual(): string {
  const date = new Date('2025-10-26T12:00:00'); 
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${month}-${year}`;
}

type BudgetItemType = Orcamento | OrcamentoExcedido;

export default function OrcamentoScreen() {
  const [monthYear, setMonthYear] = useState(getMesAnoAtual());
  
  const { 
    orcamentos, 
    excedidos,
    isLoading, 
    erro, 
    refreshBudgets, 
    setBudget, 
    deleteBudget 
  } = useBudget(monthYear);
  
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
  
  const handleDelete = (item: Orcamento) => {
      Alert.alert(
      "Excluir Orçamento",
      `Tem a certeza que deseja excluir o limite para "${item.category}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBudget(item.category);
              Alert.alert("Sucesso", "Orçamento excluído!");
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
  
  const orcamentosDefinidos = orcamentos.filter(o => 
    !excedidos.some(e => e.Categoria === o.category)
  );

  const sections = [
    {
      title: 'Orçamentos Excedidos',
      data: excedidos as BudgetItemType[],
    },
    {
      title: 'Orçamentos Definidos',
      data: orcamentosDefinidos as BudgetItemType[],
    }
  ].filter(s => s.data.length > 0);

  if (isLoading && !orcamentos.length && !excedidos.length) { 
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>A buscar orçamentos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <MonthYearPicker
        currentMonthYear={monthYear}
        onChange={(newMonthYear) => setMonthYear(newMonthYear)}
      />
      
      {erro && (
        <View style={styles.containerCentro}>
          <Text style={styles.textoErro}>Falha ao buscar dados: {erro}</Text>
        </View>
      )}

      <SectionList<BudgetItemType>
        sections={sections}
        keyExtractor={(item) => (item as OrcamentoExcedido).Categoria || (item as Orcamento).category}
        renderItem={({ item }) => {
            if ('GastoAtual' in item) {
                const orcamentoInfo = orcamentos.find(o => o.category === item.Categoria);
                if (!orcamentoInfo) return null; 
                
                return (
                    <BudgetItem 
                        item={orcamentoInfo}
                        excedidoInfo={item}
                        onDelete={() => handleDelete(orcamentoInfo)}
                    />
                );
            }
            
            return (
                <BudgetItem 
                    item={item as Orcamento}
                    onDelete={() => handleDelete(item as Orcamento)}
                />
            );
        }}
        renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.tituloLista}>{title}</Text>
        )}
        ListEmptyComponent={
          !erro && !isLoading ? (
            <View style={styles.containerCentroVazio}>
              <Text>Nenhum orçamento definido para este mês.</Text>
            </View>
          ) : null
        }
        style={styles.lista}
        onRefresh={refreshBudgets}
        refreshing={isLoading}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleOpenAddModal}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
      
      <AddBudgetModal
        visible={modalVisible}
        onClose={handleCloseModal}
        categorias={listaCategorias}
        onSubmit={(novoOrcamento) => setBudget(novoOrcamento)}
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
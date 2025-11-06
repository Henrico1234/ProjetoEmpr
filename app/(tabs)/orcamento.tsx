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
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { AddBudgetModal } from '../../src/components/AddBudgetModal';
import { BudgetItem } from '../../src/components/BudgetItem';
import { MonthYearPicker } from '../../src/components/MonthYearPicker';
import { useBudget } from '../../src/hooks/useBudget';
import { API_URL, type Orcamento, type OrcamentoExcedido } from '../../src/services/api';
import { getMesAnoAtual } from '../../src/utils/date';

type BudgetItemType = Orcamento | OrcamentoExcedido;

export default function OrcamentoScreen() {
  // Hooks de Tema
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

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
      title: '⚠️ Atenção: Limites Excedidos',
      data: excedidos as BudgetItemType[],
    },
    {
      title: 'Orçamentos Definidos',
      data: orcamentosDefinidos as BudgetItemType[],
    }
  ].filter(s => s.data.length > 0);

  // Renderização condicional para Loading
  if (isLoading && !orcamentos.length && !excedidos.length) { 
    return (
      <View style={[styles.containerCentro, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ color: colors.textSecondary, marginTop: 20 }}>A carregar orçamentos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      
      <MonthYearPicker
        currentMonthYear={monthYear}
        onChange={(newMonthYear) => setMonthYear(newMonthYear)}
      />
      
      {erro && (
        <View style={styles.erroContainer}>
          <Text style={styles.textoErro}>Falha ao buscar dados: {erro}</Text>
        </View>
      )}

      <SectionList<BudgetItemType>
        sections={sections}
        keyExtractor={(item) => (item as OrcamentoExcedido).Categoria || (item as Orcamento).category}
        renderItem={({ item }) => {
            // Verifica se é um item excedido (tem a propriedade GastoAtual)
            if ('GastoAtual' in item) {
                const orcamentoInfo = orcamentos.find(o => o.category === item.Categoria);
                if (!orcamentoInfo) return null; 
                
                return (
                    <BudgetItem 
                        item={orcamentoInfo}
                        excedidoInfo={item as OrcamentoExcedido}
                        onDelete={() => handleDelete(orcamentoInfo)}
                    />
                );
            }
            
            // Item normal de orçamento
            return (
                <BudgetItem 
                    item={item as Orcamento}
                    onDelete={() => handleDelete(item as Orcamento)}
                />
            );
        }}
        renderSectionHeader={({ section: { title } }) => {
          const isAlert = title.includes('⚠️');
          return (
            <Text style={[
              styles.sectionHeader, 
              { color: isAlert ? colors.danger : colors.text, marginTop: isAlert ? 24 : 16 }
            ]}>
              {title}
            </Text>
          );
        }}
        ListEmptyComponent={
          !erro && !isLoading ? (
            <View style={styles.containerCentroVazio}>
              <Text style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center' }}>
                Nenhum orçamento definido para este mês.
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8, textAlign: 'center' }}>
                Toque em "+" para definir limites de gastos por categoria.
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        style={styles.lista}
        onRefresh={refreshBudgets}
        refreshing={isLoading}
      />

      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: colors.tint }]}
        onPress={handleOpenAddModal}
        activeOpacity={0.8}
      >
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 24,
    marginBottom: 8,
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
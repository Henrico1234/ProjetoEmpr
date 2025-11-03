import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategories } from '../src/hooks/useCategories';


export default function CategoriasScreen() {
  
  const { 
    categorias, 
    isLoading, 
    erro, 
    addCategory, 
    deleteCategory 
  } = useCategories();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Erro", "O nome da categoria não pode ser vazio.");
      return;
    }
    
    setIsAdding(true);
    try {
      await addCategory(newCategoryName);
      setNewCategoryName('');
      Alert.alert("Sucesso", "Categoria adicionada!");
    } catch (error: any) {
      Alert.alert("Erro ao Adicionar", error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = (nome: string) => {
    Alert.alert(
      "Excluir Categoria",
      `Tem a certeza que quer excluir "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(nome);
              Alert.alert("Sucesso", "Categoria removida.");
            } catch (error: any) {
              Alert.alert("Erro ao Excluir", error.message);
            }
          },
        },
      ]
    );
  };
  

  if (isLoading) {
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>A buscar categorias...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.titulo}>Gerir Categorias</Text>
      <View style={styles.addFormContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome da nova categoria"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
        />
        <Button
          title={isAdding ? "..." : "Adicionar"}
          onPress={handleAddCategory}
          disabled={isAdding}
        />
      </View>
      {erro && (
        <View style={styles.containerCentro}>
          <Text style={styles.textoErro}>{erro}</Text>
        </View>
      )}

      <FlatList
        data={categorias}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.itemLista}>
            <Text style={styles.itemTexto}>{item}</Text>
            <TouchableOpacity onPress={() => handleDeleteCategory(item)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          !erro ? <Text style={styles.textoVazio}>Nenhuma categoria encontrada.</Text> : null
        }
        style={styles.lista}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerCentro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  addFormContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginRight: 10,
    fontSize: 16,
  },
  lista: {
    flex: 1,
  },
  itemLista: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 20,
  },
  itemTexto: {
    fontSize: 18,
  },
  textoVazio: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  textoErro: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  }
});
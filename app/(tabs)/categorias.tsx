// app/tabs/categorias.tsx

import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';

// CORREÇÃO: Importa o SafeAreaView da biblioteca correta,
// isto corrige o outro aviso que viste no log.
import { SafeAreaView } from 'react-native-safe-area-context';

// CORREÇÃO: Usa o caminho relativo correto para o teu serviço de API
import { API_URL } from '../../src/services/api';

// Define a "forma" da resposta da API
interface CategoriaResponse {
  categorias?: string[];
  erro?: string;
}

// CORREÇÃO: Adiciona o "export default" que estava em falta
export default function CategoriasScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categorias`);
        const data: CategoriaResponse = await response.json();
        if (data.erro) {
          throw new Error(data.erro);
        }
        setCategorias(data.categorias || []);
      } catch (error: any) {
        console.error("Erro ao buscar categorias:", error);
        setErro(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    buscarCategorias();
  }, []); 

  if (isLoading) {
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>A buscar categorias...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.containerCentro}>
        <Text style={styles.textoErro}>Falha ao buscar categorias!</Text>
        <Text>Erro: {erro}</Text>
      </View>
    );
  }

  return (
    // Usa o SafeAreaView (da 'react-native-safe-area-context')
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.titulo}>Minhas Categorias</Text>
      <FlatList
        data={categorias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemLista}>
            <Text style={styles.itemTexto}>{item}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.itemTexto}>Nenhuma categoria encontrada.</Text>}
      />
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerCentro: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20, // Adiciona margem no topo
    paddingHorizontal: 20,
  },
  itemLista: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 20, // Adiciona margem horizontal
  },
  itemTexto: {
    fontSize: 18,
    textAlign: 'center', // Centraliza o texto (bom para o ListEmpty)
  },
  textoErro: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  }
});
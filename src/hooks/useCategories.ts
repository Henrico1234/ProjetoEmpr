

import { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../services/api';

export function useCategories() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setErro(null);

    try {
      const response = await fetch(`${API_URL}/api/categorias`);
      if (!response.ok) throw new Error('Falha ao buscar dados.');
      
      const data = await response.json();
      if (data.erro) throw new Error(data.erro);

      setCategorias(data.categorias || []);
      
    } catch (error: any) {
      console.error("Erro ao buscar categorias:", error);
      setErro(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (nome: string) => {
    try {
      const response = await fetch(`${API_URL}/api/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao adicionar');
      }
      await fetchCategories();
      
    } catch (error: any) {
      console.error("Erro ao adicionar categoria:", error);
      throw error; 
    }
  };

  const deleteCategory = async (nome: string) => {
    try {
      const nomeCodificado = encodeURIComponent(nome);
      
      const response = await fetch(`${API_URL}/api/categorias/${nomeCodificado}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao excluir');
      }
      await fetchCategories();

    } catch (error: any) {
      console.error("Erro ao excluir categoria:", error);
      throw error;
    }
  };

  return { 
    categorias, 
    isLoading, 
    erro, 
    refreshCategories: fetchCategories,
    addCategory, 
    deleteCategory 
  };
}
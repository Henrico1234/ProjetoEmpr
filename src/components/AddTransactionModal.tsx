// src/components/AddTransactionModal.tsx

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
// Caminho relativo corrigido
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../services/api';

interface Props {
  visible: boolean;
  monthYear: string;
  categorias: string[];
  onClose: (sucesso: boolean) => void;
}

export function AddTransactionModal({ visible, monthYear, categorias, onClose }: Props) {
  const [tipo, setTipo] = useState<'Ganho' | 'Despesa'>('Despesa');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState(categorias[0] || '');
  const [meioPagamento, setMeioPagamento] = useState('Conta');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (categorias.length > 0 && !categoria) {
      setCategoria(categorias[0]);
    }
  }, [categorias, categoria]); // Corrigido para evitar loops


  const handleSave = async () => {
    const valorFloat = parseFloat(valor.replace(',', '.'));
    if (!descricao || !valorFloat || valorFloat <= 0 || !categoria) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    setIsSaving(true);

    const payload = {
      Data: new Date().toISOString().split('T')[0], // Data de hoje YYYY-MM-DD
      Tipo: tipo,
      Descricao: descricao,
      Categoria: categoria,
      Valor: valorFloat,
      MeioPagamento: meioPagamento,
    };

    try {
      const response = await fetch(`${API_URL}/api/transacoes/${monthYear}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.erro) {
        throw new Error(data.detail || 'Erro desconhecido do servidor');
      }

      Alert.alert('Sucesso!', 'Transação adicionada.');
      resetForm();
      onClose(true); 

    } catch (error: any) {
      Alert.alert('Falha na API', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setTipo('Despesa');
    setDescricao('');
    setValor('');
    setCategoria(categorias[0] || '');
    setMeioPagamento('Conta');
  };

  const handleClose = () => {
    resetForm();
    onClose(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Nova Transação ({monthYear})</Text>

          <Text style={styles.label}>Tipo:</Text>
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue as 'Ganho' | 'Despesa')}>
            <Picker.Item label="Despesa" value="Despesa" />
            <Picker.Item label="Ganho" value="Ganho" />
          </Picker>

          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Conta de Luz"
            value={descricao}
            onChangeText={setDescricao}
          />

          <Text style={styles.label}>Valor (R$):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 150,00"
            keyboardType="numeric"
            value={valor}
            onChangeText={setValor}
          />

          <Text style={styles.label}>Categoria:</Text>
          <Picker
            selectedValue={categoria}
            onValueChange={(itemValue) => setCategoria(itemValue)}>
            {categorias.map((cat) => (
              <Picker.Item label={cat} value={cat} key={cat} />
            ))}
          </Picker>
          
          <Text style={styles.label}>Meio de Pagamento:</Text>
          <Picker
            selectedValue={meioPagamento}
            onValueChange={(itemValue) => setMeioPagamento(itemValue)}>
            <Picker.Item label="Conta" value="Conta" />
            <Picker.Item label="Dinheiro em Mãos" value="Dinheiro em Mãos" />
          </Picker>

          <View style={styles.buttonRow}>
            <Button title="Cancelar" onPress={handleClose} color="red" />
            <Button title={isSaving ? 'A guardar...' : 'Guardar'} onPress={handleSave} disabled={isSaving} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Estilos
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  input: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
});
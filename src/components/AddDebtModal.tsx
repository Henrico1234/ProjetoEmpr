
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { type NovaDivida } from '../services/api';

interface Props {
  visible: boolean;
  categorias: string[];
  onClose: (sucesso: boolean) => void;
  onSubmit: (novaDivida: NovaDivida) => Promise<boolean>;
}

export function AddDebtModal({
  visible,
  categorias,
  onClose,
  onSubmit,
}: Props) {
  
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [categoria, setCategoria] = useState(categorias[0] || '');
  const [status, setStatus] = useState('Pendente');
  const [recorrencia, setRecorrencia] = useState('Nunca');
  const [recorrenciaMeses, setRecorrenciaMeses] = useState('0');
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const valorFloat = parseFloat(valor.replace(',', '.'));
    const mesesInt = parseInt(recorrenciaMeses, 10) || 0;

    if (!descricao || !valorFloat || valorFloat <= 0 || !categoria || !dataVencimento) {
      Alert.alert('Erro', 'Preencha Descrição, Valor, Data de Vencimento e Categoria.');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataVencimento)) {
        Alert.alert('Erro', 'Data de Vencimento deve estar no formato AAAA-MM-DD.');
        return;
    }

    setIsSaving(true);

    const payload: NovaDivida = {
      description: descricao,
      value: valorFloat,
      due_date: dataVencimento,
      status: status,
      recurrence: recorrencia,
      recurrence_months: mesesInt,
      category: categoria,
    };

    try {
      const sucesso = await onSubmit(payload);
      if (sucesso) {
        Alert.alert('Sucesso!', 'Nova dívida adicionada.');
        resetForm();
        onClose(true);
      }
    } catch (error: any) {
      Alert.alert('Falha na API', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setDescricao('');
    setValor('');
    setDataVencimento('');
    setCategoria(categorias[0] || '');
    setStatus('Pendente');
    setRecorrencia('Nunca');
    setRecorrenciaMeses('0');
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
          <ScrollView style={{width: '100%'}}>
            <Text style={styles.modalTitle}>Adicionar Dívida/Conta</Text>

            <Text style={styles.label}>Descrição:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Fatura Cartão de Crédito"
              value={descricao}
              onChangeText={setDescricao}
            />
            
            <Text style={styles.label}>Valor (R$):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 500,00"
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
            />
            
            <Text style={styles.label}>Data Vencimento (AAAA-MM-DD):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2025-11-20"
              value={dataVencimento}
              onChangeText={setDataVencimento}
            />

            <Text style={styles.label}>Categoria:</Text>
            <Picker
              selectedValue={categoria}
              onValueChange={(itemValue: string) => setCategoria(itemValue)}>
              {categorias.map((cat) => (
                <Picker.Item label={cat} value={cat} key={cat} />
              ))}
            </Picker>
            
            <Text style={styles.label}>Status Inicial:</Text>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue: string) => setStatus(itemValue)}>
              <Picker.Item label="Pendente" value="Pendente" />
              <Picker.Item label="Paga" value="Paga" />
            </Picker>
            
            <Text style={styles.label}>Recorrência:</Text>
            <Picker
              selectedValue={recorrencia}
              onValueChange={(itemValue: string) => setRecorrencia(itemValue)}>
              <Picker.Item label="Nunca" value="Nunca" />
              <Picker.Item label="Mensal" value="Mensal" />
              <Picker.Item label="Anual" value="Anual" />
            </Picker>
            
            {recorrencia !== 'Nunca' && (
               <View>
                 <Text style={styles.label}>Repetir por (Meses):</Text>
                 <TextInput
                   style={styles.input}
                   placeholder="Quantos meses?"
                   keyboardType="numeric"
                   value={recorrenciaMeses}
                   onChangeText={setRecorrenciaMeses}
                 />
               </View>
            )}

            <View style={styles.buttonRow}>
              <Button title="Cancelar" onPress={handleClose} color="red" />
              <Button title={isSaving ? 'A guardar...' : 'Guardar'} onPress={handleSave} disabled={isSaving} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
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
    marginBottom: 15,
  },
});
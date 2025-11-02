// src/components/AddLoanModal.tsx

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
import { type NovoEmprestimo } from '../services/api';

interface Props {
  visible: boolean;
  onClose: (sucesso: boolean) => void;
  onSubmit: (novoEmprestimo: NovoEmprestimo) => Promise<boolean>;
}

export function AddLoanModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  
  const [tipo, setTipo] = useState('Recebido');
  const [parte, setParte] = useState('');
  const [valor, setValor] = useState('');
  const [juros, setJuros] = useState('');
  const [parcelas, setParcelas] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const valorFloat = parseFloat(valor.replace(',', '.'));
    const jurosFloat = parseFloat(juros.replace(',', '.'));
    const parcelasInt = parseInt(parcelas, 10);
    
    if (!parte || !valorFloat || valorFloat <= 0 || !parcelasInt || parcelasInt <= 0 || jurosFloat < 0) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente (Valor, Juros e Parcelas devem ser números válidos).');
      return;
    }

    setIsSaving(true);

    const payload: NovoEmprestimo = {
      loan_type: tipo,
      involved_party: parte,
      original_value: valorFloat,
      interest_rate: jurosFloat,
      num_installments: parcelasInt,
    };

    try {
      const sucesso = await onSubmit(payload);
      if (sucesso) {
        Alert.alert('Sucesso!', 'Empréstimo registrado.');
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
    setTipo('Recebido');
    setParte('');
    setValor('');
    setJuros('');
    setParcelas('');
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
            <Text style={styles.modalTitle}>Registrar Empréstimo</Text>

            <Text style={styles.label}>Tipo:</Text>
            <Picker
              selectedValue={tipo}
              onValueChange={(itemValue: string) => setTipo(itemValue)}>
              <Picker.Item label="Recebido (Eu peguei)" value="Recebido" />
              <Picker.Item label="Concedido (Eu emprestei)" value="Concedido" />
            </Picker>

            <Text style={styles.label}>Parte Envolvida:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Banco X, João Silva"
              value={parte}
              onChangeText={setParte}
            />
            
            <Text style={styles.label}>Valor Original (R$):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 10000,00"
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
            />
            
            <Text style={styles.label}>Taxa de Juros (%):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5.0"
              keyboardType="numeric"
              value={juros}
              onChangeText={setJuros}
            />
            
            <Text style={styles.label}>Número de Parcelas:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 12"
              keyboardType="numeric"
              value={parcelas}
              onChangeText={setParcelas}
            />

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
    maxHeight: '85%',
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
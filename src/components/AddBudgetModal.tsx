import { Picker } from '@react-native-picker/picker';
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
import { type NovoOrcamento } from '../services/api';

interface Props {
  visible: boolean;
  categorias: string[]; 
  onClose: (sucesso: boolean) => void;
  onSubmit: (orcamento: NovoOrcamento) => Promise<boolean>;
}

export function AddBudgetModal({
  visible,
  categorias,
  onClose,
  onSubmit,
}: Props) {
  
  const [categoria, setCategoria] = useState(categorias[0] || '');
  const [limite, setLimite] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
     if (visible && categorias.length > 0 && !categoria) {
         setCategoria(categorias[0]);
     }
  }, [visible, categorias]);

  const handleSave = async () => {
    const valorFloat = parseFloat(limite.replace(',', '.'));
    
    if (!categoria || !valorFloat || valorFloat <= 0) {
      Alert.alert('Erro', 'Preencha a Categoria e um Limite válido (maior que zero).');
      return;
    }

    setIsSaving(true);

    const payload: NovoOrcamento = {
      category: categoria,
      limit: valorFloat,
    };

    try {
      const sucesso = await onSubmit(payload);
      if (sucesso) {
        Alert.alert('Sucesso!', 'Orçamento definido.');
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
    setLimite('');
    setCategoria(categorias[0] || '');
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
          <Text style={styles.modalTitle}>Definir Orçamento</Text>

          <Text style={styles.label}>Categoria:</Text>
          <Picker
            selectedValue={categoria}
            onValueChange={(itemValue: string) => setCategoria(itemValue)}>
            {categorias.map((cat) => (
              <Picker.Item label={cat} value={cat} key={cat} />
            ))}
          </Picker>
          
          <Text style={styles.label}>Limite (R$):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 800,00"
            keyboardType="numeric"
            value={limite}
            onChangeText={setLimite}
          />

          <View style={styles.buttonRow}>
            <Button title="Cancelar" onPress={handleClose} color="red" />
            <Button title={isSaving ? 'A guardar...' : 'Guardar'} onPress={handleSave} disabled={isSaving} />
          </View>
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
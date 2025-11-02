// src/components/PayLoanModal.tsx

import React, { useState } from 'react';
import {
    Alert,
    Button,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { type Emprestimo, type PagamentoEmprestimo } from '../services/api';

interface Props {
  visible: boolean;
  loan: Emprestimo | null;
  currentMonthYear: string;
  onClose: (sucesso: boolean) => void;
  onSubmit: (loan_id: string, pagamento: PagamentoEmprestimo) => Promise<boolean>;
}

export function PayLoanModal({
  visible,
  loan,
  currentMonthYear,
  onClose,
  onSubmit,
}: Props) {
  
  const [valor, setValor] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!loan) return;
    
    const valorFloat = parseFloat(valor.replace(',', '.'));
    
    if (!valorFloat || valorFloat <= 0) {
      Alert.alert('Erro', 'Insira um valor de pagamento válido.');
      return;
    }

    setIsSaving(true);

    const payload: PagamentoEmprestimo = {
      month_year: currentMonthYear,
      amount_paid: valorFloat,
    };

    try {
      const sucesso = await onSubmit(loan.ID, payload);
      if (sucesso) {
        Alert.alert('Sucesso!', 'Pagamento da parcela registrado.');
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
    setValor('');
  };

  const handleClose = () => {
    resetForm();
    onClose(false); 
  };
  
  const valorParcelaAprox = loan ? (loan.ValorOriginal * (1 + loan["Juros%"] / 100)) / loan.NumParcelas : 0;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Pagar Parcela</Text>
          
          <Text style={styles.loanInfo}>{loan?.ParteEnvolvida}</Text>
          <Text style={styles.loanInfoSub}>Valor aprox. da parcela: R$ {valorParcelaAprox.toFixed(2)}</Text>

          <Text style={styles.label}>Valor Pago (R$):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 550,00"
            keyboardType="numeric"
            value={valor}
            onChangeText={setValor}
          />

          <Text style={styles.label}>Mês da Transação (Automático):</Text>
          <TextInput
            style={styles.input}
            value={currentMonthYear}
            editable={false}
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
    marginBottom: 10,
    textAlign: 'center',
  },
  loanInfo: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      color: '#333',
  },
  loanInfoSub: {
      fontSize: 14,
      textAlign: 'center',
      color: '#666',
      marginBottom: 20,
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
    backgroundColor: '#f5f5f5'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
});
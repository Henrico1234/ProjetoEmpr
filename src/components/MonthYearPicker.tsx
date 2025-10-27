// src/components/MonthYearPicker.tsx

import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// A biblioteca que acabámos de instalar
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

// Formata um objeto Date para o nosso formato "MM-YYYY"
function formatMonthYear(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${month}-${year}`;
}

// Props que o componente vai receber
interface Props {
  currentMonthYear: string;
  onChange: (newMonthYear: string) => void;
}

export function MonthYearPicker({ currentMonthYear, onChange }: Props) {
  // Converte a string "MM-YYYY" de volta para um objeto Date
  const [month, year] = currentMonthYear.split('-').map(Number);
  const [date, setDate] = useState(new Date(year, month - 1, 1));

  const [showPicker, setShowPicker] = useState(false);

  // Função chamada quando o seletor de data é alterado
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Esconde o seletor (especialmente no Android)
    setShowPicker(false); 

    if (event.type === 'set' && selectedDate) {
      // O utilizador confirmou uma data
      const newDate = selectedDate;
      setDate(newDate);
      onChange(formatMonthYear(newDate)); // Envia a nova string "MM-YYYY" para o ecrã "pai"
    }
  };

  return (
    <View>
      {/* O Botão que mostra o mês/ano atual */}
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.pickerButton}>
        <Text style={styles.pickerButtonText}>Mês: {currentMonthYear}</Text>
      </TouchableOpacity>

      {/* O Seletor de Data (que está escondido até ser ativado) */}
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date" // Modo de data (mês/dia/ano)
          display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Aparência
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    backgroundColor: '#e7e7e7',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 15, // Alinha com o Card
    marginTop: 10,
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
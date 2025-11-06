
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
function formatMonthYear(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${month}-${year}`;
}

interface Props {
  currentMonthYear: string;
  onChange: (newMonthYear: string) => void;
}

export function MonthYearPicker({ currentMonthYear, onChange }: Props) {
  const [month, year] = currentMonthYear.split('-').map(Number);
  const [date, setDate] = useState(new Date(year, month - 1, 1));

  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false); 

    if (event.type === 'set' && selectedDate) {
      const newDate = selectedDate;
      setDate(newDate);
      onChange(formatMonthYear(newDate));
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.pickerButton}>
        <Text style={styles.pickerButtonText}>Mês: {currentMonthYear}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
    marginHorizontal: 15,
    marginTop: 10,
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
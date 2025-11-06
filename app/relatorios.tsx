import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { useReports } from '../src/hooks/useReports';
import { API_URL } from '../src/services/api';

function formatarData(date: Date): string {
  const ano = date.getFullYear();
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const dia = date.getDate().toString().padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export default function RelatoriosScreen() {
  const { summary, isLoading, erro, fetchSummary } = useReports();
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(null);
    if (event.type === 'set' && selectedDate) {
      if (showPicker === 'start') {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const handleFetchSummary = () => {
    const start = formatarData(startDate);
    const end = formatarData(endDate);
    fetchSummary(start, end);
  };

  const handleDownload = async (fileType: 'pdf' | 'csv') => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Erro", "A partilha não está disponível neste dispositivo.");
      return;
    }

    setIsDownloading(true);
    const start = formatarData(startDate);
    const end = formatarData(endDate);
    
    const url = `${API_URL}/api/reports/export/${fileType}/?start_date=${start}&end_date=${end}`;
    const fileExtension = fileType === 'pdf' ? '.pdf' : '.csv';
    const fileName = `relatorio_${start}_a_${end}${fileExtension}`;
    const localUri = FileSystem.documentDirectory + fileName;

    try {
      const { uri } = await FileSystem.downloadAsync(url, localUri);
      
      await Sharing.shareAsync(uri, {
        dialogTitle: 'Partilhar Relatório',
        mimeType: fileType === 'pdf' ? 'application/pdf' : 'text/csv',
      });

    } catch (error: any) {
      console.error("Erro no download:", error);
      Alert.alert("Erro de Download", "Não foi possível descarregar o ficheiro.");
    } finally {
      setIsDownloading(false);
    }
  };

  const renderCategorias = (data: { [key: string]: number }, title: string) => {
    const entries = Object.entries(data);
    if (entries.length === 0) return null;
    
    return (
      <View style={styles.categoriaContainer}>
        <Text style={styles.categoriaTitulo}>{title}</Text>
        {entries.map(([key, value]) => (
          <View style={styles.categoriaLinha} key={key}>
            <Text style={styles.categoriaNome}>{key}</Text>
            <Text style={styles.categoriaValor}>R$ {value.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.titulo}>Relatório Financeiro</Text>
          
          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={() => setShowPicker('start')} style={styles.dateButton}>
              <Text>Início: {formatarData(startDate)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPicker('end')} style={styles.dateButton}>
              <Text>Fim: {formatarData(endDate)}</Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={showPicker === 'start' ? startDate : endDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <Button title="Gerar Resumo" onPress={handleFetchSummary} disabled={isLoading} />

          {isLoading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}

          {erro && <Text style={styles.textoErro}>{erro}</Text>}

          {summary && !isLoading && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Resumo do Período</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ganhos Totais:</Text>
                <Text style={[styles.summaryValue, styles.ganho]}>R$ {summary.Ganhos_Totais.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Despesas Totais:</Text>
                <Text style={[styles.summaryValue, styles.despesa]}>R$ {summary.Despesas_Totais.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.summaryLabelTotal}>Saldo Líquido:</Text>
                <Text style={[styles.summaryValueTotal, summary.Saldo_Total >= 0 ? styles.ganho : styles.despesa]}>
                  R$ {summary.Saldo_Total.toFixed(2)}
                </Text>
              </View>

              {renderCategorias(summary.Despesas_por_Categoria, "Despesas por Categoria")}
              {renderCategorias(summary.Ganhos_por_Categoria, "Ganhos por Categoria")}
              
              <View style={styles.downloadContainer}>
                <Button title="Exportar PDF" onPress={() => handleDownload('pdf')} disabled={isDownloading} />
                <View style={{width: 10}} />
                <Button title="Exportar CSV" onPress={() => handleDownload('csv')} disabled={isDownloading} />
              </View>
              {isDownloading && <ActivityIndicator size="small" color="#007bff" />}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  container: {
    padding: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loader: {
    marginTop: 30,
  },
  textoErro: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  summaryContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
    paddingTop: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryLabelTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ganho: {
    color: '#28a745',
  },
  despesa: {
    color: '#dc3545',
  },
  categoriaContainer: {
    marginTop: 20,
  },
  categoriaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 5,
  },
  categoriaLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 5,
  },
  categoriaNome: {
    color: '#333',
  },
  categoriaValor: {
    fontWeight: '600',
  },
  downloadContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
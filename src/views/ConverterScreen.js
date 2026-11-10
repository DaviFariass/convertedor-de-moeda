// src/views/ConverterScreen.js

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useCurrencyConverter } from '../viewmodels/useCurrencyConverter';

export default function ConverterScreen() {
  const {
    amount,
    fromCurrency,
    toCurrency,
    currencies,
    convertedValue,
    rate,
    rateDate,
    isLoadingCurrencies,
    isConverting,
    error,
    setAmount,
    setFromCurrency,
    setToCurrency,
    convert,
    swapCurrencies,
  } = useCurrencyConverter();

  const formatCurrency = (value, currencyCode) => {
    if (value === null) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  };

  const isWeb = Platform.OS === 'web';

  return (
    <LinearGradient
      colors={['#0A1128', '#112244', '#0A1128']}
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Conversor de Moedas</Text>
            <View style={styles.stripeContainer}>
              <View style={styles.stripeRed} />
              <View style={styles.stripeWhite} />
            </View>
          </View>

          {/* Card Principal */}
          <View style={styles.glassCard}>
            
            {/* Campo de valor */}
            <Text style={styles.label}>VALOR</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#6B7280"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              editable={!isConverting}
            />

            {/* Seletores de moedas */}
            {isLoadingCurrencies ? (
              <ActivityIndicator size="small" color="#CC0000" style={{ marginVertical: 20 }} />
            ) : (
              <>
                <Text style={styles.label}>DE</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={fromCurrency}
                    onValueChange={(itemValue) => setFromCurrency(itemValue)}
                    enabled={!isConverting}
                    style={styles.picker}
                    dropdownIconColor="#CC0000"
                  >
                    {currencies.map((c) => (
                      <Picker.Item 
                        key={c.code} 
                        label={`${c.code} - ${c.name}`} 
                        value={c.code} 
                        color={isWeb ? '#000' : '#FFF'} 
                      />
                    ))}
                  </Picker>
                </View>

                {/* Botão inverter */}
                <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies} disabled={isConverting}>
                  <Text style={styles.swapText}>⇅ Inverter Moedas</Text>
                </TouchableOpacity>

                <Text style={styles.label}>PARA</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={toCurrency}
                    onValueChange={(itemValue) => setToCurrency(itemValue)}
                    enabled={!isConverting}
                    style={styles.picker}
                    dropdownIconColor="#CC0000"
                  >
                    {currencies.map((c) => (
                      <Picker.Item 
                        key={c.code} 
                        label={`${c.code} - ${c.name}`} 
                        value={c.code} 
                        color={isWeb ? '#000' : '#FFF'} 
                      />
                    ))}
                  </Picker>
                </View>
              </>
            )}

            {/* Botão converter */}
            <TouchableOpacity
              onPress={convert}
              disabled={isConverting || isLoadingCurrencies}
              activeOpacity={0.8}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={isConverting || isLoadingCurrencies ? ['#374151', '#4B5563'] : ['#0033A0', '#CC0000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {isConverting ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>CONVERTER</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

          </View>

          {/* Área de resultado */}
          {convertedValue !== null && !isConverting && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>RESULTADO DA CONVERSÃO</Text>
              
              <Text style={styles.resultValue}>
                {formatCurrency(convertedValue, toCurrency)}
              </Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.resultDetail}>
                {formatCurrency(parseFloat(amount.replace(',', '.')), fromCurrency)} equivale a
              </Text>
              
              {rate && (
                <Text style={styles.rateText}>
                  Taxa: 1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                </Text>
              )}
              {rateDate && (
                <Text style={styles.rateText}>
                  Data: {rateDate}
                </Text>
              )}
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stripeContainer: {
    flexDirection: 'row',
    marginTop: 8,
    height: 4,
    width: 60,
    overflow: 'hidden',
  },
  stripeRed: {
    flex: 1,
    backgroundColor: '#CC0000',
  },
  stripeWhite: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  glassCard: {
    backgroundColor: 'rgba(17, 34, 68, 0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgb(255, 255, 255))',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D1D5DB',
    letterSpacing: 1,
    marginBottom: 4,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#0A1128',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pickerWrapper: {
    backgroundColor: '#0A1128',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 4,
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    height: 44,
    ...(Platform.OS === 'web' && { color: '#FFF' })
  },
  swapButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    marginVertical: 4,
  },
  swapText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  errorText: {
    color: '#FF4D4D',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
    fontSize: 12,
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: 'rgba(0, 51, 160, 0.2)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(204, 0, 0, 0.4)',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CC0000',
    marginBottom: 8,
    letterSpacing: 1,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  divider: {
    width: '30%',
    height: 2,
    backgroundColor: 'rgba(204, 0, 0, 0.5)',
    marginVertical: 10,
  },
  resultDetail: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  rateText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
});
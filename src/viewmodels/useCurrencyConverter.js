
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchCurrencies, fetchRate } from '../models/currencyModel';

export function useCurrencyConverter() {
  const [amount, setAmountState] = useState('');
  const [fromCurrency, setFromCurrencyState] = useState('USD');
  const [toCurrency, setToCurrencyState] = useState('BRL');
  const [currencies, setCurrencies] = useState([]);

  const [convertedValue, setConvertedValue] = useState(null);
  const [rate, setRate] = useState(null);
  const [rateDate, setRateDate] = useState(null);

  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');

  const requestId = useRef(0);

  // Limpa os dados de uma conversão anterior
  const clearResult = useCallback(() => {
    setConvertedValue(null);
    setRate(null);
    setRateDate(null);
  }, []);

  // Atualizações dos campos
  const setAmount = useCallback((value) => {
    setAmountState(value);
    clearResult();
    setError('');
  }, [clearResult]);

  const setFromCurrency = useCallback((value) => {
    setFromCurrencyState(value);
    clearResult();
    setError('');
  }, [clearResult]);

  const setToCurrency = useCallback((value) => {
    setToCurrencyState(value);
    clearResult();
    setError('');
  }, [clearResult]);

  // Carrega as moedas disponíveis na API
  const loadCurrencies = useCallback(async () => {
    try {
      setIsLoadingCurrencies(true);
      setError('');

      const list = await fetchCurrencies();

      setCurrencies(list);

      const initialFrom = list.some((c) => c.code === 'USD')
        ? 'USD'
        : list[0]?.code || '';

      const initialTo = list.some((c) => c.code === 'BRL')
        ? 'BRL'
        : list.find((c) => c.code !== initialFrom)?.code || '';

      setFromCurrencyState(initialFrom);
      setToCurrencyState(initialTo);

    } catch (err) {
      setError(err.message || 'Falha ao carregar as moedas.');
    } finally {
      setIsLoadingCurrencies(false);
    }
  }, []);

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  // Valida os dados antes de consultar a API
  const convert = useCallback(async () => {
    setError('');

    if (!amount.trim()) {
      setError('Informe o valor que deseja converter.');
      return;
    }

    // Aceita ponto ou vírgula como separador decimal.
    // Não aceita milhares ou vários separadores.
    const normalizedAmount = amount.trim().replace(',', '.');

    if (!/^-?\d+(\.\d+)?$/.test(normalizedAmount)) {
      setError('Digite um valor numérico válido. Exemplo: 10,50.');
      return;
    }

    const numericValue = Number(normalizedAmount);

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setError('O valor deve ser maior que zero.');
      return;
    }

    if (
      !fromCurrency ||
      !toCurrency ||
      !currencies.some((c) => c.code === fromCurrency) ||
      !currencies.some((c) => c.code === toCurrency)
    ) {
      setError('Selecione moedas válidas.');
      return;
    }

    if (fromCurrency === toCurrency) {
      setError('Escolha moedas diferentes para realizar a conversão.');
      return;
    }

    const currentRequest = ++requestId.current;

    setIsConverting(true);
    clearResult();

    try {
      const data = await fetchRate(fromCurrency, toCurrency);

      // Evita utilizar uma resposta de uma consulta anterior.
      if (currentRequest !== requestId.current) return;

      const result = numericValue * data.rate;

      setConvertedValue(result);
      setRate(data.rate);
      setRateDate(data.date);

    } catch (err) {
      if (currentRequest !== requestId.current) return;

      setError(err.message || 'Erro ao consultar a taxa de câmbio.');

    } finally {
      if (currentRequest === requestId.current) {
        setIsConverting(false);
      }
    }
  }, [
    amount,
    fromCurrency,
    toCurrency,
    currencies,
    clearResult,
  ]);

  // Inverte as moedas selecionadas
  const swapCurrencies = useCallback(() => {
    setFromCurrencyState(toCurrency);
    setToCurrencyState(fromCurrency);

    clearResult();
    setError('');
  }, [fromCurrency, toCurrency, clearResult]);

  return {
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
    loadCurrencies,
  };
}

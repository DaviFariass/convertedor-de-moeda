
const BASE_URL = 'https://api.frankfurter.dev/v2';

export async function fetchCurrencies() {
  const response = await fetch(`${BASE_URL}/currencies`);
  if (!response.ok) {
    throw new Error('Não foi possível carregar a lista de moedas.');
  }
  
  const data = await response.json();
  
  if (Array.isArray(data)) {
    return data.map(item => ({
      code: item.code || item.iso_code || String(item),
      name: item.name || item.currency_name || String(item)
    }));
  }
  
  return Object.entries(data).map(([code, name]) => ({ code, name }));
}

export async function fetchRate(base, quote) {
  const response = await fetch(`${BASE_URL}/rate/${base}/${quote}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Taxa de câmbio não encontrada.');
  }
  
  const data = await response.json();
  return data;
}
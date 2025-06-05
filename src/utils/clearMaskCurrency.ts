export function clearMaskCurrency(currency: string | number) {
  if (typeof currency === 'number') {
    currency = currency.toString();
  }


  currency = currency.replace(/\./g, '')

  currency = currency.replace(/,/g, '.')

  currency = currency.replace(/[^\d.]/g, '');

  return Number(currency);
}
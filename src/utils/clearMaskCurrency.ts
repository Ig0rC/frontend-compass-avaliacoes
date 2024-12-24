export function clearMaskCurrency(currency: string) {

  currency = currency.replace(/\./g, '')

  currency = currency.replace(/,/g, '.')

  currency = currency.replace(/[^\d.]/g, '');

  return Number(currency);
}
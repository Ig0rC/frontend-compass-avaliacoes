
export function maskDate(date: string) {
  if (!date) return date;

  let valor = date?.replace(/\D/g, '');

  if (valor.length > 2) {
    valor = valor.substring(0, 2) + '/' + valor.substring(2);
  }
  if (valor.length > 5) {
    valor = valor.substring(0, 5) + '/' + valor.substring(5, 9);
  }

  return valor;
}


export function maskCurrency(currency: string | number | undefined, onlyFormat: boolean = false): string {
  if (typeof currency === 'undefined') {
    return 'R$'
  }


  if (typeof currency === 'number') {
    currency = currency.toString();
  }

  if (onlyFormat) {
    return `R$ ${Number(currency).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(,))/g, "$1.")}`;
  }

  // Remove todos os caracteres que não sejam números
  currency = currency.replace(/\D/g, "");

  // Remove zeros à esquerda, mas mantém "0" caso o campo esteja vazio
  currency = currency.replace(/^0+(?!$)/, "");

  // Adiciona zeros à esquerda para garantir pelo menos 3 dígitos (ex: "001")
  currency = currency.padStart(3, "0");

  // Insere a vírgula para separar os centavos
  currency = currency.replace(/(\d{2})$/, ",$1");

  // Insere os pontos de milhar
  currency = currency.replace(/(\d)(?=(\d{3})+(,))/g, "$1.");

  return `R$ ${currency}`;
}


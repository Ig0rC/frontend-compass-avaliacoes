export function maskCep(cep: string) {
  if (!cep) return cep;

  cep = cep.replace(/\D/g, '');

  if (cep.length > 2 && cep.length <= 5) {
    return cep = cep.replace(/(\d{2})(\d+)/, '$1.$2');
  } 
  
  if (cep.length > 5) {
    return cep = cep.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2-$3');
  }

  return cep;
}

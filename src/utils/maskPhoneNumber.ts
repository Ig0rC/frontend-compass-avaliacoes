export function maskPhoneNumber(phone: string) {
  if (!phone) return phone;

  // Remove todos os caracteres que não sejam dígitos
  phone = phone?.replace(/\D/g, '');

  // Aplica a máscara conforme o tamanho do telefone
  if (phone.length <= 2) {
    phone = phone.replace(/(\d{0,2})/, '($1');
  } else if (phone.length <= 3) {
    phone = phone.replace(/(\d{2})(\d{0,1})/, '($1)$2');
  } else if (phone.length <= 7) {
    phone = phone.replace(/(\d{2})(\d{1})(\d{0,4})/, '($1) $2$3');
  } else {
    phone = phone.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2$3-$4');
  }

  return phone;
}

export function formatDate(date: string) {
  if (!date) return {
    date: '',
    hour: '',
  };

  const formatedDate = new Date(date).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })?.split(' ');

  return {
    date: formatedDate[0].replace(',', ''),
    hour: formatedDate[1],
  }
}
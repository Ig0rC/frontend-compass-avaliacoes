export function getStatus(status: string) {
  switch (status) {
    case 'A':
      return 'Andamento';
    case 'R':
      return 'Recusado';
    case 'C':
      return 'Concluído';
    default:
      return 'Pendente';
  }
}
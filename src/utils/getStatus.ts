export function getStatus(status: string) {
  switch (status) {
    case 'P': return 'Em Andamento'; // em andamento
    case 'N': return 'Novo'; // em andamento
    case 'A': return 'Aceito'; // em andamento
    case 'M': return 'Fazer laudo'; // fazer laudo
    case 'T': return 'Remarcar'; // remarca
    case 'D': return 'Problema no Docs';
    case 'R': return 'Cancelado'; // refused
    case 'F': return 'Finalizado';
    default: return 'ERROR';
  }

}
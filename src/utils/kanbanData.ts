import { KanbanData } from "@/types/i-kanban";

// data/initialData.ts
export const initialData: KanbanData = {

  proposes: {},
  columns: {
    'progress': {
      id: 'progress', // P
      title: 'Em Andamento',
      proposeIds: []
    },
    'makeReport': {
      id: 'makeReport', // B
      title: 'Fazer Laudo',
      proposeIds: []
    },
    'rebrand': { // R
      id: 'rebrand',
      title: 'Remarca',
      proposeIds: []
    },
    'cancelled': { // C
      id: 'cancelled',
      title: 'Cancelado',
      proposeIds: []
    },
    'problemDocs': {
      id: 'problemDocs', // E
      title: 'Problemas Docs',
      proposeIds: []
    },
    'completed': {
      id: 'completed', // F
      title: 'Entregue',
      proposeIds: []
    }
  },
  columnOrder: ['progress', 'makeReport', 'rebrand', 'cancelled', 'problemDocs', 'completed']

};

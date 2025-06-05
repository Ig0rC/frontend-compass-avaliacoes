// App.tsx
import { ProposeList } from '@/entities/ipropose';
import { ProposeService } from '@/services/propose-service';
import { KanbanData } from '@/types/i-kanban';
import { initialData } from '@/utils/kanbanData';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Column from './Column';

interface Props {
  proposes: ProposeList[];
}

function Board({ proposes }: Props) {
  const [data, setData] = useState<KanbanData>(initialData);

  // Função para mapear o status para o ID da coluna
  const getColumnId = (status: string): string => {
    switch (status) {
      case 'N': return 'accept' // novo
      case 'P': return 'progress'; // em andamento
      case 'A': return 'accept'; // fazer laudo
      case 'R': return 'refused'; // refused
      case 'X': return 'cancelled'
      case 'F': return 'completed';
      default: return 'progress';
    }
  };

  // Função para organizar as propostas nas colunas
  const organizeProposes = useCallback(async () => {
    if (proposes.length === 0) return;
    // Criar uma nova estrutura de dados baseada no initialData
    const newData: KanbanData = {
      proposes: {},
      columns: {
        'progress': {
          id: 'progress',
          title: 'Em Andamento',
          proposeIds: []
        },
        'accept': {
          id: 'accept',
          title: 'Fazer Laudo',
          proposeIds: []
        },
        // 'rebrand': { 
        //   id: 'rebrand',
        //   title: 'Remarca',
        //   proposeIds: []
        // },
        'cancelled': {
          id: 'cancelled',
          title: 'Cancelado',
          proposeIds: []
        },
        'refused': {
          id: 'refused',
          title: 'Recusado',
          proposeIds: []
        },
        // 'problemDocs': {
        //   id: 'problemDocs', 
        //   title: 'Problemas Docs',
        //   proposeIds: []
        // },
        'completed': {
          id: 'completed',
          title: 'Entregue',
          proposeIds: []
        }
      },
      columnOrder: ['progress', 'accept', 'cancelled', 'refused', 'completed']
    };

    // Organizar as propostas nas colunas apropriadas
    proposes.forEach(propose => {
      newData.proposes[propose.idProposes] = propose;


      // Adicionar o ID da proposta à coluna apropriada
      const columnId = getColumnId(propose.proposeStatus);

      newData.columns[columnId].proposeIds.push(propose.idProposes);
    });

    setData(newData);
  }, [proposes]);

  useEffect(() => {
    organizeProposes()
  }, [organizeProposes])

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // Atualizar localmente
    if (start === finish) {
      const newProposeIds = Array.from(start.proposeIds);
      newProposeIds.splice(source.index, 1);
      newProposeIds.splice(destination.index, 0, Number(draggableId));

      const newColumn = {
        ...start,
        proposeIds: newProposeIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    // Mover entre colunas
    const startProposeIds = Array.from(start.proposeIds);
    startProposeIds.splice(source.index, 1);
    const newStart = {
      ...start,
      proposeIds: startProposeIds,
    };

    const finishProposeIds = Array.from(finish.proposeIds);
    finishProposeIds.splice(destination.index, 0, Number(draggableId));
    const newFinish = {
      ...finish,
      proposeIds: finishProposeIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);

    // Atualizar no backend
    try {
      const proposeId = Number(draggableId);
      const newStatus = getStatusFromColumnId(destination.droppableId);
      await ProposeService.updateStatus(proposeId, newStatus);
      toast.success('Status atualizado com sucesso!');
      console.log(proposeId, newStatus)
    } catch {
      toast.error('Não foi possível atualizar o status!');
    }
  };

  // Função auxiliar para converter ID da coluna em status
  const getStatusFromColumnId = (columnId: string): string => {
    switch (columnId) {
      case 'new': return 'N';
      case 'progress': return 'P';
      case 'accept': return 'A'; // remarca try again 
      case 'refused': return 'R'; // 
      case 'cancelled': return 'X'; // refused
      case 'completed': return 'F';
      default: return 'progress';
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-5 py-5 overflow-x-auto min-h-screen bg-gray-50">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const proposes = column?.proposeIds?.map(proposeId => data.proposes[proposeId]);

          return <Column key={column?.id} column={column} proposes={proposes} />;
        })}
      </div>
    </DragDropContext>
  );
}

export default Board;

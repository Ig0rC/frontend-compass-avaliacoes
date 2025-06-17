// components/Column.tsx
import { ProposesList } from '@/entities/ipropose';
import { Column as ColumnType } from '@/types/i-kanban';
import { Droppable } from '@hello-pangea/dnd';
import ProposeCard from './ProposeCard';

interface ColumnProps {
  column: ColumnType;
  proposes: ProposesList[];
}

function Column({ column, proposes }: ColumnProps) {
  return (
    <div className="min-w-[200px] w-full border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="p-3 m-0 bg-gray-100 font-semibold rounded-t-lg flex items-center justify-between">
        {column.title}
        <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
          {proposes.length}
        </span>
      </h3>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-2 min-h-[calc(100vh-200px)] ${snapshot.isDraggingOver ? 'bg-gray-100' : 'bg-gray-50'
              }`}
          >
            {proposes.map((propose, index) => (
              <ProposeCard key={propose.idProposes} propose={propose} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;

// components/ProposeCard.tsx
import { IPropose } from '@/entities/ipropose';
import { Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';


const PROPOSE_COLORS = {
  'PURPLE': 'bg-purple-100',
  'RED': 'bg-red-100',
  'BLUE': 'bg-blue-100',
  'GREEN': 'bg-green-100',
  'YELLOW': 'bg-yellow-100',
  'ORANGE': 'bg-orange-100',
  'PINK': 'bg-pink-100',
} as const;


interface ProposeCardProps {
  propose: IPropose;
  index: number;
}

function ProposeCard({ propose, index }: ProposeCardProps) {
  const getBackgroundColor = (color: string | undefined) => {
    if (!color) return 'bg-white';
    return PROPOSE_COLORS[color as keyof typeof PROPOSE_COLORS] || 'bg-white';
  };


  return (
    <Draggable draggableId={propose.idProposes.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`border border-gray-200 rounded p-4 mb-2 ${snapshot.isDragging
            ? 'bg-gray-100'
            : getBackgroundColor(propose?.proposeAdditionalInfo?.proposeAddColor)
            } shadow-sm`}
        >
          <Link to={`/edit-process/${propose.idProposes}`} target="_blank">
            <div className="text-sm text-gray-600">
              <p className=''>{propose?.proposeAdditionalInfo?.proposesAddProposeNumber || 'Sem Número'}</p>
              <p><strong>Tipo de imóvel:</strong> {propose?.proposeResType}</p>
              <p><strong>Endereço:</strong> {propose?.proposeAddress}</p>
              <p><strong>Cidade-UF:</strong> {propose?.proposeAdditionalInfo?.proposeAddCity}</p>
              <p><strong>Solicitação:</strong> {propose?.proposeAdditionalInfo?.proposesAddSolicitationDate}</p>
              <p><strong>Entrega:</strong> {propose?.inspections?.inspectionDate}</p>
              <p><strong>Valor Prestador:</strong> {propose?.proposeAdditionalInfo?.proposeAddAvaliationValue}</p>
              <p><strong>KM:</strong> {propose?.proposeAdditionalInfo?.proposeAddKmValue}</p>
              <p><strong>Deslocamento:</strong> {propose?.proposeAdditionalInfo?.proposeAddDisplacementType}</p>
              <p><strong>Descrição:</strong> {propose?.proposeDescription}</p>
            </div>
          </Link>
        </div>
      )}
    </Draggable>
  );
}

export default ProposeCard;

import { ProcessForm } from '@/components/ProcessForm';
import { ContainerFormLayout } from '@/layouts/ContainerFormLayout';
import { processSchema } from '@/schemas/process-schema';
import { ProposeService } from '@/services/propose-service';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

type ProcessFormData = z.infer<typeof processSchema>;


export function NewProcess() {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(data: ProcessFormData) {
    console.log(data);


    const idPropose = await ProposeService.create(data);

    navigate(`/edit-process/${idPropose}`, {
      replace: true,
      state: { from: location.state?.from || '/' }
    });

    toast.success('Processo criado com sucesso!');
  }

  return (
    <ContainerFormLayout pathTo="/">
      <ProcessForm
        onSubmit={handleSubmit}
      />
    </ContainerFormLayout>
  );
}
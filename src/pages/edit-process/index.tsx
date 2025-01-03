import photoUser from '@/assets/images/photo-user.jpeg';
import { ProcessForm } from '@/components/ProcessForm';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ContainerFormLayout } from '@/layouts/ContainerFormLayout';
import { processSchema } from '@/schemas/process-schema';
import { ProposeMapper } from '@/services/mappers/propose-mapper';
import { ProposeService } from '@/services/propose-service';
import { UserNotificationService } from '@/services/user-notification-service';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import send from '../../assets/images/send.svg';

type ProcessFormData = z.infer<typeof processSchema>;


export function EditProcess() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const [initialValues, setInitialValues] = useState<Partial<ProcessFormData>>({});

  useEffect(() => {
    async function loadProcess() {
      if (id) {
        const process = await ProposeService.getById(id);
        setStatus(process.proposeStatus);
        console.log(process.user)
        setInitialValues(ProposeMapper.toDomain(process));
      }
    }
    loadProcess();
  }, [id]);


  async function handleStatusChange(value: string) {
    try {
      if (id) {
        await ProposeService.updateStatus(id, value);
        setStatus(value);
        toast.success('Status atualizado com sucesso');
      }
    } catch {
      toast.error('Erro ao atualizar o status');
    }
  }

  async function handleUpdateProcess(data: ProcessFormData) {
    try {
      if (id) {
        console.log(data);
        await ProposeService.update(id, data);
        toast.success('Processo atualizado com sucesso');
        return;
      }

      toast.error('Erro ao atualizar o processo');
    } catch {
      toast.error('Erro ao atualizar o processo');
    }
  }

  function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  async function handleSendMessageSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (initialValues.userSupplier) {
        await UserNotificationService.create(initialValues.userSupplier.userId, message);

        const notifications = initialValues.userSupplier?.notifications || [];

        setInitialValues({
          ...initialValues,
          userSupplier: {
            ...initialValues.userSupplier,
            notifications: [
              ...notifications,
              {
                idNotification: Date.now(),
                notificationDescription: message,
                notificationDate: new Date().toISOString(),
                notificationStatus: 'A',
                userId: Number(initialValues.userSupplier.userId),
              }
            ]
          }
        });

        setMessage('');

        toast.success('Mensagem enviada com sucesso');
      }
    } catch (error) {
      console.log(error)
      toast.error('Erro ao enviar a mensagem');

    }
  }

  function handleEnterMessageSubmit(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageSubmit(e);
    }
  };

  return (
    <ContainerFormLayout>
      <ProcessForm
        initialValues={initialValues}
        onSubmit={handleUpdateProcess}
      />

      <Separator className="mt-8 mb-9" />

      <h1 className="text-primary text-[26px] font-bold mb-[38px] ">Status</h1>
      <Label>Selecionar Status</Label>
      <Select onValueChange={handleStatusChange} value={status}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="A">Aceito</SelectItem>
          <SelectItem value="P">Andamento</SelectItem>
          <SelectItem value="R">Recusado</SelectItem>
          <SelectItem value="F">Concluído</SelectItem>
        </SelectContent>
      </Select>

      <Separator className="mt-8 mb-9" />


      <h1 className="text-primary text-[26px] font-bold mb-[38px] ">Enviar mensagem</h1>

      <div className="flex flex-col gap-[38px] pb-60">
        {initialValues?.userSupplier?.notifications?.map((notification) => (
          <div key={notification.idNotification} className="w-full flex gap-11">
            <div className="py-3 px-6 bg-white border-r-[6px] border-r-primary w-full border border-[#DDDDDD] rounded-[10px]">
              <p className="break-words">{notification.notificationDescription}</p>
            </div>
            <div className="self-end">
              <img className="max-w-[40px] max-h-[40px] rounded" src={initialValues.userSupplier?.additionalInfo?.userAdditionalUrlPicture || photoUser} alt="" />
            </div>
          </div>
        ))}


        <form onSubmit={handleSendMessageSubmit}>
          <div className="flex rounded-[12px] border-[2px]  border-primary-lighter">
            <textarea
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleEnterMessageSubmit}
              className="w-full h-20 resize-none border border-gray-300 rounded-md py-6 px-2 
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua mensagem"
            ></textarea>



            <div className="flex justify-center border-r-[6px] rounded-[12px] border-primary">
              <button type="submit">
                <img src={send} />
              </button>
            </div>
          </div>
        </form>
      </div>

    </ContainerFormLayout>
  );
}

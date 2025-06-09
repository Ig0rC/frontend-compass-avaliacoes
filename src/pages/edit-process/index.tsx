import photoUser from '@/assets/images/photo-user.jpeg';
import { Loader } from '@/components/loader';
import { ProcessForm } from '@/components/ProcessForm';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { IPropose } from '@/entities/ipropose';
import { ContainerFormLayout } from '@/layouts/ContainerFormLayout';
import { processSchema } from '@/schemas/create-process-schema';
import { ProposeService } from '@/services/propose-service';
import { UserNotificationService } from '@/services/user-notification-service';
import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import send from '../../assets/images/send.svg';
import { Button } from '../../components/ui/button';

type ProcessFormData = z.infer<typeof processSchema>;


export function EditProcess() {
  const { id } = useParams();
  const location = useLocation();

  const searchParams = location.state?.searchParams || 'page=1';

  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [process, setProcess] = useState<IPropose | undefined>(undefined);
  const [user] = useState(JSON.parse(localStorage.getItem('user') as string));

  useEffect(() => {
    async function loadProcess() {
      if (id) {
        try {
          const data = await ProposeService.getById(id);
          setStatus(data.proposeStatus);

          setProcess(data);
        } catch {
          toast.error('Erro ao carregar processo');
        } finally {
          setIsLoading(false);
        }
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
        await ProposeService.update(id, data);
        toast.success('Processo atualizado com sucesso');
        return;
      }

      toast.error('Erro ao atualizar o processo');
    } catch (error) {
      console.log(error);
      toast.error('Erro ao atualizar o processo');
    }
  }

  function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  async function handleSendMessageSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (process?.user) {
        await UserNotificationService.create(process.user.idUser, message);

        setProcess(prevState => {
          if (prevState) {
            return ({
              ...prevState,
              user: {
                ...prevState?.user,
                notifications: [
                  ...prevState.user.notifications,
                  {
                    idNotification: Date.now(),
                    notificationDescription: message,
                    notificationDate: new Date().toISOString(),
                    notificationStatus: 'A',
                    userId: Number(prevState.user.idUser),
                  }
                ]
              }
            })
          }

          return undefined;
        })

        setMessage('');

        toast.success('Mensagem enviada com sucesso');
      }
    } catch {
      toast.error('Erro ao enviar a mensagem');
    }
  }

  function handleEnterMessageSubmit(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageSubmit(e);
    }
  };

  async function handleExportPropose() {
    try {
      setIsLoading(true);
      if (status !== 'F') {
        toast.error('Só é possível gerar o relatório, após de finalizar a vistória!')
        return;
      }

      if (id) {
        const data = await ProposeService.getExportPropose(id);

        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `processo-${id}.xlsm`)
        document.body.appendChild(link)
        link.click()

        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)
      }

    } catch {
      toast.error('Erro ao exportar o arquivo');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ContainerFormLayout pathTo={`/?${searchParams}`}>
      {isLoading && <Loader />}
      <ProcessForm
        key={process?.idProposes}
        process={process}
        onSubmit={handleUpdateProcess}
      />

      <Button variant="transparent-default" onClick={handleExportPropose}>Exportar</Button>
      <Separator className="mt-8 mb-9" />

      <h1 className="text-primary text-[26px] font-bold mb-[38px] ">Status</h1>
      <Label>Selecionar Status</Label>
      <Select onValueChange={handleStatusChange} value={status} disabled={user.role === 'F'}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="N">Novo</SelectItem>
          <SelectItem value="A">Aceito</SelectItem>
          <SelectItem value="P">Em Andamento</SelectItem>
          <SelectItem value="R">Recusado</SelectItem>
          <SelectItem value="F">Finalizado</SelectItem>
          <SelectItem value="X">Cancelado</SelectItem>
        </SelectContent>
      </Select>

      <Separator className="mt-8 mb-9" />


      <h1 className="text-primary text-[26px] font-bold mb-[38px] ">Enviar mensagem</h1>

      <div className="flex flex-col gap-[38px] pb-60">
        {process?.user?.notifications?.map((notification) => (
          <div key={notification.idNotification} className="w-full flex gap-11">
            <div className="py-3 px-6 bg-white border-r-[6px] border-r-primary w-full border border-[#DDDDDD] rounded-[10px]">
              <p className="break-words">{notification.notificationDescription}</p>
            </div>
            <div className="self-end">
              <img className="max-w-[40px] max-h-[40px] rounded" src={process?.user?.additionalInfo?.userAdditionalUrlPicture || photoUser} alt="" />
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

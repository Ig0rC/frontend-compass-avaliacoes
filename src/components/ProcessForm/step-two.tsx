import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/api";
import { processSchema } from "@/schemas/process-schema";
import { AttachmentService } from "@/services/attachment-service";
import { maskDate } from "@/utils/maskDate";
import { maskHour } from "@/utils/maskHour";
import { maskPhoneNumber } from "@/utils/maskPhoneNumber";
import { File, FileUp, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { InputFile } from "../InputFile";
import { Loader } from "../loader";
import { TitleForm } from "../TitleForm";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";



export function StepTwo() {
  const {
    control,
    getValues,
    setValue
  } = useFormContext<z.infer<typeof processSchema>>();
  const [isLoading, setIsLoading] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const filesSaved = getValues("files");
  const attachments = getValues("attachments");


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const currentFiles = getValues("files") || [];

    // Combina os arquivos existentes com os novos
    const updatedFiles = [...currentFiles, ...newFiles];

    // Atualiza os nomes dos arquivos
    const updatedFileNames = updatedFiles.map(file => file.name);

    // Atualiza o estado das pré-visualizações
    setFileNames(updatedFileNames);

    // Atualiza os arquivos no React Hook Form
    setValue("files", updatedFiles, { shouldValidate: true });

    // Limpa o input de arquivos
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    const currentFiles = getValues("files") || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index); // Remove o arquivo do estado
    const updatedFileNames = updatedFiles.map((file) => file.name);

    setFileNames(updatedFileNames); // Atualiza os nomes exibidos no estado
    setValue("files", updatedFiles, {
      shouldValidate: true,
    }); // Atualiza os arquivos no formulário
  };

  async function handleRemoveAttachment(id: number) {
    try {
      if (!attachments) return;

      await AttachmentService.delete(id);

      setValue("attachments", attachments.filter((attachment) => attachment.id_attachments !== id), {
        shouldValidate: true,
      }); // Atualiza os arquivos no formulário

      toast.success('Anexo removido com sucesso')
    } catch {
      toast.error('Erro ao remover anexo')
    }
  };

  async function handleCreateAttachment(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setIsLoading(true);
      const file = e?.target?.files?.[0];

      if (!file) return;

      const formData = new FormData();
      formData.append('files', file);
      const id = getValues("idProposes");

      formData.append('propose', `${id}`);

      const response = await api.post('/new-attachment', formData, {
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      });

      if (!attachments) {
        setValue("attachments", [
          {
            id_attachments: response.data.id_attachments,
            attachments_link: response.data.attachments_link,
            attachments_status: response.data.attachments_status,
            proposes_id_proposes: response.data.proposes_id_proposes,
          }
        ], {
          shouldValidate: true,
        });

        toast.success('Anexo criado com sucesso')
        return;
      }

      setValue("attachments", [
        ...attachments,
        {
          id_attachments: response.data.id_attachments,
          attachments_link: response.data.attachments_link,
          attachments_status: response.data.attachments_status,
          proposes_id_proposes: response.data.proposes_id_proposes,
        }
      ], {
        shouldValidate: true,
      }); // Atualiza os arquivos no formulário

      toast.success('Anexo criado com sucesso')
    } catch (error) {
      console.log(error)
      toast.error('Erro ao criar anexo')
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (filesSaved) {

      const updatedFileNames = filesSaved.map((file) => file.name);


      setFileNames(updatedFileNames); // Atualiza os nomes exibidos no estado
    }
  }, [filesSaved]);

  return (
    <>
      {isLoading && <Loader />}
      <TitleForm title="Vistoria" />
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="lg:max-w-52 w-full">
            <FormLabel>Data</FormLabel>
            <FormControl>
              <Input
                maxLength={10}
                className="text-black/50" type="text"
                placeholder="__/__/____"
                {...field}
                value={maskDate(field.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="hour"
        render={({ field }) => (
          <FormItem className="lg:max-w-52 w-full">
            <FormLabel>Horário</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="__:__"
                maxLength={5}
                {...field}
                value={maskHour(field.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem className="lg:max-w-[457px] w-full">
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input
                className="text-black/50"
                placeholder="(__) _____-____"
                {...field}
                maxLength={15}
                value={maskPhoneNumber(field.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea className="h-40" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {attachments ? (
        <div className="w-full mt-2">
          <Label className="w-full">
            Anexos
          </Label>
          <InputFile
            type="file"
            multiple
            onChange={handleCreateAttachment}
          />
        </div>
      ) : (
        <FormField
          control={control}
          name="files"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Anexos</FormLabel>
              <FormControl>
                <InputFile
                  type="file"
                  multiple
                  ref={field.ref}
                  onChange={(e) => handleFileChange(e)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}


      <div className="w-full">
        {fileNames.length > 0 && (
          <ul className="w-full space-y-2">
            {fileNames.map((fileName, index) => (
              <li key={index} className="flex items-center justify-between p-2 border w-full gap-2 rounded hover:bg-white">
                <div className="flex items-center gap-2">
                  <FileUp size={22} />
                  {fileName}
                </div>
                <button type="button" onClick={() => handleRemoveFile(index)}>
                  <Trash className="text-red-500" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full">
        {attachments && attachments.length > 0 && (
          <ul className="w-full space-y-2">
            {attachments.map((attachment) => (
              <li key={attachment.id_attachments} className="flex items-center justify-between p-2 border w-full gap-2 rounded hover:bg-white">
                <a href={attachment.attachments_link} target="_blank" className="flex items-center gap-2 w-full">
                  <File size={22} />
                  {attachment.attachments_link.split('|@')[1]}
                </a>
                <button type="button" onClick={() => handleRemoveAttachment(attachment.id_attachments)}>
                  <Trash className="text-red-500" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
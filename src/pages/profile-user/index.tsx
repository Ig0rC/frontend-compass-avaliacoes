import exit from '@/assets/images/Exit.svg';
import photoUser from '@/assets/images/photo-user.jpeg';
import { Loader } from '@/components/loader';
import { TitleForm } from "@/components/TitleForm";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AuthContext } from '@/context/AuthContext';
import { IUser } from '@/entities/i-user-supplier';
import { ContainerFormLayout } from "@/layouts/ContainerFormLayout";
import { UserService } from '@/services/user-service';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { X } from 'lucide-react';
import { useContext, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useForm } from "react-hook-form";
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from "zod";
import pencil from '../../assets/images/pencil.svg';

const formSchema = z.object({
  email: z.string().email({
    message: 'Informe um e-mail válido.'
  }),
  name: z.string().min(1, { message: 'Informe sua senha.' }),
})


export function ProfileUser() {
  const { signOut } = useContext(AuthContext);
  const location = useLocation();
  const searchParams = location.state?.searchParams || 'page=1';
  const [userlocal] = useState(JSON.parse(localStorage.getItem('user') as string));
  const [user, setUser] = useState<IUser | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  // const [croppedAreaPixels, setCroppedAreaPixels] = useState<any | null>(null)
  const [zoom, setZoom] = useState(1)
  // const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 }) // necessário para permitir movimento


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      try {
        const data = await UserService.findProfileData();
        setUser(data);
        return {
          email: data.userEmail,
          name: data.username,
        }
      } catch {
        toast.error('Não foi possível carregar os dados do perfil.')
        return {
          email: '',
          name: '',
        }
      }
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await UserService.updateMyProfile(values.name, values.email);
      toast.success('Atualizado com sucesso!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);

        return;
      }
      toast.error('Erro ao atualizar dados do usuário');
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImageSrc(reader.result as string)
      reader.readAsDataURL(file);
      e.target.value = "" // limpa input
    }
  }

  function handleImageDelete() {
    console.log('here')
    setImageSrc(null);
  }

  // const handleCrop = async () => {
  //   if (!imageSrc || !croppedAreaPixels) return
  //   const cropped = await getCroppedImg(imageSrc, croppedAreaPixels)
  //   setCroppedImage(cropped)
  //   // Agora envie para o backend como um Blob ou File
  // }

  // const onCropComplete = useCallback((_croppedArea: any, croppedPixels: any) => {
  //   setCroppedAreaPixels(croppedPixels)
  // }, [])


  return (
    <ContainerFormLayout pathTo={`/?${searchParams}`}>
      {form.formState.isLoading && <Loader />}
      <TitleForm title="Meu Perfil" />
      <div className="flex justify-center ">

        <Popover open={!!imageSrc}>
          <PopoverTrigger>
            <div className="h-36 w-36 bg-primary rounded-full relative cursor-pointer group">
              <img
                src={user?.additionalInfo.userAdditionalUrlPicture || photoUser}
                alt="Avatar"
                className="rounded-full h-36 w-36 object-cover border-[6px] border-primary"
              />

              {!imageSrc ? (
                // Botão de upload
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 h-10 w-10 bg-primary border-2 border-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <img src={pencil} alt="Editar" className="h-5 w-5" />
                </label>
              ) : (
                <button
                  type="button"
                  onClick={handleImageDelete}
                  className="absolute bottom-0 bg-primary right-0 h-10 w-10 border-2 border-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
                >
                  <X color="white" className="h-5 w-5" />
                </button>
              )}

            </div>
          </PopoverTrigger>

          <PopoverContent className="w-[500px] h-[500px]  p-2">
            {imageSrc ? (
              <div className="relative h-full w-full bg-gray-800 rounded-md overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                // onCropComplete={onCropComplete}
                />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4"
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center">Selecione uma imagem para editar</p>
            )}
          </PopoverContent>
        </Popover>
      </div>




      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-[52px] flex flex-col gap-9 lg:flex-row lg:flex-wrap">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="lg:flex-1">
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input className="text-black/50" type="text" placeholder="Digite seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="lg:flex-1">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input className="text-black/50" placeholder="Digite seu e-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <div className="flex flex-col w-full mt-10 gap-[22px]">
            <Button className="w-full" type="submit">Salvar</Button>

            {userlocal?.role === 'A' && (
              <Button variant="transparent-default" type="button">
                <Link to="/user-manegement" className="w-full" >
                  Controle de Usuários
                </Link>
              </Button>
            )}

            <Button onClick={signOut} variant="transparent-danger" type="submit">
              <img src={exit} alt="" />
              Sair da conta
            </Button>
          </div>
        </form>
      </Form>
    </ContainerFormLayout>
  )
}



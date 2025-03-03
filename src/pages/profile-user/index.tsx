import exit from '@/assets/images/Exit.svg';
import pencil from '@/assets/images/pencil.svg';
import photoUser from '@/assets/images/photo-user.jpeg';
import { TitleForm } from "@/components/TitleForm";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthContext } from '@/context/AuthContext';
import { IUser } from '@/entities/i-user-supplier';
import { ContainerFormLayout } from "@/layouts/ContainerFormLayout";
import { UserService } from '@/services/user-service';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: 'Informe um e-mail válido.'
  }),
  name: z.string().min(1, { message: 'Informe sua senha.' }),
})


export function ProfileUser() {
  const { signOut } = useContext(AuthContext);
  const [user, setUser] = useState<IUser | null>(null);
  const [userlocal] = useState(JSON.parse(localStorage.getItem('user') as string));

  useEffect(() => {
    UserService.findProfileData().then(data => {
      form.setValue('email', data.userEmail);
      form.setValue('name', data.username);
      setUser(data);
    }).catch(() => {
      toast.error('Erro ao carregar dados do usuário')
    })
  }, []);



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
    },
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


  return (
    <ContainerFormLayout pathTo="/">
      <TitleForm title="Meu Perfil" />

      <div className="flex justify-center mt-2">
        <div className="h-36 w-36 bg-primary rounded-full relative">
          <img
            src={user?.additionalInfo.userAdditionalUrlPicture || photoUser}
            alt=""
            className="rounded-full h-32 w-32 absolute top-0 bottom-0 left-0 right-0 m-auto object-cover "
          />

          <div
            className="h-[38px] border-[2px] border-white w-[38px] bg-primary rounded-full absolute bottom-0 right-0 flex justify-center items-center cursor-pointer"
          >
            <img className="max-h-[20px] max-w-[20px]" src={pencil} alt="" />
          </div>
        </div>
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
              <Button variant="transparent-default">
                <Link to="/user-manegement" >
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



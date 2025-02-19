import logo from '@/assets/images/logo.png';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { ResetPasswordService } from '@/services/reset-password-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';


const formSchema = z.object({
  email: z.string().min(1, { message: 'Informe seu token.' }),
})


export function ForgotPassword() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    }
  });

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    try {
      await ResetPasswordService.forgotPassword(data.email);


      navigate(`/sign-in`);
      toast.success('Caso email seja válido, um link de redefinição de senha será enviado.');
    } catch (error) {
      console.log(error);
      toast.error('Erro ao resetar senha');
    }
  }

  return (
    <section className="max-w-[604px] w-full h-full mt-12 px-3 m-auto flex justify-center flex-col">
      {form.formState.isSubmitting && <Loader />}

      <img className="max-h-32 h-full max-w-72 w-full self-center content-center mb-16" src={logo} alt="Compass Avaliações" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">Enviar link para Redefinição</Button>
        </form>
      </Form>
    </section>
  )
}
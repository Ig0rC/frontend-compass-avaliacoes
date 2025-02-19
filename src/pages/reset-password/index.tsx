import logo from '@/assets/images/logo.png';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { ResetPasswordService } from '@/services/reset-password-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(1, { message: 'Informe sua senha.' }),
  retryNewPassword: z.string().min(1, { message: 'Informe a senha novamente.' }),
})


export function ResetPassword() {
  const params = useParams();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      retryNewPassword: '',
    }
  });



  async function handleSubmit(data: z.infer<typeof resetPasswordSchema>) {
    try {
      if (!params.token) return;

      await ResetPasswordService.resetPassword(params.token, data.newPassword, data.retryNewPassword);


      toast.success('Senha redefinida com sucesso!');

      navigate('/sign-in');
    } catch {
      toast.error('Erro ao redefinir senha');
    }
  }

  return (
    <section className="max-w-[604px] w-full h-full mt-12 px-3 m-auto flex justify-center flex-col">
      {form.formState.isSubmitting && <Loader />}

      <img className="max-h-32 h-full max-w-72 w-full self-center content-center mb-4" src={logo} alt="Compass Avaliações" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha</FormLabel>
                <FormControl>
                  <Input placeholder="Nova Senha" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="retryNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repita a nova senha</FormLabel>
                <FormControl>
                  <Input placeholder="Repita nova senha" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button className="w-full" type="submit">Confirmar </Button>
        </form>
      </Form>

    </section>
  )
}
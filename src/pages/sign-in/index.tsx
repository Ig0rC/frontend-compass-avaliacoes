import logo from '@/assets/images/logo.png';
import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthContext } from '@/context/AuthContext';
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: 'Informe um e-mail válido.'
  }),
  password: z.string().min(1, { message: 'Informe sua senha.' }),
  keepLoggedIn: z.boolean().default(false),
});


function SignIn() {
  const { signIn } = useContext(AuthContext);

  const { signInWithGogle } = useContext(AuthContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      keepLoggedIn: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await signIn(values.email, values.password, values.keepLoggedIn);
    } catch {
      toast.error('E-mail ou senha inválidos.');
    }
  }

  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col max-w-xl w-full p-2">
        <img className="max-h-32 h-full max-w-72 w-full self-center" src={logo} alt="Compass Avaliações" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-26px">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite sua senha " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="block w-full bold">
              <a className="underline text-primary-light font-semibold text-base" href="https://google.com">Esqueci minha senha</a>
              <span className="text-red-500 font-bold mx-2"> ⬅️ (Não implementado)</span>
            </div>

            <FormField
              control={form.control}
              name="keepLoggedIn"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="full flex gap-2 items-center text-base font-semibold">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span>Manter conectado</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">Entrar</Button>
            <Button variant="transparent-default" type="button" onClick={signInWithGogle}>Entrar com Google</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}


export default SignIn;
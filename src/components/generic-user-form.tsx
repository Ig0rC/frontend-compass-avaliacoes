import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ContainerFormLayout } from "@/layouts/ContainerFormLayout";
import { UseFormReturn } from "react-hook-form";
import { Loader } from "./loader";
import { TitleForm } from "./TitleForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

interface Props {
  form: UseFormReturn<{
    username: string;
    useremail: string;
    typeUser: string;
    password?: string;
    retryPassword?: string;
    userStatus: boolean;
  }>;
  /* eslint-disable-next-line */
  onSubmit: (data: any) => void;
  fieldsToShow?: Array<"password" | "retryPassword">;
}

export function GenericUserForm({ form, onSubmit, fieldsToShow = [] }: Props) {
  return (
    <ContainerFormLayout pathTo="/user-manegement">
      {form.formState.isLoading || form.formState.isSubmitting && <Loader />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-[62px]">
          <TitleForm title="Usuário" />

          {/* Nome */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Digite um Nome Completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="useremail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o E-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Perfil */}
          <FormField
            control={form.control}
            name="typeUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="S">Serviço</SelectItem>
                    <SelectItem value="F">Financeiro</SelectItem>
                    <SelectItem value="A">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Senha (Opcional) */}
          {fieldsToShow.includes("password") && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Senha" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Repetir Senha (Opcional) */}
          {fieldsToShow.includes("retryPassword") && (
            <FormField
              control={form.control}
              name="retryPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preencha a senha novamente</FormLabel>
                  <FormControl>
                    <Input placeholder="Preencha a senha novamente" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Status */}
          <FormField
            control={form.control}
            name="userStatus"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-4">
                <FormLabel className="mt-[8px]">Ativo</FormLabel>
                <FormControl>
                  <Switch className="mt-0" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">Salvar</Button>
        </form>
      </Form>
    </ContainerFormLayout>
  );
}

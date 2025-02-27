import { GenericUserForm } from "@/components/generic-user-form";
import { UserService } from "@/services/user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Nome completo é obrigatório!"),
  useremail: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória!"),
  retryPassword: z.string().min(1, "Senha obrigatória!"),
  typeUser: z.string().min(1, "Perfil obrigatório!"),
  userStatus: z.boolean().default(true),
});

export function NewUser() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      useremail: "",
      password: "",
      retryPassword: "",
      typeUser: "",
      userStatus: true,
    },
  });

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    if (data.password !== data.retryPassword) {
      toast.error("As senhas digitadas não coincidem");
      return;
    }

    await UserService.create(
      data.username,
      data.useremail,
      data.password,
      data.retryPassword,
      data.typeUser,
      data.userStatus ? "A" : "I"
    );

    toast.success("Usuário cadastrado com sucesso!");
  }

  return <GenericUserForm form={form} onSubmit={handleSubmit} fieldsToShow={["password", "retryPassword"]} />;
}

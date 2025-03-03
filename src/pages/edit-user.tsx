import { GenericUserForm } from "@/components/generic-user-form";
import { UserService } from "@/services/user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Nome completo é obrigatório!"),
  useremail: z.string().email("E-mail inválido"),
  typeUser: z.string().min(1, "Perfil obrigatório!"),
  userStatus: z.boolean().default(true),
});

export function EditUser() {
  const { id } = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      if (!id) {
        toast.error('Dados incompletos!');

        return {
          username: '',
          useremail: '',
          typeUser: '',
          userStatus: true,
        }
      }

      const user = await UserService.findById(id);

      return {
        username: user.username,
        useremail: user.userEmail,
        typeUser: user?.additionalInfo?.typeUser || "",
        userStatus: user.userStatus === 'A',
      };
    }
  });


  async function handleSubmit(data: z.infer<typeof formSchema>) {

    await UserService.update(
      Number(id),
      data.username,
      data.useremail,
      data.typeUser,
      data.userStatus ? "A" : "I",
    );

    toast.success("Usuário Atualizado com sucesso!!");
  }

  return <GenericUserForm form={form} onSubmit={handleSubmit} />;
}

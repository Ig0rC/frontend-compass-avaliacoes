import z from 'zod';


// Mensagens de erro comuns
const errorMessages = {
  required: (field: string) => `Informe ${field}.`,
  maxLength: (field: string, max: number) => `${field} deve ter no máximo ${max} caracteres.`,
};

// Schema de endereço
const addressSchema = z.object({
  cep: z.string()
    .min(1, errorMessages.required('um CEP'))
    .max(10, errorMessages.maxLength('CEP', 10)),
  city: z.string().min(1, errorMessages.required('uma cidade')),
  uf: z.string().min(1, errorMessages.required('um estado')),
  street: z.string().min(1, errorMessages.required('uma rua')),
  number: z.string().min(1, errorMessages.required('um número')),
  neighborhood: z.string().min(1, errorMessages.required('um bairro')),
  complement: z.string(),
});

// Schema de informações básicas
const basicInfoSchema = z.object({
  idProposes: z.number().optional(),
  title: z.string().min(1, errorMessages.required('um título')),
  processNumber: z.string().min(1, errorMessages.required('um número do processo')),
  resType: z.string().min(1, errorMessages.required('um tipo de imóvel')),
  description: z.string()
    .min(1, errorMessages.required('uma descrição'))
    .max(2000, errorMessages.maxLength('Descrição', 2000)),
  proposeStatus: z.string().optional()
});

// Schema de agendamento
const scheduleSchema = z.object({
  date: z.string().min(1, errorMessages.required('uma data')),
  hour: z.string().min(1, errorMessages.required('um horário')),
  phoneNumber: z.string()
    .min(1, errorMessages.required('um número de telefone'))
    .max(15, errorMessages.maxLength('Telefone', 15)),
  files: z.array(z.instanceof(File)).optional(),

});

// Schema de cliente
const clientSchema = z.object({
  clientName: z.string().min(1, errorMessages.required('um nome')),
  phoneNumberClient: z.string()
    .min(1, errorMessages.required('um número de telefone'))
    .max(15, errorMessages.maxLength('Telefone', 15)),
  priority: z.string().min(1, errorMessages.required('uma prioridade')),
  color: z.string().min(1, errorMessages.required('uma cor')),
  accompanyingName: z.string().min(1, errorMessages.required('um nome de acompanhante')),
});

// Schema de valores
const valuesSchema = z.object({
  kmValue: z.string().min(1, errorMessages.required('um valor de Km')),
  displacementValue: z.string().min(1, errorMessages.required('um valor de deslocamento')),
  avaliationValue: z.string().min(1, errorMessages.required('um valor de avaliação')),
  propertyValue: z.string().min(1, errorMessages.required('um valor de propriedade')),
  preReportValue: z.string().min(1, errorMessages.required('um valor estimado')),
  galleryValue: z.string().min(1, errorMessages.required('um valor de galeria')),
  customerValue: z.string().min(1, errorMessages.required('um valor de pré-laudo')),
});

// Schema do fornecedor
const userSupplierSchema = z.object({
  userId: z.string().min(1, errorMessages.required('um id')),
  username: z.string(),
  userEmail: z.string(),
  userDoc: z.string(),
  userPhoneNumber: z.string(),
  userCreaOrCau: z.string(),
  additionalInfo: z.object({
    userAdditionalUrlPicture: z.string().optional(),
  }).optional(),
  notifications: z.array(z.object({
    idNotification: z.number(),
    notificationDescription: z.string(),
    notificationDate: z.string(),
    notificationStatus: z.string(),
    userId: z.number(),
  })).optional()
}).superRefine((data, ctx) => {
  if (data.userId === 'others') {
    const requiredFields = {
      username: 'nome',
      userEmail: 'e-mail',
      userDoc: 'documento',
      userPhoneNumber: 'número de telefone',
      userCreaOrCau: 'CREA/CAU'
    };

    Object.entries(requiredFields).forEach(([field, fieldName]) => {
      if (!data[field as keyof typeof data]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: errorMessages.required(fieldName),
          path: [field],
        });
      }
    });

    // Validação específica de email
    if (data.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'E-mail inválido',
        path: ['userEmail'],
      });
    }
  }
});

// Schema principal combinando todos os subschemas
export const processSchema = z.object({
  ...basicInfoSchema.shape,
  ...addressSchema.shape,
  ...scheduleSchema.shape,
  ...clientSchema.shape,
  ...valuesSchema.shape,
  userSupplier: userSupplierSchema,
  proposeSolicitationDate: z.string().optional(),
  displacementType: z.string().optional(),
  idProposesAdditionalInfo: z.number().optional(),
  solicitationDate: z.string().optional(),
  attachments: z.array(z.object({
    id_attachments: z.number(),
    attachments_link: z.string(),
    attachments_status: z.string(),
    proposes_id_proposes: z.number(),
  })).optional(),
});

import { StepFour } from "@/components/ProcessForm/step-four";
import { StepOne } from "@/components/ProcessForm/step-one";
import { StepThree } from "@/components/ProcessForm/step-three";
import { StepTwo } from "@/components/ProcessForm/step-two";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { processSchema } from "@/schemas/process-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ProcessFormData = z.infer<typeof processSchema>;

const INITIAL_FORM_VALUES: ProcessFormData = {
  title: '',
  processNumber: '',
  resType: '',
  cep: '',
  city: '',
  uf: '',
  street: '',
  number: '',
  neighborhood: '',
  complement: '',
  date: '',
  hour: '',
  phoneNumber: '',
  description: '',
  clientName: '',
  phoneNumberClient: '',
  priority: '',
  color: '',
  accompanyingName: '',
  userSupplier: {
    userCreaOrCau: '',
    userDoc: '',
    userEmail: '',
    userId: '',
    username: '',
    userPhoneNumber: '',
  },
  kmValue: '',
  displacementValue: '',
  avaliationValue: '',
  propertyValue: '',
  preReportValue: '',
  galleryValue: '',
  customerValue: '',
};

const STEP_VALIDATIONS = {
  1: [
    'title',
    'processNumber',
    'resType',
    'cep',
    'city',
    'uf',
    'street',
    'number',
    'neighborhood'
  ],
  2: ['date', 'hour', 'phoneNumber'],
  3: [
    'clientName',
    'phoneNumberClient',
    'accompanyingName',
    'priority',
    'color',
  ],
  4: [
    'userSupplier.userId',
    'kmValue',
    'avaliationValue',
    'displacementValue',
    'galleryValue',
    'preReportValue',
    'customerValue',
  ],
} as const;

interface ProcessFormProps {
  initialValues?: Partial<ProcessFormData>;
  onSubmit: (data: ProcessFormData) => Promise<void>;
  submitButtonText: string;
}


export function ProcessForm({ initialValues, onSubmit, submitButtonText }: ProcessFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<ProcessFormData>({
    resolver: zodResolver(processSchema),
    mode: 'all',
    values: { ...INITIAL_FORM_VALUES, ...initialValues },
  });

  console.log(methods.formState.errors)


  const { handleSubmit, trigger } = methods;

  async function handleNextStep() {
    const fieldsToValidate = STEP_VALIDATIONS[currentStep as keyof typeof STEP_VALIDATIONS];
    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function prevStep() {
    setCurrentStep(prev => prev - 1);
  }

  function renderStep() {
    const steps = {
      1: <StepOne />,
      2: <StepTwo />,
      3: <StepThree />,
      4: <StepFour />,
      default: (
        <>
          <StepOne />
          <StepTwo />
          <StepThree />
          <StepFour />
        </>
      ),
    };

    if (initialValues) {
      // setCurrentStep(5);
      return steps.default;
    }

    return steps[currentStep as keyof typeof steps] || steps.default;
  }

  async function handleFormSubmit(values: ProcessFormData) {
    try {
      await onSubmit(values);
    } catch {
      toast.error('Erro ao cadastrar serviço');
    }
  }

  return (
    <div>
      {currentStep <= 4 && !initialValues && (
        <div>
          <p className="text-lg font-semibold leading-[21.64px] mt-[34px] mb-[10px]">
            {currentStep} de 4
          </p>
          <Progress value={currentStep * 25} />
        </div>
      )}

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="mt-[52px] pb-4 flex flex-col lg:flex-row lg:flex-wrap lg:justify-between gap-9 lg:gap-4"
        >
          {renderStep()}

          <div className="flex flex-col w-full mt-10 gap-[22px]">
            {currentStep <= 4 && !initialValues && (
              <Button className="w-full" type="button" onClick={handleNextStep}>
                Avançar
              </Button>
            )}
            {(currentStep >= 5 || initialValues) && (
              <Button className="w-full" type="submit">
                {!initialValues ? 'Criar Pedido' : 'Salvar'}
              </Button>
            )}
            {currentStep > 1 && (
              <Button variant="transparent-default" type="button" onClick={prevStep}>
                Voltar
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
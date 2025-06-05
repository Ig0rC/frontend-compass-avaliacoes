import { StepFour } from "@/components/ProcessForm/step-four";
import { StepOne } from "@/components/ProcessForm/step-one";
import { StepThree } from "@/components/ProcessForm/step-three";
import { StepTwo } from "@/components/ProcessForm/step-two";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { IPropose } from "@/entities/ipropose";
import { processSchema } from "@/schemas/create-process-schema";
import { ProposeMapper } from "@/services/mappers/propose-mapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentPropsWithoutRef, createContext, useCallback, useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader } from "../loader";

interface IStepperContextValue {
  previousStep: () => void;
  nextStep: () => void;
  currentStep: number;
}


export const StepperContext = createContext({} as IStepperContextValue);

type ProcessFormData = z.infer<typeof processSchema>;

interface ProcessFormProps {
  process?: IPropose;
  onSubmit: (data: ProcessFormData) => Promise<void>;
}

export function ProcessForm({ onSubmit, process }: ProcessFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(process ? 6 : 1);

  const methods = useForm<ProcessFormData>({
    resolver: zodResolver(processSchema),
    mode: 'all',
    defaultValues: async () => {
      const data = ProposeMapper.toDomain(process ? process : {});

      return data;
    }
  });

  const { handleSubmit } = methods;

  const previousStep = useCallback(() => {
    setCurrentStep(prev => prev - 1);
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1)
  }, [])


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

    return steps[currentStep as keyof typeof steps] || steps.default;
  }

  async function handleFormSubmit(values: ProcessFormData) {
    try {
      setIsLoading(true)
      await onSubmit(values);
    } catch {
      toast.error('Erro ao cadastrar serviço');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <StepperContext.Provider value={{ nextStep, previousStep, currentStep }}>
      <div>
        {isLoading && <Loader />}
        {currentStep <= 4 && (
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
          </form>
        </FormProvider>
      </div>
    </StepperContext.Provider>
  );
}

export function StepperNextButton(props: ComponentPropsWithoutRef<typeof Button>) {
  const { nextStep, currentStep } = useContext(StepperContext);
  const isSubmmit = currentStep === 5 || currentStep === 6;
  const onClick = isSubmmit ? undefined : props.onClick ?? nextStep;

  if (isSubmmit && props.hidden) {
    return null;
  }

  return (
    <Button {...props} onClick={onClick} className="w-full" type={isSubmmit ? 'submit' : 'button'}   >
      {isSubmmit ? 'Salvar' : 'Avançar'}
    </Button>
  )
}

export function StepperPreviousButton(props: ComponentPropsWithoutRef<typeof Button>) {
  const { previousStep, currentStep } = useContext(StepperContext);
  const hidden = currentStep === 5 || currentStep === 6;

  if (hidden || (currentStep === 5) && props.hidden) {
    return null;
  }

  return (
    <Button onClick={props.onClick ?? previousStep} variant="transparent-default" type="button" {...props} >
      Voltar
    </Button>
  )
}
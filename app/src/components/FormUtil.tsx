import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { ZodTypeAny, z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useSubmitProps } from "@/hooks/useClickProps";

export interface FormUtilProps<Schema extends ZodTypeAny> {
  schema: Schema,
  className?: string,
  defaultValues: z.infer<Schema>,
  onSubmit: (data: z.infer<Schema>) => Promise<void> | void,
  render: (form: UseFormReturn<z.TypeOf<Schema>, any, undefined>) => ReactNode
  submitTitle?: string,
  successMessage?: string,
  errorMessage?: (error: any) => string
  disabled?: boolean,
}

export function FormUtil<Schema extends ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  render,
  className = "",
  submitTitle = "Submit",
  errorMessage = () => "An error occured",
  successMessage,

  disabled = false,
}: FormUtilProps<Schema>) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const submitProps = useSubmitProps()

  const { toast } = useToast()

  const onSubmitWrapper = async (data: z.infer<Schema>) => {

    try {
      await onSubmit(data)

      if (!successMessage) return

      toast({
        description: successMessage
      })
    } catch (err) {
      console.error(err)
      toast({
        variant: "destructive",
        description: errorMessage(err)
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitWrapper)} className={cn("space-y-4 max-w-[480px]", className)}>
        {render(form)}
        <Button
          {...submitProps({ isLoading: form.formState.isSubmitting, buttonText: submitTitle })}
          className="w-full"
          disabled={disabled}
        />
      </form>
    </Form>
  );
}

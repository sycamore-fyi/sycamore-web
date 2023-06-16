import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { ZodTypeAny, z } from "zod";

export interface FormUtilProps<Schema extends ZodTypeAny> {
  schema: Schema,
  className?: string,
  defaultValues: z.infer<Schema>,
  onSubmit: (data: z.infer<Schema>) => Promise<void> | void,
  render: (form: UseFormReturn<z.TypeOf<Schema>, any, undefined>) => ReactNode
  submitTitle?: string,
  disabled?: boolean,
}

export function FormUtil<Schema extends ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  render,
  className = "",
  submitTitle = "Submit",
  disabled = false,
}: FormUtilProps<Schema>) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4 max-w-[480px]", className)}>
        {render(form)}
        <Button className="w-full" type="submit" disabled={disabled}>
          {submitTitle}
        </Button>
      </form>
    </Form>
  );
}

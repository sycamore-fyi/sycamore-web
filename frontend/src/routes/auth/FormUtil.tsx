import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { ZodTypeAny, z } from "zod";

export interface FormUtilProps<Schema extends ZodTypeAny> {
  schema: Schema,
  defaultValues: z.infer<Schema>,
  onSubmit: (data: z.infer<Schema>) => Promise<void> | void,
  render: (form: UseFormReturn<z.TypeOf<Schema>, any, undefined>) => ReactNode
  submitTitle?: string
}

export function FormUtil<Schema extends ZodTypeAny>({
  schema, defaultValues, onSubmit, render, submitTitle = "Submit"
}: FormUtilProps<Schema>) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {render(form)}
        <Button className="w-full" type="submit">
          {submitTitle}
        </Button>
      </form>
    </Form>
  );
}

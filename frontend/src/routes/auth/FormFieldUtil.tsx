import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { toHeaderCase } from "js-convert-case";

export function FormFieldUtil<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  render,
  ...props
}: ControllerProps<TFieldValues, TName>) {
  return <FormField
    name={name}
    {...props}
    render={({ field, fieldState, formState }) => (
      <FormItem>
        <FormLabel>{toHeaderCase(name)}</FormLabel>
        <FormControl>
          {render({ field, fieldState, formState })}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />;
}

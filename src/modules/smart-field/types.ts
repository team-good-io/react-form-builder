import type { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form"

export type FieldOption = {
  label: string
  value: string
}

export type FieldConfig = {
  id: string
  kind?: string
  options?: FieldOption[]
}

export type FieldRendererProps = {
  field: FieldConfig
  fieldProps?: Record<string, unknown>
  register: UseFormRegister<FieldValues>
  registerProps?: RegisterOptions<FieldValues, string>
}

export type FieldRenderer = (props: FieldRendererProps) => React.ReactNode

export type FieldRegistryInput = Record<string, FieldRenderer>

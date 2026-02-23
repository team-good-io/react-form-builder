import type { RegisterOptions } from "react-hook-form"
import { useFormContext } from "react-hook-form"

import { useFieldEffects } from "../effects"
import { useFieldOptions } from "../options"
import { FieldRegistry } from "./FieldRegistry"
import type { FieldConfig } from "./types"

type SmartFieldProps = FieldConfig & {
  fieldRegistry: FieldRegistry
}

export function SmartField(props: SmartFieldProps) {
  const { id, kind, options: baseOptions, fieldRegistry } = props

  const { register } = useFormContext()
  const fieldOptions = useFieldOptions(id)
  const { fieldProps, registerProps } = useFieldEffects(id)
  const isHidden = fieldProps?.hidden === true

  if (isHidden) {
    return null
  }

  const renderer = fieldRegistry.get(kind ?? "text") ?? fieldRegistry.get("text")
  const options = fieldOptions.data || baseOptions || []

  if (!renderer) {
    return null
  }

  return renderer({
    field: { id, kind, options },
    fieldProps,
    register,
    registerProps: registerProps as RegisterOptions,
  })
}

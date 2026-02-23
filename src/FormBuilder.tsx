import { useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { type EffectsConfig, EffectsProvider } from "./modules/effects"
import { OptionsProvider } from "./modules/options/OptionsProvider"
import { OptionsConfig, OptionsLoader } from "./modules/options/types"
import { createFieldRegistry, FieldRegistry, SmartField } from "./modules/smart-field"
import type { FieldConfig, FieldRegistryInput } from "./modules/smart-field/types"

interface FormBuilderProps {
  fields: FieldConfig[]
  defaultValues?: Record<string, unknown>
  effectsConfig?: EffectsConfig
  optionsConfig?: OptionsConfig
  fieldRegistry?: FieldRegistryInput | FieldRegistry
  optionsLoader?: OptionsLoader
  onSubmit: (values: Record<string, unknown>) => void
  onError?: (errors: unknown) => void
}

export function FormBuilder(props: FormBuilderProps) {
  const { fields, fieldRegistry, defaultValues, onSubmit, onError } = props
  const effectsConfig = useMemo(() => props.effectsConfig || { rules: []}, [props.effectsConfig])
  const optionsConfig = useMemo(() => props.optionsConfig || {}, [props.optionsConfig])
  const optionsLoader = useMemo(() => props.optionsLoader || (async () => []), [props.optionsLoader])

  const instance = useForm({ defaultValues })
  const mergedFieldRegistry = useMemo(() => createFieldRegistry(fieldRegistry), [fieldRegistry])

  return (
    <FormProvider {...instance}>
      <OptionsProvider config={optionsConfig} loader={optionsLoader}>
        <EffectsProvider config={effectsConfig}>
          <form onSubmit={instance.handleSubmit(onSubmit, onError)}>
            {fields.map((field) => (
              <SmartField key={field.id} {...field} fieldRegistry={mergedFieldRegistry} />
            ))}
            <button type="submit">Submit</button>
          </form>
        </EffectsProvider>
      </OptionsProvider>
    </FormProvider>
  )
}

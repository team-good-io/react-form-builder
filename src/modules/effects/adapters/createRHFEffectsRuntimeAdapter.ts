import { useMemo } from "react"
import { type FieldValues, useFormContext, type UseFormReturn } from "react-hook-form"

import type { EffectsRuntimeAdapter, SetValueOptions } from "../types"

type RHFEffectsAdapterInput<TFieldValues extends FieldValues> = Pick<
  UseFormReturn<TFieldValues>,
  "getValues" | "watch" | "setValue" | "resetField" | "clearErrors" | "unregister"
>

export function createRHFEffectsRuntimeAdapter<TFieldValues extends FieldValues = FieldValues>(
  form: RHFEffectsAdapterInput<TFieldValues>
): EffectsRuntimeAdapter {
  return {
    getValues: () => form.getValues() as Record<string, unknown>,
    watch: (callback) =>
      form.watch((values, info) => {
        callback(values as Record<string, unknown>, { name: info.name })
      }),
    setValue: (name: string, value: unknown, options?: SetValueOptions) =>
      form.setValue(name as never, value as never, options),
    resetField: (name: string) => form.resetField(name as never),
    clearErrors: (name?: string) => form.clearErrors(name as never),
    unregister: (name: string) => form.unregister(name as never),
  }
}

export function useRHFEffectsRuntimeAdapter(): EffectsRuntimeAdapter {
  const { getValues, watch, setValue, resetField, clearErrors, unregister } = useFormContext()

  return useMemo(
    () => createRHFEffectsRuntimeAdapter({ getValues, watch, setValue, resetField, clearErrors, unregister }),
    [getValues, watch, setValue, resetField, clearErrors, unregister]
  )
}

import { useMemo } from "react"
import { type FieldValues, useFormContext, type UseFormReturn } from "react-hook-form"

import { OptionsRuntimeAdapter } from "../types"

type RHFOptionsAdapterInput<TFieldValues extends FieldValues> = Pick<
  UseFormReturn<TFieldValues>,
  "getValues" | "watch"
>

export function createRHFOptionsRuntimeAdapter<TFieldValues extends FieldValues = FieldValues>(
  form: RHFOptionsAdapterInput<TFieldValues>
): OptionsRuntimeAdapter {
  return {
    getValues: () => form.getValues() as Record<string, unknown>,
    watch: (callback) =>
      form.watch((values, info) => {
        callback(values as Record<string, unknown>, { name: info.name })
      }),
  }
}

export function useRHFOptionsRuntimeAdapter(): OptionsRuntimeAdapter {
  const { getValues, watch } = useFormContext()

  return useMemo(
    () => createRHFOptionsRuntimeAdapter({ getValues, watch }),
    [getValues, watch]
  )
}

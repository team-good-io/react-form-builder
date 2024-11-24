import { FieldValues, RegisterOptions } from "react-hook-form"
import { OptionsProviderState } from "../OptionsProvider"

export type FieldValue = any

export type Effect = {
  htmlAttrs?: any,
  registerOptions?: RegisterOptions<FieldValues, string>
  setValue?: string,
  resetField?: boolean
  setValueFromOptions?: {
    valueKey: string
  }
}

export type SourceField = Readonly<{
  name: string,
  value?: FieldValue,
  options?: OptionsProviderState
}>

export type TargetField = Readonly<{
  name: string,
  value?: FieldValue,
  options?: OptionsProviderState
}>

export type EffectConfig = Readonly<{
  [sourceField: string]: {
    [sourceValue: string]: {
      [targetField: string]: Effect
    }
  }
}>

export type EffectsProviderState = {
  registerOptions: RegisterOptions<FieldValues, string>,
  htmlAttrs: any
}

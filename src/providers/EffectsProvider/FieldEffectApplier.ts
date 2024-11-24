import { OptionsProviderState } from "../OptionsProvider"
import { Effect, EffectsProviderState, FieldValue, SourceField, TargetField } from "./types"

export default class FieldEffectApplier {
  constructor(
    private setValue: (name: string, value: FieldValue) => void,
    private resetField: (name: string) => void
  ) { }

  private setValueFromOptions = (
    source: SourceField,
    target: TargetField,
    effect: Effect,
    optionsMap?: Map<string, OptionsProviderState>
  ) => {
    const option = optionsMap?.get(source.name)?.data?.find(({ value }) => value === source.value)
    const valueKey = effect?.setValueFromOptions?.valueKey
    if (option && valueKey && option[valueKey]) {
      this.setValue(target.name, option[valueKey])
    }
  }

  applyEffect = (
    source: SourceField,
    target: TargetField,
    effect: Effect,
    optionsMap?: Map<string, OptionsProviderState>
  ) => {
    const newState: EffectsProviderState = { registerOptions: {}, htmlAttrs: {} }

    if (effect.htmlAttrs) {
      newState.htmlAttrs = effect.htmlAttrs
    }

    if (effect.registerOptions) {
      newState.registerOptions = effect.registerOptions
    }

    if (effect.setValue) {
      this.setValue(target.name, effect.setValue)
    }

    if (effect.resetField) {
      this.resetField(target.name)
    }

    if (effect.setValueFromOptions) {
      this.setValueFromOptions(source, target, effect, optionsMap)
    }

    return newState
  }
}
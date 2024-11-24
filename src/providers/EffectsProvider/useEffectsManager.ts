import { FieldValues, UseFormReturn } from "react-hook-form";
import { EffectConfig, EffectsProviderState } from "./types";
import PubSub from "../../pubsub/PubSub";
import { useCallback, useContext, useEffect, useMemo } from "react";
import OptionsContext from "../OptionsProvider/OptionsContext";
import buildEffects from "./buildEffects";
import FieldEffectApplier from "./FieldEffectApplier";

const useEffectsManager = (
  config: EffectConfig,
  useFormContext: <TFieldValues extends FieldValues, TContext = any, TransformedValues extends FieldValues | undefined = undefined>() => UseFormReturn<TFieldValues, TContext, TransformedValues>
) => {
  const { watch, getValues, setValue, resetField } = useFormContext()
  const { publish, subscribe, getSnapshot } = new PubSub<EffectsProviderState>()
  const effectApplier = useMemo(() => new FieldEffectApplier(setValue, resetField), [resetField, setValue])
  const options = useContext(OptionsContext)

  const applyEffects = useCallback((sourceName: string, values: FieldValues) => {
    const optionsMap = options.getSnapshot()
    const effects = buildEffects(config, sourceName, values)
    effects.forEach(({ source, target, effect }) => {
      const newState = effectApplier.applyEffect(source, target, effect, optionsMap)
      publish(target.name, newState)
    })
  }, [])

  const init = useCallback(() => {
    const values = getValues()
    Object.keys(values).forEach((key) => applyEffects(key, values))
  }, [])

  const watchForm = useCallback(() => {
    const subscription = watch((values, { name }) => {
      if(!name) return
      applyEffects(name, values)
    })
    return subscription
  }, [])

  useEffect(() => {
    const subscription = watchForm()
    return () => subscription.unsubscribe()
  }, [watchForm])
  
  useEffect(() => {
    init()
  }, [init])

  return {
    subscribe,
    getSnapshot
  }
}

export default useEffectsManager
import { useEffect, useMemo } from "react"
import { useFormContext } from "react-hook-form"

import { PubSubState } from "../../shared/pubsub/PubSubState"
import { bindMethods } from "../../utils/bindMethods"
import { EffectsControllerImpl } from "./controller/EffectsControllerImpl"
import { EffectsContext } from "./effects-context"
import { EffectsConfig, EffectState } from "./types"

interface EffectsProviderProps {
  config: EffectsConfig
  children: React.ReactNode
}

export function EffectsProvider(props: EffectsProviderProps) {
  const { config, children } = props
  const { getValues, watch, setValue, resetField, clearErrors, unregister } = useFormContext()
  const state = useMemo(() => bindMethods(new PubSubState<EffectState>(new Map())), [])
  const toolbox = useMemo(() => ({
    form: {
      getValues,
      watch,
      setValue,
      resetField,
      clearErrors,
      unregister,
    },
    state,
  }), [getValues, watch, setValue, resetField, clearErrors, unregister, state])
  const controller = useMemo(() => new EffectsControllerImpl(config, toolbox), [config, toolbox])

  useEffect(() => {
    controller.init()
    return () => controller.destroy()
  }, [controller])

  const value = useMemo(() => ({ subscribe: state.subscribe }), [state])

  return (
    <EffectsContext.Provider value={value}>
      {children}
    </EffectsContext.Provider>
  )
}

import { useEffect, useMemo } from "react"

import { PubSubState } from "../../shared/pubsub/PubSubState"
import { bindMethods } from "../../utils/bindMethods"
import { useRHFEffectsRuntimeAdapter } from "./adapters/createRHFEffectsRuntimeAdapter"
import { EffectsControllerImpl } from "./controller/EffectsControllerImpl"
import { EffectsContext } from "./effects-context"
import { EffectsConfig, EffectState } from "./types"

interface EffectsProviderProps {
  config: EffectsConfig
  children: React.ReactNode
}

export function EffectsProvider(props: EffectsProviderProps) {
  const { config, children } = props
  const adapter = useRHFEffectsRuntimeAdapter()
  const state = useMemo(() => bindMethods(new PubSubState<EffectState>(new Map())), [])
  const runtime = useMemo(() => ({ form: adapter, state }), [state, adapter])
  const controller = useMemo(() => new EffectsControllerImpl(config, runtime), [config, runtime])

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

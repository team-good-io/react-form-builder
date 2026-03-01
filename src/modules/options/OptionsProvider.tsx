import { useEffect, useMemo } from "react"

import { PubSubState } from "./../../shared/pubsub/PubSubState"
import { bindMethods } from "./../../utils/bindMethods"
import { useRHFOptionsRuntimeAdapter } from "./adapters/createRHFOptionsRuntimeAdapter"
import { OptionsControllerImpl } from "./controller/OptionsControllerImpl"
import { OptionsContext } from "./options-context"
import { OptionsConfig, OptionsLoader, OptionsState } from "./types"

interface OptionsProviderProps {
  config: OptionsConfig
  loader: OptionsLoader
  children: React.ReactNode
}

export function OptionsProvider(props: OptionsProviderProps) {
  const { config, loader, children } = props
  const adapter = useRHFOptionsRuntimeAdapter()
  const state = useMemo(() => bindMethods(new PubSubState<OptionsState>(new Map())), [])
  const runtime = useMemo(() => ({ form: adapter, state, load: { loader } }), [state, adapter, loader])
  const controller = useMemo(() => new OptionsControllerImpl(config, runtime), [config, runtime])

  useEffect(() => {
    controller.init()
    return () => controller.destroy()
  }, [controller])

  const ctxValue = useMemo(() => ({
    subscribe: state.subscribe,
    getSnapshot: state.getSnapshot
  }), [state])

  return (
    <OptionsContext.Provider value={ctxValue}>
      {children}
    </OptionsContext.Provider>
  )
}

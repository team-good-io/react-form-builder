import { useEffect, useMemo } from "react"
import { useFormContext } from "react-hook-form"

import { PubSubState } from "./../../shared/pubsub/PubSubState"
import { bindMethods } from "./../../utils/bindMethods"
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
  const { watch, getValues } = useFormContext()
  const state = useMemo(() => bindMethods(new PubSubState<OptionsState>(new Map())), [])
  const runtimeContext = useMemo(() => ({ state, form: { getValues, watch }, load: { loader } }), [state, getValues, watch, loader])
  const controller = useMemo(() => new OptionsControllerImpl(config, runtimeContext), [config, runtimeContext])

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

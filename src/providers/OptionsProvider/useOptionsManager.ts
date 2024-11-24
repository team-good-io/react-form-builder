import { useCallback, useEffect } from "react"
import { FieldValues, UseFormGetValues, UseFormReturn, UseFormWatch } from "react-hook-form"

import PubSub from "../../pubsub/PubSub"
import { createUrlPath, fetchOptions } from "../../utils"

import { OptionProps, OptionsProviderState, OptionsSource } from "./types"

const useOptionsManager = (
  config: Record<string, OptionProps[] | OptionsSource>,
  useFormContext: <TFieldValues extends FieldValues, TContext = any, TransformedValues extends FieldValues | undefined = undefined>() => UseFormReturn<TFieldValues, TContext, TransformedValues>
) => {
  const { publish, subscribe, getSnapshot } = new PubSub<OptionsProviderState>()
  const { watch , getValues } = useFormContext()

  const updateOption = useCallback(
    async (key: string, source: OptionsSource, values: FieldValues) => {
      if (source.deps?.some((dep) => !values[dep])) return

      publish(key, {loading: true, data: []})

      try {
        const path = createUrlPath(source.path, values)
        const data = await fetchOptions({ ...source, path })
        publish(key, {loading: false, data })
      } catch (error) {
        publish(key, {loading: false, data: [], error })
      }
    },
    [publish]
  )

  const init = useCallback(() => {
    const fieldValues = getValues()
    Object.entries(config).forEach(([key, data]) => {
      if (Array.isArray(data)) {
        const newState = { loading: false, data }
        publish(key, newState)
      } else {
        updateOption(key, data, fieldValues)
      }
    })
  }, [config, getValues, publish, updateOption])

  const watchForm = useCallback(() => {
    const subscription = watch((fieldValues, { name }) => {
      if(!name) return
      Object.entries(config).forEach(([key, data]) => {
        if(!Array.isArray(data) && data.deps?.includes(name)) {
          updateOption(key, data, fieldValues)
        }
      })
    })
    return subscription
  }, [config, updateOption, watch])

  useEffect(() => {
    const subscription = watchForm()
    return () => subscription.unsubscribe()
  }, [watchForm])
  
  useEffect(() => {
    init()
  }, [init])

  return {
    getSnapshot,
    subscribe
  }
}


export default useOptionsManager
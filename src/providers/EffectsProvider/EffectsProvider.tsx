import { FieldValues, UseFormReturn } from "react-hook-form"
import EffectsContext from "./EffectsContext"
import { EffectConfig } from "./types"
import useEffectsManager from "./useEffectsManager"

type EffectsProviderProps = {
  config: EffectConfig,
  children: React.ReactNode
  useFormContext: <TFieldValues extends FieldValues, TContext = any, TransformedValues extends FieldValues | undefined = undefined>() => UseFormReturn<TFieldValues, TContext, TransformedValues>
}

const EffectsProvider = ({ config, children, useFormContext}: EffectsProviderProps) => {
  const { subscribe } = useEffectsManager(config, useFormContext)

  return (
    <EffectsContext.Provider value={{ subscribe }}>
      {children}
    </EffectsContext.Provider>
  )
}

export default EffectsProvider
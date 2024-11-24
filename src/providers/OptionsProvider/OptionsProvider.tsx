import { FieldValues, UseFormGetValues, UseFormReturn, UseFormWatch } from "react-hook-form"
import OptionsContext from "./OptionsContext"
import { OptionProps, OptionsSource } from "./types"
import useOptionsManager from "./useOptionsManager"

type OptionsProviderProps = {
  config: Record<string, OptionProps[] | OptionsSource>
  children: React.ReactNode
  useFormContext: <TFieldValues extends FieldValues, TContext = any, TransformedValues extends FieldValues | undefined = undefined>() => UseFormReturn<TFieldValues, TContext, TransformedValues>
}

const OptionsProvider = ({ config, children, useFormContext }: Readonly<OptionsProviderProps>) => {
  const { getSnapshot, subscribe } = useOptionsManager(config, useFormContext)

  return (
    <OptionsContext.Provider value={{ getSnapshot, subscribe }}>
      {children}
    </OptionsContext.Provider>
  )
}

export default OptionsProvider
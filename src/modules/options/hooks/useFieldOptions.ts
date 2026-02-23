import { useEffect, useState } from "react"

import { OptionsState } from "../types"
import { useOptionsContext } from "./useOptionsContext"

export const useFieldOptions = (fieldId: string) => {
  const { subscribe } = useOptionsContext()
  const [options, setOptions] = useState<OptionsState>({ loading: false })

  useEffect(() => {
    const subscription = subscribe(fieldId, setOptions)
    return () => subscription.unsubscribe()
  }, [fieldId, subscribe])

  return options
}

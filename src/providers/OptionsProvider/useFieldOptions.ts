import { useContext, useEffect, useState } from "react"
import OptionsContext from "./OptionsContext"
import { OptionsProviderState } from "./types"

const useFieldOptions = (name: string) => {
  const { subscribe } = useContext(OptionsContext)
  const [state, setState] = useState<OptionsProviderState>({ loading: false})

  useEffect(() => {
    const subscription = subscribe(name, setState)
    return () => subscription.unsubscribe()
  }, [name, subscribe])

  return state
}

export default useFieldOptions
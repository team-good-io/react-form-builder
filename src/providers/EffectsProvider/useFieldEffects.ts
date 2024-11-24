import { useContext, useEffect, useState } from 'react'
import EffectsContext from './EffectsContext'
import { EffectsProviderState } from '.'

const useFieldEffects = (name: string) => {
  const { subscribe } = useContext(EffectsContext)
  const [state, setState] = useState<EffectsProviderState>({ htmlAttrs: {}, registerOptions: {}})

  useEffect(() => {
    const subscription = subscribe(name, setState)
    return () => subscription.unsubscribe()
  }, [name, subscribe])

  return state
}

export default useFieldEffects
import { useContext } from 'react'

import { EffectsContext, EffectsContextProps } from '../effects-context'
import type { EffectState } from '../types'

export const useEffectsContext = (): EffectsContextProps<EffectState> => {
  const context = useContext(EffectsContext)

  if (!context) {
    throw new Error('useEffectsContext must be used within an EffectsProvider')
  }

  return context
}

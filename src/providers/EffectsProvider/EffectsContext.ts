import { createContext } from 'react'
import { EffectsProviderState } from './types'

export type EffectsContextProps = {
  subscribe: (followerField: string, callback: (newState: EffectsProviderState) => void) => { unsubscribe: () => void }
}

const EffectsContext = createContext<EffectsContextProps>({
  subscribe: () => ({ unsubscribe: () => {} })
})

export default EffectsContext
import { createContext } from "react"

import { EffectState } from "./types"

export type EffectsContextProps<TState> = {
  subscribe: (name: string, callback: (data: TState) => void) => { unsubscribe: () => void };
}

export const EffectsContext = createContext<EffectsContextProps<EffectState> | undefined>(undefined)

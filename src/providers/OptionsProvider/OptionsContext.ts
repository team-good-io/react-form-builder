import { createContext } from "react"
import { OptionsProviderState } from "./types"

type OptionsContextProps = {
  getSnapshot: () => Map<string, OptionsProviderState>
  subscribe: (field: string, callback: (data: OptionsProviderState) => void) => { unsubscribe: () => void }
}

const OptionsContext = createContext<OptionsContextProps>({
  getSnapshot: () => (new Map()),
  subscribe: () => ({ unsubscribe: () => {} })
})

export default OptionsContext
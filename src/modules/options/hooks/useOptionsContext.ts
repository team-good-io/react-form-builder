import { useContext } from 'react'

import { OptionsContext, OptionsContextProps } from '../options-context'
import { OptionsState } from '../types'

export const useOptionsContext = (): OptionsContextProps<OptionsState> => {
  const context = useContext(OptionsContext)

  if (!context) {
    throw new Error('useOptionsContext must be used within an OptionsProvider')
  }

  return context
}

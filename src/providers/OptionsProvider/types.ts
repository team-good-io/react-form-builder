export type OptionsProviderState = {
  loading: boolean
  data?: OptionProps[]
  error?: unknown
}

export type OptionProps = {
  label: string
  value: string
  [key: string]: any
}

export type OptionsSource = {
  path: string
  deps?: string[]
  labelName?: string
  valueName?: string
}

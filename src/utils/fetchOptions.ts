import { OptionProps, OptionsSource } from '../providers/OptionsProvider/types'

const fetchOptions = async (source: Readonly<OptionsSource>): Promise<OptionProps[]> => {
  const { path, labelKey = 'label', valueKey = 'value' } = source
  
  const response = await fetch(path)
  const options = await response.json()

  return options.map((option: Record<string, unknown>) => ({
    ...option,
    label: option[labelKey],
    value: option[valueKey],
  }))

}

export default fetchOptions
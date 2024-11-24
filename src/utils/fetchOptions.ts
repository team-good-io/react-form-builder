import { OptionProps, OptionsSource } from '../providers/OptionsProvider/types'

const fetchOptions = async (source: Readonly<OptionsSource>): Promise<OptionProps[]> => {
  const { path, labelName = 'label', valueName = 'value' } = source
  
  const response = await fetch(path)
  const options = await response.json()

  return options.map((option: Record<string, unknown>) => ({
    ...option,
    label: option[labelName],
    value: option[valueName],
  }))

}

export default fetchOptions
# Form Builder for React
React Form Builder is a versatile and customizable form-building library powered by react-hook-form. It allows developers to effortlessly generate dynamic and feature-rich forms based on a JSON configuration.

## Features

## Installation
Install the package via npm or yarn:
```bash
npm install @team-good-io/react-form-builder
```
```bash
yarn add @team-good-io/react-form-builder
```

## Usage

### Options Provider
```ts
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { OptionsProvider, useFieldOptions } from "@team-good-io/react-form-builder"

const Field = ({ name }: { name: string }) => {
  const { register } = useFormContext()
  const options = useFieldOptions(name)

  return (
    <select {...register(name)}>
      <option />
      {options.data?.map(({ label, value }) => (<option value={value}>{label}</option>))}
    </select>
  )
}

export const Form = () => {
  const instance = useForm()
  const fields = ['COUNTRY', 'STATE']
  const optionsConfig = {
    'COUNTRY': [{ label: "Japan", value: "JP"}],
    'STATE': {
      deps: ['COUNTRY'],
      path: '/api/to/states.json?country={COUNTRY}',
      labelName: 'label',
      valueName: 'value'
    }
  }

  return (
    <FormProvider {...instance}>
      <OptionsProvider config={optionsConfig} useFormContext={useFormContext}>
        {fields.map((field) => (<Field key={field} name={field}/>))}
      </OptionsProvider>
    </FormProvider>
  )
}
```

### Effects Provider
```ts
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { EffectsProvider, useFieldEffects } from "@team-good-io/react-form-builder"

const Field = ({ name }: { name: string }) => {
  const { register } = useFormContext()
  const { htmlAttrs, registerOptions } = useFieldEffects(name)

  return <input {...htmlAttrs} {...register(name, registerOptions)} />
}

export const Form = () => {
  const instance = useForm()
  const fields = ['COUNTRY', 'STATE']
  const effectssConfig = {
    COUNTRY: {
      NO_VALUE: {
        STATE: {
          htmlAttrs: {
            disabled: true
          },
          resetField: true
        }
      },
      HAS_VALUE: {
        STATE: {
          setValue: 'effect',
          htmlAttrs: {
            disabled: false
          }
        }
      },
      UK: {
        STATE: {
          setValue: 'STATE'
        }
      }
    }
  }

  return (
    <FormProvider {...instance}>
      <EffectsProvider config={effectssConfig} useFormContext={useFormContext}>
        {fields.map((field) => (<Field key={field} name={field}/>))}
      </EffectsProvider>
    </FormProvider>
  )
}
```

## Acknowledgments
* [React Hook Form ](https://react-hook-form.com/) for providing the form library.
Feel free to suggest improvements or report bugs via issues.

## License

This package is licensed under the MIT License.
# Form Builder for React
React Form Builder is a versatile and customizable form-building library powered by react-hook-form. It allows developers to effortlessly generate dynamic and feature-rich forms based on a JSON configuration.

## Installation

```bash
npm install @team-good-io/react-form-builder react react-dom react-hook-form
```

`react`, `react-dom`, and `react-hook-form` are peer dependencies.

## Quick Start

```tsx
import { FormBuilder } from "@team-good-io/react-form-builder"

export function SignupForm() {
  return (
    <FormBuilder
      fields={[
        { id: "firstName" },
        { id: "lastName" },
      ]}
      defaultValues={{
        firstName: "",
        lastName: "",
      }}
      onSubmit={(values) => {
        console.log("submit", values)
      }}
      onError={(errors) => {
        console.error("validation errors", errors)
      }}
    />
  )
}
```

## `FormBuilder` Props

- `fields: FieldConfig[]`
- `fieldRegistry?: FieldRegistryInput | FieldRegistry`
- `defaultValues?: Record<string, unknown>`
- `effectsConfig?: EffectsConfig`
- `optionsConfig?: Record<string, OptionsSource>`
- `optionsLoader?: (request: { sourceName: string; source: OptionsSourceRemote | OptionsSourceRemoteDynamic; values: Record<string, unknown>; path: string }) => Promise<{ label: string; value: string; ref?: unknown }[]>`
- `onSubmit: (values: Record<string, unknown>) => void`
- `onError?: (errors: unknown) => void`

## Field Kinds and Registry

`SmartField` rendering is registry-driven. Each field uses `kind` to resolve a renderer.

Built-in kinds:

- `text`
- `email`
- `password`
- `number`
- `tel`
- `url`
- `date`
- `datetime-local`
- `time`
- `checkbox`
- `radio`
- `select`
- `textarea`

If `kind` is omitted, `text` is used.

### Custom Field Kind

```tsx
import { FormBuilder, createFieldRegistry, type FieldRenderer } from "@team-good-io/react-form-builder"

const currencyRenderer: FieldRenderer = ({ field, fieldProps, register, registerProps }) => {
  return (
    <div>
      <span>$</span>
      <input type="number" step="0.01" {...fieldProps} {...register(field.id, registerProps)} />
    </div>
  )
}

const registry = createFieldRegistry({
  currency: currencyRenderer,
})

export function PaymentForm() {
  return (
    <FormBuilder
      fields={[{ id: "amount", kind: "currency" }]}
      fieldRegistry={registry}
      onSubmit={(values) => console.log(values)}
    />
  )
}
```

You can also pass a plain object directly to `fieldRegistry` instead of creating an instance first.

## Options Sources

Select-like fields can receive options from:

- static config
- remote endpoint
- remote endpoint with dynamic dependencies

`optionsConfig` is keyed by field `id`.

```tsx
<FormBuilder
  fields={[
    { id: "country", kind: "select" },
    { id: "city", kind: "select" },
  ]}
  optionsConfig={{
    country: {
      type: "remote",
      path: "/api/countries",
    },
    city: {
      type: "remote-dynamic",
      path: "/api/cities?country={country}",
      dependencies: ["country"],
    },
  }}
  optionsLoader={async ({ path }) => {
    const res = await fetch(path)
    const data = await res.json()

    return data.map((item: { id: string; name: string }) => ({
      label: item.name,
      value: item.id,
      ref: item,
    }))
  }}
  onSubmit={(values) => console.log(values)}
/>
```

Notes:

- If `optionsLoader` is omitted, remote sources resolve to an empty list by default.
- `remote-dynamic` clears options when required dependencies are missing.
- Static options can still be provided directly on field config with `options`.

## Effects

Use `effectsConfig` to run actions when conditions match.

```tsx
<FormBuilder
  fields={[
    { id: "hasMiddleName" },
    { id: "middleName" },
  ]}
  effectsConfig={{
    rules: [
      {
        id: "toggle-middle-name",
        when: {
          field: "hasMiddleName",
          operator: "===",
          value: true,
        },
        actions: [{ type: "showField", targets: ["middleName"] }],
      },
      {
        id: "hide-middle-name",
        when: {
          field: "hasMiddleName",
          operator: "===",
          value: false,
        },
        actions: [
          { type: "hideField", targets: ["middleName"], unregister: true },
          { type: "resetField", targets: ["middleName"] },
          { type: "clearErrors", targets: ["middleName"] },
        ],
      },
    ],
  }}
  onSubmit={(values) => console.log(values)}
/>
```

### Condition Operators

- `===`
- `!==`
- `>`
- `<`
- `in`
- `length>`
- `length<`
- `length===`

### Composite Conditions

```ts
{ type: "AND", conditions: [/* nested conditions */] }
{ type: "OR", conditions: [/* nested conditions */] }
{ type: "NOT", condition: {/* nested condition */} }
```

### Built-in Actions

- `setValue`
- `resetField`
- `clearErrors`
- `setFieldProps`
- `setRegisterProps`
- `showField`
- `hideField` (`unregister?: boolean`)

### `skipOnInit`

All built-in actions support `skipOnInit?: boolean`.

- Default behavior: actions can run during initial effect evaluation.
- Set `skipOnInit: true` to prevent an action from running on init.

## Custom Evaluators and Actions

You can extend `effectsConfig` with custom evaluators and actions.

```tsx
<FormBuilder
  fields={[{ id: "country" }, { id: "state" }]}
  effectsConfig={{
    evaluators: {
      isUS: (fieldValue) => fieldValue === "US",
    },
    actions: {
      log: (_toolbox, action) => ({
        async execute() {
          console.log("custom action", action)
        },
      }),
    },
    rules: [
      {
        id: "country-log",
        when: {
          field: "country",
          operator: "===",
          value: "US",
        },
        actions: [{ type: "log", targets: ["country"] }],
      },
    ],
  }}
  onSubmit={(values) => console.log(values)}
/>
```

## Notes

- `hideField` hides by setting internal `fieldProps.hidden = true`; hidden fields are not rendered.
- If `hideField.unregister` is `true`, the field is unregistered from `react-hook-form`.
- Keep field IDs unique. Duplicate IDs lead to collisions in form state.

## Acknowledgments
* [React Hook Form ](https://react-hook-form.com/) for providing the form library.

Feel free to suggest improvements or report bugs via issues.

## License

This package is licensed under the [MIT License](https://github.com/team-good-io/react-form-builder/blob/main/LICENSE.md).
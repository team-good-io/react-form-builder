import { FormBuilder } from "@team-good-io/react-form-builder"

export function App() {
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log(values)
  }

  return (
    <FormBuilder
      defaultValues={{
        firstName: "Jane"
      }}
      fields={[
        { id: "firstName" },
        { id: "lastName" },
        { id: "gender", kind: "select", options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
      ]}
      effectsConfig={{
        rules: [
          {
            id: "testFieldPropsEffect",
            when: {
              field: "firstName",
              operator: "===",
              value: "John"
            },
            actions: [
              {
                type: "setFieldProps",
                targets: ["lastName"],
                value: { disabled: true },
                skipOnInit: true,
              }
            ]
          },
          {
            id: "nameEffect",
            when: {
              field: "firstName",
              operator: "===",
              value: "John"
            },
            actions: [
              {
                type: "setValue",
                targets: ["lastName"],
                value: "Doe"
              }
            ]
          },
          {
            id: "resetEffect",
            when: {
              field: "firstName",
              operator: "!==",
              value: "John"
            },
            actions: [
              {
                type: "resetField",
                targets: ["lastName"]
              }
            ]
          }
        ]
      }}
      onSubmit={handleSubmit}
    />
  )
}

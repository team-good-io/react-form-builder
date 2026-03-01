import { FormBuilder, OptionsSourceType } from "@team-good-io/react-form-builder"

const cityOptionsByCountry: Record<string, { label: string; value: string }[]> = {
  us: [
    { label: "New York", value: "new-york" },
    { label: "Austin", value: "austin" },
    { label: "San Francisco", value: "san-francisco" },
  ],
  ee: [
    { label: "Tallinn", value: "tallinn" },
    { label: "Tartu", value: "tartu" },
    { label: "Pärnu", value: "parnu" },
  ],
  fi: [
    { label: "Helsinki", value: "helsinki" },
    { label: "Tampere", value: "tampere" },
    { label: "Turku", value: "turku" },
  ],
}

export function App() {
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log(values)
  }

  return (
    <FormBuilder
      defaultValues={{
        firstName: "Jane",
        hasMiddleName: false,
        country: "",
        city: "",
        subscribe: false,
        email: "",
      }}
      fields={[
        { id: "firstName" },
        { id: "lastName" },
        { id: "hasMiddleName", kind: "checkbox" },
        { id: "middleName" },
        {
          id: "country",
          kind: "select",
          options: [
            { label: "United States", value: "us" },
            { label: "Estonia", value: "ee" },
            { label: "Finland", value: "fi" },
          ],
        },
        { id: "city", kind: "select" },
        { id: "subscribe", kind: "checkbox" },
        { id: "email", kind: "email" },
      ]}
      optionsConfig={{
        city: {
          type: OptionsSourceType.REMOTE_DYNAMIC,
          path: "/api/cities?country={country}",
          dependencies: ["country"],
        },
      }}
      optionsLoader={async ({ sourceName, values }) => {
        if (sourceName !== "city") return []

        const country = values.country
        if (typeof country !== "string") return []

        return cityOptionsByCountry[country] || []
      }}
      effectsConfig={{
        rules: [
          {
            id: "disable-last-name-for-john",
            when: {
              field: "firstName",
              operator: "===",
              value: "John",
            },
            actions: [
              {
                type: "setFieldProps",
                targets: ["lastName"],
                value: { disabled: true },
                skipOnInit: true,
              },
              {
                type: "setValue",
                targets: ["lastName"],
                value: "Doe",
                skipOnInit: true,
              },
            ],
          },
          {
            id: "enable-last-name-for-non-john",
            when: {
              field: "firstName",
              operator: "!==",
              value: "John",
            },
            actions: [
              {
                type: "setFieldProps",
                targets: ["lastName"],
                value: { disabled: false },
              },
            ],
          },
          {
            id: "show-middle-name",
            when: {
              field: "hasMiddleName",
              operator: "===",
              value: true,
            },
            actions: [
              {
                type: "showField",
                targets: ["middleName"],
              },
            ],
          },
          {
            id: "hide-middle-name",
            when: {
              field: "hasMiddleName",
              operator: "===",
              value: false,
            },
            actions: [
              {
                type: "hideField",
                targets: ["middleName"],
                unregister: true,
              },
              {
                type: "resetField",
                targets: ["middleName"],
              },
              {
                type: "clearErrors",
                targets: ["middleName"],
              },
            ],
          },
          {
            id: "reset-city-on-country-change",
            when: {
              field: "country",
              operator: "!==",
              value: "",
            },
            actions: [
              {
                type: "resetField",
                targets: ["city"],
                skipOnInit: true,
              },
            ],
          },
          {
            id: "show-email-when-subscribed",
            when: {
              field: "subscribe",
              operator: "===",
              value: true,
            },
            actions: [
              {
                type: "showField",
                targets: ["email"],
              },
            ],
          },
          {
            id: "hide-email-when-unsubscribed",
            when: {
              field: "subscribe",
              operator: "===",
              value: false,
            },
            actions: [
              {
                type: "hideField",
                targets: ["email"],
                unregister: true,
              },
              {
                type: "resetField",
                targets: ["email"],
              },
              {
                type: "clearErrors",
                targets: ["email"],
              },
            ],
          },
        ],
      }}
      onSubmit={handleSubmit}
    />
  )
}

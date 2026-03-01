import type { FieldRenderer } from "../types"

export const selectFieldRenderer: FieldRenderer = ({ field, fieldProps, register, registerProps }) => {
  return (
    <div style={{ padding: "8px" }}>
      <label htmlFor={field.id} style={{ display: "block" }}>{field.id}</label>
      <select id={field.id} {...fieldProps} {...register(field.id, registerProps)}>
        <option value="">Select an option</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

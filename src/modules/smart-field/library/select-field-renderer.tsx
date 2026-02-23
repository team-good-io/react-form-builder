import type { FieldRenderer } from "../types"

export const selectFieldRenderer: FieldRenderer = ({ field, fieldProps, register, registerProps }) => {
  return (
    <select {...fieldProps} {...register(field.id, registerProps)}>
      <option value="">Select an option</option>
      {field.options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

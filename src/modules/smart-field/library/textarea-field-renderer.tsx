import type { FieldRenderer } from "../types"

export const textareaFieldRenderer: FieldRenderer = ({ field, fieldProps, register, registerProps }) => {
  return <textarea {...fieldProps} {...register(field.id, registerProps)} />
}

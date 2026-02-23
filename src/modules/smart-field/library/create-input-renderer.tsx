import type { FieldRenderer } from "../types"

export const createInputRenderer = (inputType: string): FieldRenderer => {
  return ({ field, fieldProps, register, registerProps }) => {
    return <input type={inputType} {...fieldProps} {...register(field.id, registerProps)} />
  }
}

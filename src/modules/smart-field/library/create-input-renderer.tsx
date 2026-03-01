import type { FieldRenderer } from "../types"

export const createInputRenderer = (inputType: string): FieldRenderer => {
  return ({ field, fieldProps, register, registerProps }) => {
    return (
      <div style={{padding: "8px"}}>
        <label htmlFor={field.id} style={{display: "block"}}>{field.id}</label>
        <input id={field.id} type={inputType} {...fieldProps} {...register(field.id, registerProps)} />
      </div>
      )
  }
}

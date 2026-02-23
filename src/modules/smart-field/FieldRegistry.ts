import { Registry } from "../../shared/Registry"
import { createInputRenderer } from "./library/create-input-renderer"
import { selectFieldRenderer } from "./library/select-field-renderer"
import { textareaFieldRenderer } from "./library/textarea-field-renderer"
import type { FieldRegistryInput, FieldRenderer } from "./types"

const defaultFieldRenderers: FieldRegistryInput = {
  text: createInputRenderer("text"),
  email: createInputRenderer("email"),
  password: createInputRenderer("password"),
  number: createInputRenderer("number"),
  tel: createInputRenderer("tel"),
  url: createInputRenderer("url"),
  date: createInputRenderer("date"),
  "datetime-local": createInputRenderer("datetime-local"),
  time: createInputRenderer("time"),
  checkbox: createInputRenderer("checkbox"),
  radio: createInputRenderer("radio"),
  select: selectFieldRenderer,
  textarea: textareaFieldRenderer,
}

export class FieldRegistry extends Registry<FieldRenderer> {
  constructor(customRegistry: FieldRegistryInput = {}) {
    super()
    this.registerDefaults()
    this.registerCustom(customRegistry)
  }

  private registerDefaults(): void {
    for (const [name, renderer] of Object.entries(defaultFieldRenderers)) {
      this.register(name, renderer, true)
    }
  }

  private registerCustom(customRegistry: FieldRegistryInput): void {
    for (const [name, renderer] of Object.entries(customRegistry)) {
      this.register(name, renderer, true)
    }
  }

  toRecord(): FieldRegistryInput {
    const record: FieldRegistryInput = {}
    for (const kind of this.list()) {
      const renderer = this.get(kind)
      if (renderer) {
        record[kind] = renderer
      }
    }
    return record
  }
}

export const createFieldRegistry = (customRegistry: FieldRegistryInput | FieldRegistry = {}): FieldRegistry => {
  if (customRegistry instanceof FieldRegistry) {
    return new FieldRegistry(customRegistry.toRecord())
  }

  return new FieldRegistry(customRegistry)
}

export const defaultFieldRegistry = createFieldRegistry()

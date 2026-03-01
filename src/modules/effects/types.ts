import { PubSubState } from "src/shared/pubsub/PubSubState"

export type EffectEvaluator = (fieldValue: unknown, conditionValue: unknown) => boolean | Promise<boolean>

export type EffectActionCommandFactory = (runtimeContext: EffectsRuntimeContext, action: EffectAction) => EffectCommand

export interface EffectCommand {
  execute(): Promise<void>
}

export interface EffectRule {
  id: string
  when: EffectCondition
  actions: EffectAction[]
}

export type EffectCondition = SimpleCondition | CompositeCondition

export type Operator = "===" | "!==" | ">" | "<" | "in" | "length>" | "length<" | "length==="

export type SimpleCondition = {
  field: string
  operator: Operator
  value: unknown
}

export type CompositeCondition =
  | { type: "AND"; conditions: EffectCondition[] }
  | { type: "OR"; conditions: EffectCondition[] }
  | { type: "NOT"; condition: EffectCondition }

export type BuiltInEffectAction =
  | { type: "setValue"; targets: string[]; value: unknown; skipOnInit?: boolean }
  | { type: "resetField"; targets: string[]; skipOnInit?: boolean }
  | { type: "clearErrors"; targets: string[]; skipOnInit?: boolean }
  | { type: "showField"; targets: string[]; skipOnInit?: boolean }
  | { type: "hideField"; targets: string[]; skipOnInit?: boolean; unregister?: boolean }

export interface CustomEffectAction {
  type: string
  targets: string[]
  value?: unknown
  skipOnInit?: boolean
  [key: string]: unknown
}

export type EffectAction = BuiltInEffectAction | CustomEffectAction

export interface EffectsRuntimeContext {
  form: EffectsRuntimeAdapter
  state: PubSubState<EffectState>
}

export type SetValueOptions = {
  shouldValidate?: boolean
  shouldDirty?: boolean
  shouldTouch?: boolean
}

export interface EffectsRuntimeAdapter {
  getValues(): Record<string, unknown>
  setValue(name: string, value: unknown, options?: SetValueOptions): void
  resetField(name: string): void
  clearErrors(name?: string): void
  unregister(name: string): void
  watch(callback: (values: Record<string, unknown>, info: { name?: string }) => void): { unsubscribe: () => void }
}

export interface EffectsConfig {
  rules: EffectRule[]
  evaluators?: Record<string, EffectEvaluator>
  actions?: Record<string, EffectActionCommandFactory>
  allowBuiltInOverride?: boolean
}

export interface EffectState {
  fieldProps?: Record<string, unknown>
  registerProps?: Record<string, unknown>
}

import type { EffectActionRegistry } from "../actions/EffectActionRegistry"
import type { EffectEvaluatorRegistry } from "../evaluators/EffectEvaluatorRegistry"
import type { EffectAction, EffectCondition, EffectRule, EffectsRuntimeContext } from "../types"
import type { EffectsEngine } from "./EffectsEngine"

export class EffectsEngineImpl implements EffectsEngine {
  private readonly rules: EffectRule[]

  private readonly runtimeContext: EffectsRuntimeContext

  private readonly evaluatorRegistry: EffectEvaluatorRegistry

  private readonly actionRegistry: EffectActionRegistry

  private readonly dependentFields: string[] = []

  private actionQueue: EffectAction[] = []

  private flushing = false

  private destroyed = false

  constructor(
    rules: EffectRule[],
    runtimeContext: EffectsRuntimeContext,
    evaluatorRegistry: EffectEvaluatorRegistry,
    actionRegistry: EffectActionRegistry
  ) {
    this.rules = rules
    this.runtimeContext = runtimeContext
    this.evaluatorRegistry = evaluatorRegistry
    this.actionRegistry = actionRegistry
    this.dependentFields = this.getDependentFields()
  }

  public async init(values: Record<string, unknown>) {
    this.destroyed = false

    for (const rule of this.rules) {
      const allConditionsMet = await this.evaluateCondition(rule.when, values)
      if (allConditionsMet) {
        rule.actions.filter(this.shouldRunOnInit).forEach(this.queueAction.bind(this))
      }
    }
  }

  public async execute(changedFieldName: string, values: Record<string, unknown>) {
    if (!this.dependentFields.includes(changedFieldName)) return

    for (const rule of this.rules) {
      const isRelated = this.collectDependentFields(rule.when).includes(changedFieldName)
      if (!isRelated) continue

      const allConditionsMet = await this.evaluateCondition(rule.when, values)
      if (!allConditionsMet) continue

      rule.actions.forEach(this.queueAction.bind(this))
    }
  }

  public destroy() {
    this.destroyed = true
  }

  private getDependentFields(): string[] {
    return Array.from(new Set(
      this.rules.flatMap(rule => this.collectDependentFields(rule.when)),
    ))
  }

  private collectDependentFields(condition: EffectCondition): string[] {
    if ('type' in condition) {
      switch (condition.type) {
        case 'AND':
        case 'OR':
          return condition.conditions.flatMap((nestedCondition) => this.collectDependentFields(nestedCondition))
        case 'NOT':
          return this.collectDependentFields(condition.condition)
      }
    } else {
      return [condition.field]
    }
  }

  private shouldRunOnInit(action: EffectAction) {
    return action.skipOnInit !== true
  }

  private async evaluateCondition(condition: EffectCondition, values: Record<string, unknown>): Promise<boolean> {
    if ('type' in condition) {
      switch (condition.type) {
        case 'AND': {
          const results = await Promise.all(condition.conditions.map(c => this.evaluateCondition(c, values)))
          const result = results.every(Boolean)
          return result
        }
        case 'OR': {
          const results = await Promise.all(condition.conditions.map(c => this.evaluateCondition(c, values)))
          const result = results.some(Boolean)
          return result
        }
        case 'NOT': {
          const result = !(await this.evaluateCondition(condition.condition, values))
          return result
        }
      }
    } else {
      const fieldValue = values[condition.field]
      const operatorFn = this.evaluatorRegistry.get(condition.operator)

      if (!operatorFn) {
        console.error(`Unsupported operator: ${condition.operator}`)
        return false
      }

      const result = await operatorFn(fieldValue, condition.value)
      return result
    }
  }

  private queueAction(action: EffectAction) {
    this.actionQueue.push(action)

    if (!this.flushing) {
      this.flushing = true
      queueMicrotask(() => {
        const queue = [...this.actionQueue]
        this.actionQueue = []
        this.flushing = false
        queue.forEach(this.executeAction.bind(this))
      })
    }
  }

  private async executeAction(action: EffectAction) {
    try {
      if (this.destroyed) return
      const factory = this.actionRegistry.get(action.type)
      if (!factory) {
        console.error(`Unknown action: ${JSON.stringify(action)}`)
        return
      }
      const command = factory(this.runtimeContext, action)
      await command.execute()
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error)
    }
  };
}

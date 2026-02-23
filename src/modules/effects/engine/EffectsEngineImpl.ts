import type { EffectActionRegistry } from "../actions/EffectActionRegistry"
import type { EffectEvaluatorRegistry } from "../evaluators/EffectEvaluatorRegistry"
import type { EffectAction, EffectCondition, EffectRule, EffectToolbox } from "../types"
import type { EffectsEngine } from "./EffectsEngine"

export class EffectsEngineImpl implements EffectsEngine {
  private readonly rules: EffectRule[]

  private readonly toolbox: EffectToolbox

  private readonly evaluatorRegistry: EffectEvaluatorRegistry

  private readonly actionRegistry: EffectActionRegistry

  private readonly dependencies: string[] = []

  private actionQueue: EffectAction[] = []

  private flushing = false

  private destroyed = false

  constructor(
    rules: EffectRule[],
    toolbox: EffectToolbox,
    evaluatorRegistry: EffectEvaluatorRegistry,
    actionRegistry: EffectActionRegistry
  ) {
    this.rules = rules
    this.toolbox = toolbox
    this.evaluatorRegistry = evaluatorRegistry
    this.actionRegistry = actionRegistry
    this.dependencies = this.getDependencies()
  }

  public async init(fieldValues: Record<string, unknown>) {
    for (const rule of this.rules) {
      const allConditionsMet = await this.evaluateCondition(rule.when, fieldValues)
      if (allConditionsMet) {
        rule.actions.filter(this.shouldRunOnInit).forEach(this.queueAction.bind(this))
      }
    }
  }

  public async execute(changedField: string, fieldValues: Record<string, unknown>) {
    if (!this.dependencies.includes(changedField)) return

    for (const rule of this.rules) {
      const isRelated = this.collectFields(rule.when).includes(changedField)
      if (!isRelated) continue

      const allConditionsMet = await this.evaluateCondition(rule.when, fieldValues)
      if (!allConditionsMet) continue

      rule.actions.forEach(this.queueAction.bind(this))
    }
  }

  public destroy() {
    this.destroyed = true
  }

  private getDependencies(): string[] {
    return Array.from(new Set(
      this.rules.flatMap(rule => this.collectFields(rule.when)),
    ))
  }

  private collectFields(condition: EffectCondition): string[] {
    if ('type' in condition) {
      switch (condition.type) {
        case 'AND':
        case 'OR':
          return condition.conditions.flatMap((nestedCondition) => this.collectFields(nestedCondition))
        case 'NOT':
          return this.collectFields(condition.condition)
      }
    } else {
      return [condition.field]
    }
  }

  private shouldRunOnInit(action: EffectAction) {
    return action.skipOnInit !== true
  }

  private async evaluateCondition(condition: EffectCondition, formValues: Record<string, unknown>): Promise<boolean> {
    if ('type' in condition) {
      switch (condition.type) {
        case 'AND': {
          const results = await Promise.all(condition.conditions.map(c => this.evaluateCondition(c, formValues)))
          const result = results.every(Boolean)
          return result
        }
        case 'OR': {
          const results = await Promise.all(condition.conditions.map(c => this.evaluateCondition(c, formValues)))
          const result = results.some(Boolean)
          return result
        }
        case 'NOT': {
          const result = !(await this.evaluateCondition(condition.condition, formValues))
          return result
        }
      }
    } else {
      const fieldValue = formValues[condition.field]
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
      const command = factory(this.toolbox, action)
      await command.execute()
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error)
    }
  };
}

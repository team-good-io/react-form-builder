import { EffectActionRegistry } from "../actions/EffectActionRegistry"
import type { EffectsEngine } from "../engine/EffectsEngine"
import { EffectsEngineImpl } from "../engine/EffectsEngineImpl"
import { EffectEvaluatorRegistry } from "../evaluators/EffectEvaluatorRegistry"
import type { EffectRule, EffectsConfig, EffectsRuntimeContext } from "../types"
import type { EffectsController } from "./EffectsController"

export class EffectsControllerImpl implements EffectsController {
  private readonly rules: EffectRule[]

  private readonly effectsEngine: EffectsEngine

  private readonly runtimeContext: EffectsRuntimeContext

  private runtimeSubscription?: { unsubscribe: () => void }

  private destroyed = false

  private initVersion = 0

  constructor(
    config: EffectsConfig,
    runtimeContext: EffectsRuntimeContext,
  ) {
    this.rules = config.rules
    this.runtimeContext = runtimeContext

    const actionRegistry = new EffectActionRegistry(config.actions, config.allowBuiltInOverride)
    const evaluatorRegistry = new EffectEvaluatorRegistry(config.evaluators, config.allowBuiltInOverride)

    this.effectsEngine = new EffectsEngineImpl(
      this.rules,
      this.runtimeContext,
      evaluatorRegistry,
      actionRegistry
    )
  }

  public async init() {
    const currentVersion = ++this.initVersion
    this.destroyed = false

    await this.effectsEngine.init(this.runtimeContext.form.getValues())

    if (this.destroyed || currentVersion !== this.initVersion) {
      return
    }

    if (this.runtimeSubscription) {
      this.runtimeSubscription.unsubscribe()
      this.runtimeSubscription = undefined
    }

    this.runtimeSubscription = this.runtimeContext.form.watch((values, { name }) => {
      if (!name || this.destroyed || currentVersion !== this.initVersion) {
        return
      }

      void this.effectsEngine.execute(name, values)
    })
  }

  public destroy() {
    this.destroyed = true
    this.initVersion += 1

    if (this.runtimeSubscription) {
      this.runtimeSubscription.unsubscribe()
      this.runtimeSubscription = undefined
    }

    this.effectsEngine.destroy()
  }
}

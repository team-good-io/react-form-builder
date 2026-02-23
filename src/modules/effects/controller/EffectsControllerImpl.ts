import { EffectActionRegistry } from "../actions/EffectActionRegistry"
import type { EffectsEngine } from "../engine/EffectsEngine"
import { EffectsEngineImpl } from "../engine/EffectsEngineImpl"
import { EffectEvaluatorRegistry } from "../evaluators/EffectEvaluatorRegistry"
import type { EffectRule, EffectsConfig, EffectToolbox } from "../types"
import type { EffectsController } from "./EffectsController"

export class EffectsControllerImpl implements EffectsController {
  private readonly rules: EffectRule[]

  private readonly effectsEngine: EffectsEngine

  private readonly toolbox: EffectToolbox

  private formObserver?: { unsubscribe: () => void }

  constructor(
    config: EffectsConfig,
    toolbox: EffectToolbox,
  ) {
    this.rules = config.rules
    this.toolbox = toolbox

    const actionRegistry = new EffectActionRegistry(config.actions, config.allowBuiltInOverride)
    const evaluatorRegistry = new EffectEvaluatorRegistry(config.evaluators, config.allowBuiltInOverride)

    this.effectsEngine = new EffectsEngineImpl(
      this.rules,
      this.toolbox,
      evaluatorRegistry,
      actionRegistry
    )
  }

  public async init() {
    await this.effectsEngine.init(this.toolbox.form.getValues())

    this.formObserver = this.toolbox.form.watch((values, { name }) => {
      if (name) void this.effectsEngine.execute(name, values)
    })
  }

  public destroy() {
    if (this.formObserver) {
      this.formObserver.unsubscribe()
      this.formObserver = undefined
    }

    this.effectsEngine.destroy()
  }
}

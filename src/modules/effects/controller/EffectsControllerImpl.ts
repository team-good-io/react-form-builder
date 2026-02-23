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

  private destroyed = false

  private initVersion = 0

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
    const currentVersion = ++this.initVersion
    this.destroyed = false

    await this.effectsEngine.init(this.toolbox.form.getValues())

    if (this.destroyed || currentVersion !== this.initVersion) {
      return
    }

    if (this.formObserver) {
      this.formObserver.unsubscribe()
      this.formObserver = undefined
    }

    this.formObserver = this.toolbox.form.watch((values, { name }) => {
      if (!name || this.destroyed || currentVersion !== this.initVersion) {
        return
      }

      void this.effectsEngine.execute(name, values)
    })
  }

  public destroy() {
    this.destroyed = true
    this.initVersion += 1

    if (this.formObserver) {
      this.formObserver.unsubscribe()
      this.formObserver = undefined
    }

    this.effectsEngine.destroy()
  }
}

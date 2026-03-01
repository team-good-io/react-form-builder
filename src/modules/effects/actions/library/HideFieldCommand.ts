import type { EffectAction, EffectCommand, EffectsRuntimeContext } from "../../types"

export class HideFieldCommand implements EffectCommand {
  public readonly runtimeContext: EffectsRuntimeContext
  public readonly action: EffectAction

  constructor(
    runtimeContext: EffectsRuntimeContext,
    action: EffectAction
  ) {
    this.runtimeContext = runtimeContext
    this.action = action
  }

  async execute() {
    if (this.action.targets.length === 0) {
      console.warn("HideField action has no targets specified.")
      return
    }

    this.action.targets.forEach((target) => {
      this.runtimeContext.state.merge(target, { fieldProps: { hidden: true } })

      if ("unregister" in this.action && this.action.unregister === true) {
        this.runtimeContext.form.unregister(target)
      }
    })
  }
}

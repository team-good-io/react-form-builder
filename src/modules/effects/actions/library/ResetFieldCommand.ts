import type { EffectAction, EffectCommand, EffectsRuntimeContext } from "../../types"

export class ResetFieldCommand implements EffectCommand {
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
      console.warn("ResetField action has no targets specified.")
      return
    }

    this.action.targets.forEach((target) => {
      this.runtimeContext.form.resetField(target)
    })
  }
}

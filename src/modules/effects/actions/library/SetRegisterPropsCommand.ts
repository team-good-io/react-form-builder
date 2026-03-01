import type { EffectAction, EffectCommand, EffectsRuntimeContext } from "../../types"

export class SetRegisterPropsCommand implements EffectCommand {
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
      console.warn("SetRegisterProps action has no targets specified.")
      return
    }

    this.action.targets.forEach((target) => {
      if ("value" in this.action) {
        this.runtimeContext.state.merge(target, { registerProps: this.action.value as Record<string, unknown> })
      } else {
        console.warn("SetRegisterProps action does not have a value property.")
      }
    })
  }
}

import type { EffectAction, EffectCommand, EffectToolbox } from "../../types"

export class SetRegisterPropsCommand implements EffectCommand {
  public readonly toolbox: EffectToolbox
  public readonly action: EffectAction

  constructor(
    toolbox: EffectToolbox,
    action: EffectAction
  ) {
    this.toolbox = toolbox
    this.action = action
  }

  async execute() {
    if (this.action.targets.length === 0) {
      console.warn("SetRegisterProps action has no targets specified.")
      return
    }

    this.action.targets.forEach((target) => {
      if ("value" in this.action) {
        this.toolbox.state.merge(target, { registerProps: this.action.value as Record<string, unknown> })
      } else {
        console.warn("SetRegisterProps action does not have a value property.")
      }
    })
  }
}

import type { EffectAction, EffectCommand, EffectToolbox } from "../../types"

export class ClearErrorsCommand implements EffectCommand {
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
      console.warn("ClearErrors action has no targets specified.")
      return
    }

    this.action.targets.forEach((target) => {
      this.toolbox.form.clearErrors(target)
    })
  }
}

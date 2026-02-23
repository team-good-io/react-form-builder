import type { EffectAction, EffectCommand, EffectToolbox } from "../../types"

export class HideFieldCommand implements EffectCommand {
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
      console.warn("HideField action has no targets specified.")
      return
    }

    this.action.targets.forEach((target) => {
      this.toolbox.state.merge(target, { fieldProps: { hidden: true } })

      if ("unregister" in this.action && this.action.unregister === true) {
        this.toolbox.form.unregister(target)
      }
    })
  }
}

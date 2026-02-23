import type { EffectAction, EffectCommand, EffectToolbox } from "../../types"

export class SetValueCommand implements EffectCommand {
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
      console.warn("SetValue action has no targets specified.")
      return
    }
    
    this.action.targets.forEach(target => {
      if(('value' in this.action)) {
        this.toolbox.form.setValue(target, this.action.value)
      } else {
        console.warn("SetValue action does not have a value property.")
      }
    })
  }
}

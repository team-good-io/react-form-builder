import type { EffectAction, EffectCommand, EffectsRuntimeContext } from "../../types"

export class SetValueCommand implements EffectCommand {
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
      console.warn("SetValue action has no targets specified.")
      return
    }
    
    this.action.targets.forEach(target => {
      if(('value' in this.action)) {
        this.runtimeContext.form.setValue(target, this.action.value)
      } else {
        console.warn("SetValue action does not have a value property.")
      }
    })
  }
}

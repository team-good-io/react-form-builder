import { Registry } from "../../../shared/Registry"
import type { EffectActionCommandFactory } from "../types"
import { ClearErrorsCommand } from "./library/ClearErrorsCommand"
import { HideFieldCommand } from "./library/HideFieldCommand"
import { ResetFieldCommand } from "./library/ResetFieldCommand"
import { SetFieldPropsCommand } from "./library/SetFieldPropsCommand"
import { SetRegisterPropsCommand } from "./library/SetRegisterPropsCommand"
import { SetValueCommand } from "./library/SetValueCommand"
import { ShowFieldCommand } from "./library/ShowFieldCommand"

export class EffectActionRegistry extends Registry<EffectActionCommandFactory> {
  constructor(customActions: Record<string, EffectActionCommandFactory> = {}, allowBuiltInOverride = false) {
      super()
      this.registerDefaults()
      this.registerCustomActions(customActions, allowBuiltInOverride)
    }
  
    private registerDefaults(): void {
      this.register("setValue", (toolbox, action) => new SetValueCommand(toolbox, action))
      this.register("resetField", (toolbox, action) => new ResetFieldCommand(toolbox, action))
      this.register("clearErrors", (toolbox, action) => new ClearErrorsCommand(toolbox, action))
      this.register("setFieldProps", (toolbox, action) => new SetFieldPropsCommand(toolbox, action))
      this.register("setRegisterProps", (toolbox, action) => new SetRegisterPropsCommand(toolbox, action))
      this.register("showField", (toolbox, action) => new ShowFieldCommand(toolbox, action))
      this.register("hideField", (toolbox, action) => new HideFieldCommand(toolbox, action))
      // this.register("deduplicateOptions", (toolbox, action) => new DeduplicateOptionsCommand(toolbox, action));
    }
  
    private registerCustomActions(custom: Record<string, EffectActionCommandFactory>, allowBuiltInOverride: boolean): void {
      for (const [name, fn] of Object.entries(custom)) {
        this.register(name, fn, allowBuiltInOverride)
      }
    }
}

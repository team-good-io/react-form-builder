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
      this.register("setValue", (runtimeContext, action) => new SetValueCommand(runtimeContext, action))
      this.register("resetField", (runtimeContext, action) => new ResetFieldCommand(runtimeContext, action))
      this.register("clearErrors", (runtimeContext, action) => new ClearErrorsCommand(runtimeContext, action))
      this.register("setFieldProps", (runtimeContext, action) => new SetFieldPropsCommand(runtimeContext, action))
      this.register("setRegisterProps", (runtimeContext, action) => new SetRegisterPropsCommand(runtimeContext, action))
      this.register("showField", (runtimeContext, action) => new ShowFieldCommand(runtimeContext, action))
      this.register("hideField", (runtimeContext, action) => new HideFieldCommand(runtimeContext, action))
      // this.register("deduplicateOptions", (runtimeContext, action) => new DeduplicateOptionsCommand(runtimeContext, action));
    }
  
    private registerCustomActions(custom: Record<string, EffectActionCommandFactory>, allowBuiltInOverride: boolean): void {
      for (const [name, fn] of Object.entries(custom)) {
        this.register(name, fn, allowBuiltInOverride)
      }
    }
}

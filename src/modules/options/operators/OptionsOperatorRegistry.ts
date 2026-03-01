
import { Registry } from "../../../shared/Registry"
import { OptionsCommandFactory } from "../types"
import { RemoteCommand } from "./library/remote-command"
import { RemoteDynamicCommand } from "./library/remote-dynamic-command"
import { StaticCommand } from "./library/static-command"


export class DefaultOptionsOperatorRegistry extends Registry<OptionsCommandFactory> {
  constructor(customOperators: Record<string, OptionsCommandFactory> = {}) {
    super()
    this.registerDefaults()
    this.registerCustomOperators(customOperators)
  }

  private registerDefaults(): void {
    this.register('static', (sourceName, _values, config, runtimeContext) => new StaticCommand(sourceName, config, runtimeContext))
    this.register('remote', (sourceName, _values, config, runtimeContext) => new RemoteCommand(sourceName, config, runtimeContext))
    this.register('remote-dynamic', (sourceName, values, config, runtimeContext) => new RemoteDynamicCommand(sourceName, values, config, runtimeContext))
  }

  private registerCustomOperators(custom: Record<string, OptionsCommandFactory>): void {
    for (const [name, operator] of Object.entries(custom)) {
      this.register(name, operator)
    }
  }
}

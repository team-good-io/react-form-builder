import { OptionsCommand, OptionsConfig, OptionsRuntimeContext,OptionsSourceType } from "../../types"

export class StaticCommand implements OptionsCommand {
  private readonly sourceName: string
  private readonly config: OptionsConfig
  private readonly runtimeContext: OptionsRuntimeContext

  constructor(
    sourceName: string,
    config: OptionsConfig,
    runtimeContext: OptionsRuntimeContext
  ) {
    this.sourceName = sourceName
    this.config = config
    this.runtimeContext = runtimeContext
  }

  execute() {
    const source = this.config[this.sourceName]
    if (source.type !== OptionsSourceType.STATIC) return

    this.runtimeContext.state.publish(this.sourceName, {
      loading: false,
      data: source.options,
    })
  }
}

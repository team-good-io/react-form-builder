import { OptionsCommand, OptionsConfig, OptionsRuntimeContext,OptionsSourceType } from "../../types"

export class RemoteCommand implements OptionsCommand {
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

  async execute() {
    const source = this.config[this.sourceName]
    if (source.type !== OptionsSourceType.REMOTE) return

    this.runtimeContext.state.publish(this.sourceName, { loading: true })
    try {
      const options = await this.runtimeContext.load.loader({
        sourceName: this.sourceName,
        source,
        values: this.runtimeContext.form.getValues(),
        path: source.path,
      })
      this.runtimeContext.state.publish(this.sourceName, { loading: false, data: options })
    } catch (error) {
      this.runtimeContext.state.publish(this.sourceName, { loading: false, error })
    }
  }
}

import { OptionsCommand, OptionsConfig, OptionsSourceType, OptionsToolbox } from "../../types"

export class RemoteCommand implements OptionsCommand {
  private readonly sourceName: string
  private readonly config: OptionsConfig
  private readonly toolbox: OptionsToolbox

  constructor(
    sourceName: string,
    config: OptionsConfig,
    toolbox: OptionsToolbox
  ) {
    this.sourceName = sourceName
    this.config = config
    this.toolbox = toolbox
  }

  async execute() {
    const source = this.config[this.sourceName]
    if (source.type !== OptionsSourceType.REMOTE) return

    this.toolbox.state.publish(this.sourceName, { loading: true })
    try {
      const options = await this.toolbox.load.loader({
        sourceName: this.sourceName,
        source,
        values: this.toolbox.form.getValues(),
        path: source.path,
      })
      this.toolbox.state.publish(this.sourceName, { loading: false, data: options })
    } catch (error) {
      this.toolbox.state.publish(this.sourceName, { loading: false, error })
    }
  }
}

import { interpolateUrl } from "../../../../utils"
import { OptionsCommand, OptionsConfig, OptionsSourceType, OptionsToolbox } from "../../types"

export class RemoteDynamicCommand implements OptionsCommand {
  private readonly sourceName: string
  private readonly values: Record<string, unknown> = {}
  private readonly config: OptionsConfig
  private readonly toolbox: OptionsToolbox

  constructor(
    sourceName: string,
    values: Record<string, unknown>,
    config: OptionsConfig,
    toolbox: OptionsToolbox
  ) {
    this.sourceName = sourceName
    this.values = values
    this.config = config
    this.toolbox = toolbox
  }

  async execute() {
    if (!this.values) return

    const source = this.config[this.sourceName]
    if (source.type !== OptionsSourceType.REMOTE_DYNAMIC) return

    const hasAllDeps = source.dependencies.every((dep) => {
      const value = this.values[dep]
      return value !== undefined && value !== null && value !== ''
    })

    if (!hasAllDeps) {
      this.toolbox.state.publish(this.sourceName, { loading: false, data: [] })
      return
    }

    const interpolatedPath = interpolateUrl(source.path, this.values)
    this.toolbox.state.publish(this.sourceName, { loading: true })

    try {
      const options = await this.toolbox.load.loader({
        sourceName: this.sourceName,
        source,
        values: this.values,
        path: interpolatedPath,
      })
      this.toolbox.state.publish(this.sourceName, { loading: false, data: options })
    } catch (error) {
      this.toolbox.state.publish(this.sourceName, { loading: false, error })
    }
  }
}

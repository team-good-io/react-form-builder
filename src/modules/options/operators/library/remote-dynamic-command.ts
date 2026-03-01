import { interpolateUrl } from "../../../../utils"
import { OptionsCommand, OptionsConfig, OptionsRuntimeContext,OptionsSourceType } from "../../types"

export class RemoteDynamicCommand implements OptionsCommand {
  private readonly sourceName: string
  private readonly values: Record<string, unknown> = {}
  private readonly config: OptionsConfig
  private readonly runtimeContext: OptionsRuntimeContext

  constructor(
    sourceName: string,
    values: Record<string, unknown>,
    config: OptionsConfig,
    runtimeContext: OptionsRuntimeContext
  ) {
    this.sourceName = sourceName
    this.values = values
    this.config = config
    this.runtimeContext = runtimeContext
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
      this.runtimeContext.state.publish(this.sourceName, { loading: false, data: [] })
      return
    }

    const interpolatedPath = interpolateUrl(source.path, this.values)
    this.runtimeContext.state.publish(this.sourceName, { loading: true })

    try {
      const options = await this.runtimeContext.load.loader({
        sourceName: this.sourceName,
        source,
        values: this.values,
        path: interpolatedPath,
      })
      this.runtimeContext.state.publish(this.sourceName, { loading: false, data: options })
    } catch (error) {
      this.runtimeContext.state.publish(this.sourceName, { loading: false, error })
    }
  }
}

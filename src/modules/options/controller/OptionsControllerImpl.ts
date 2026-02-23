import { OptionsEngine } from "../engine/OptionsEngine"
import { OptionsEngineImpl } from "../engine/OptionsEngineImpl"
import { DefaultOptionsOperatorRegistry } from "../operators/OptionsOperatorRegistry"
import { OptionsConfig, OptionsToolbox } from "../types"
import { OptionsController } from "./OptionsController"

export class OptionsControllerImpl implements OptionsController {
  private readonly config: OptionsConfig
  
  private readonly toolbox: OptionsToolbox

  private readonly engine: OptionsEngine

  private unobserve?: () => void

  constructor(config: OptionsConfig, toolbox: OptionsToolbox) {
    this.config = config
    this.toolbox = toolbox

    const operators = new DefaultOptionsOperatorRegistry()

    this.engine = new OptionsEngineImpl(
      this.config,
      this.toolbox,
      operators
    )
  }

  async init(): Promise<void> {
    this.engine.run()
    this.unobserve = this.engine.observe()
  }

  destroy(): void {
    if (this.unobserve) {
      this.unobserve()
    }
  }
}

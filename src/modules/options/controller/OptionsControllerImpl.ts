import { OptionsEngine } from "../engine/OptionsEngine"
import { OptionsEngineImpl } from "../engine/OptionsEngineImpl"
import { DefaultOptionsOperatorRegistry } from "../operators/OptionsOperatorRegistry"
import { OptionsConfig, OptionsRuntimeContext } from "../types"
import { OptionsController } from "./OptionsController"

export class OptionsControllerImpl implements OptionsController {
  private readonly config: OptionsConfig
  
  private readonly runtimeContext: OptionsRuntimeContext

  private readonly engine: OptionsEngine

  private runtimeSubscriptionCleanup?: () => void

  constructor(config: OptionsConfig, runtimeContext: OptionsRuntimeContext) {
    this.config = config
    this.runtimeContext = runtimeContext

    const operators = new DefaultOptionsOperatorRegistry()

    this.engine = new OptionsEngineImpl(
      this.config,
      this.runtimeContext,
      operators
    )
  }

  async init(): Promise<void> {
    this.engine.run()
    this.runtimeSubscriptionCleanup = this.engine.observe()
  }

  destroy(): void {
    if (this.runtimeSubscriptionCleanup) {
      this.runtimeSubscriptionCleanup()
    }
  }
}

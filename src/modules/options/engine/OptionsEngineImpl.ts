import { Registry } from "src/shared/Registry"

import { OptionsCommandFactory, OptionsConfig, OptionsRuntimeContext } from "../types"
import { OptionsEngine } from "./OptionsEngine"

export class OptionsEngineImpl implements OptionsEngine {
  private readonly config: OptionsConfig

  private readonly runtimeContext: OptionsRuntimeContext

  private readonly operators: Registry<OptionsCommandFactory>

  private dependentFields: string[] = []

  constructor(
    config: OptionsConfig,
    runtimeContext: OptionsRuntimeContext,
    operators: Registry<OptionsCommandFactory>,
  ) {
    this.config = config
    this.runtimeContext = runtimeContext
    this.operators = operators

    this.dependentFields = this.getDependentFields()
  }

  public run(): void {
    const values = this.runtimeContext.form.getValues()

    Object.keys(this.config).forEach(sourceName => {
      this.runCommandForSource(sourceName, values)
    })
  }

  public observe(): () => void {
    const { unsubscribe } = this.runtimeContext.form.watch((values, { name }) => {
      if (name && this.dependentFields.includes(name)) {
        this.onDependenciesChanged([name], values)
      }
    })

    return () => unsubscribe()
  }

  private onDependenciesChanged(changedFields: string[], values: Record<string, unknown>) {
    Object.entries(this.config).forEach(([sourceName, sourceConfig]) => {
      if (!sourceConfig.dependencies?.length) return

      const isImpacted = sourceConfig.dependencies.some((dep) => changedFields.includes(dep))
      if (!isImpacted) return

      this.runCommandForSource(sourceName, values)
    })
  }

  private runCommandForSource(sourceName: string, values: Record<string, unknown>) {
    const sourceConfig = this.config[sourceName]

    try {
      const factory = this.operators.get(sourceConfig.type)
      if (!factory) {
        console.warn(`No operator found for type: ${sourceConfig.type}`)
        return
      }

      const command = factory(sourceName, values, this.config, this.runtimeContext)
      const execution = command.execute()
      if (execution instanceof Promise) {
        void execution.catch((error) => {
          console.error(`Error executing operator for source "${sourceName}":`, error)
        })
      }
    } catch (error) {
      console.error(`Error executing operator for source "${sourceName}":`, error)
    }
  }

  private getDependentFields(): string[] {
    return Array.from(new Set(
      Object.values(this.config)
        .filter((source) => source.dependencies && source.dependencies.length > 0)
        .flatMap((source) => source.dependencies)
        .filter((dep): dep is string => typeof dep === "string"),
    ))
  }
}

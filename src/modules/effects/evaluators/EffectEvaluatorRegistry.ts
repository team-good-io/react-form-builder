import { Registry } from "../../../shared/Registry"
import type { EffectEvaluator } from "../types"

export class EffectEvaluatorRegistry extends Registry<EffectEvaluator> {
  constructor(customEvaluators: Record<string, EffectEvaluator> = {}, allowBuiltInOverride = false) {
    super()
    this.registerDefaults()
    this.registerCustomEvaluators(customEvaluators, allowBuiltInOverride)
  }

  private registerDefaults() {
    this.register("===", (a = "", b) => a === b)
    this.register("!==", (a = "", b) => a !== b)
    this.register(">", (a, b) => typeof a === "number" && a > (b as number))
    this.register("<", (a, b) => typeof a === "number" && a < (b as number))
    this.register("in", (a, b) => Array.isArray(b) && b.includes(a))
    this.register("length>", (a, b) => this.getLength(a) !== null && this.getLength(a)! > (b as number))
    this.register("length<", (a, b) => this.getLength(a) !== null && this.getLength(a)! < (b as number))
    this.register("length===", (a, b) => this.getLength(a) !== null && this.getLength(a)! === (b as number))
  }

  private registerCustomEvaluators(customEvaluators: Record<string, EffectEvaluator>, allowBuiltInOverride: boolean): void {
    for (const [name, fn] of Object.entries(customEvaluators)) {
      this.register(name, fn, allowBuiltInOverride)
    }
  }

  private getLength(value: unknown): number | null {
    if (typeof value === "string" || Array.isArray(value)) return value.length
    return null
  }
}

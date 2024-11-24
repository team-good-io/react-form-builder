import { FieldValues } from "react-hook-form"
import { Effect, EffectConfig, SourceField, TargetField } from "./types"

const buildEffects = (config: EffectConfig, sourceName: string, values: FieldValues) => {
  const effects: Array<{ source: SourceField, target: TargetField, effect: Effect }> = []
  const source = { name: sourceName, value: values[sourceName] }

  const sourceConfig = config[source.name]
  if (!sourceConfig) return []

  const applyEffects = (targetConfig: { [targetField: string]: Effect; }) => {
    Object.entries(targetConfig).map(([targetName, effect]) => {
      const target = { name: targetName, value: values[targetName] }
      effects.push({ source, target, effect })
    })
  }

  if (source.value && sourceConfig['HAS_VALUE']) {
    applyEffects(sourceConfig['HAS_VALUE'])
  }

  if (!source.value && sourceConfig['NO_VALUE']) {
    applyEffects(sourceConfig['NO_VALUE'])
  }

  if (source.value && sourceConfig[source.value]) {
    applyEffects(sourceConfig[source.value])
  }

  return effects
}

export default buildEffects
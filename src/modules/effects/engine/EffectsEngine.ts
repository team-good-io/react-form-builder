export interface EffectsEngine {
  init: (fieldValues: Record<string, unknown>) => Promise<void>;
  execute: (changedField: string, fieldValues: Record<string, unknown>) => Promise<void>;
  destroy: () => void;
}

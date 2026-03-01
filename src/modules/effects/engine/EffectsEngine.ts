export interface EffectsEngine {
  init: (values: Record<string, unknown>) => Promise<void>;
  execute: (changedFieldName: string, values: Record<string, unknown>) => Promise<void>;
  destroy: () => void;
}

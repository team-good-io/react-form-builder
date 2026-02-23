export interface EffectsController {
  init(): Promise<void>;
  destroy(): void;
}

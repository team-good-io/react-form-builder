export interface OptionsController {
  init(): Promise<void>;
  destroy(): void;
}

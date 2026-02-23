export interface OptionsEngine {
  run: () => void;
  observe: () => () => void
}

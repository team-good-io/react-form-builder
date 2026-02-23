import { PubSubState } from '../../shared/pubsub/PubSubState'

export type OptionsCommandFactory = (
  sourceName: string,
  values: Record<string, unknown>,
  config: OptionsConfig,
  toolbox: OptionsToolbox
) => OptionsCommand

export interface OptionsCommand {
  execute(): void | Promise<void>
}

export interface Option<T = unknown> {
  label: string
  value: string
  ref?: T // Optional reference to original data
}

export enum OptionsSourceType {
  STATIC = 'static',
  REMOTE = 'remote',
  REMOTE_DYNAMIC = 'remote-dynamic',
}

interface OptionsSourceBase {
  type: OptionsSourceType
  dependencies?: string[]
}

export interface OptionsSourceRemoteBase extends OptionsSourceBase {
  path: string
  labelKey?: string
  valueKey?: string
  transformResponseFnName?: string // Optional named transform
}

export interface OptionsSourceStatic extends OptionsSourceBase {
  type: OptionsSourceType.STATIC
  options: Option[]
}

export interface OptionsSourceRemote extends OptionsSourceRemoteBase {
  type: OptionsSourceType.REMOTE
}

export interface OptionsSourceRemoteDynamic extends OptionsSourceRemoteBase {
  type: OptionsSourceType.REMOTE_DYNAMIC
  dependencies: string[]
}

export type OptionsSource = OptionsSourceStatic | OptionsSourceRemote | OptionsSourceRemoteDynamic

export type OptionsConfig = Record<string, OptionsSource>

export interface OptionsState {
  loading: boolean
  data?: Option[]
  error?: unknown
}

export type OptionsLoadRequest = {
  sourceName: string
  source: OptionsSourceRemote | OptionsSourceRemoteDynamic
  values: Record<string, unknown>
  path: string
}

export type OptionsLoader = (request: OptionsLoadRequest) => Promise<Option[]>

export type OptionsLoadOptions = {
  loader: OptionsLoader
}

export interface OptionsToolbox {
  form: OptionsToolboxForm,
  state: PubSubState<OptionsState>
  load: OptionsLoadOptions
}

export interface OptionsToolboxForm {
  getValues(): Record<string, unknown>
  watch(callback: (values: Record<string, unknown>, info: { name?: string }) => void): { unsubscribe: () => void }
}

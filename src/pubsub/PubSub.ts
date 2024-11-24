type Callback<T> = (data: T) => void

export default class PubSub<T> {
  private subscribers = new Map<string, Callback<T>[]>()
  private cache = new Map<string, T>()

  constructor() {}

  subscribe = (event: string, callback: Callback<T>) => {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, [])
    }

    this.subscribers.get(event)?.push(callback)

    if (this.cache.has(event)) {
      callback(this.cache.get(event)!)
    }

    return {
      unsubscribe: () => {
        const callbacks = this.subscribers.get(event)
        if (callbacks) {
          this.subscribers.set(
            event,
            callbacks.filter(cb => cb !== callback)
          )
        }
      }
    }
  }

  publish = (event: string, data: T) => {
    this.subscribers.get(event)?.forEach(callback => callback(data))

    this.cache.set(event, data)
  }

  getSnapshot = () => {
    return this.cache
  }
}

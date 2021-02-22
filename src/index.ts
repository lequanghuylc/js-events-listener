
export interface ICallback<T> {
  (data : T): void,
}

export type TEventItem<T> = {
  name: string,
  callback: ICallback<T>,
} 

type InnerListerners = {
  count: number,
  refs: {
    [key: string]: TEventItem<any>,
  }
}

class GlobalEventClass {

  _listeners : InnerListerners = {
    count: 0,
    refs: {},
  }

  addEventListener <T>(eventName: string, callback: ICallback<T>) : string | boolean {
    if (
        typeof (eventName) === 'string' &&
        typeof (callback) === 'function'
    ) {
      this._listeners.count++
      const eventId = 'l' + this._listeners.count
      this._listeners.refs[eventId] = {
        name: eventName,
        callback,
      }
      return eventId
    }
    return false
  }

  removeEventListener(id : string) : undefined | boolean {
    if (typeof (id) === 'string') {
      return delete this._listeners.refs[id]
    }
    return false
  }

  removeAllListeners() : boolean {
    let removeError = false
    Object.keys(this._listeners.refs).forEach(_id => {
      const removed = delete this._listeners.refs[_id]
      removeError = (!removeError) ? !removed : removeError
    })
    return !removeError
  }

  emitEvent <T>(eventName: string, data: T) : void {
    Object.keys(this._listeners.refs).forEach(_id => {
      if (
        this._listeners.refs[_id] &&
        eventName === this._listeners.refs[_id].name
      )
        this._listeners.refs[_id].callback(data)
    })
  }

  on = this.addEventListener
  rm = this.removeEventListener
  rmAll = this.removeAllListeners
  emit = this.emitEvent
}

export const GlobalEvent = new GlobalEventClass();
export default GlobalEvent;
module.exports = GlobalEvent;
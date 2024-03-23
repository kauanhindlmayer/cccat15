import DomainEvent from "../event/DomainEvent";

// Observable
export default class AggregateRoot {
  private _listeners: { name: string; callback: Function }[] = [];

  register(name: string, callback: Function) {
    this._listeners.push({ name, callback });
  }

  notify(event: DomainEvent) {
    for (const listener of this._listeners) {
      if (listener.name === event.name) {
        listener.callback(event);
      }
    }
  }

  clearEvents() {
    this._listeners = [];
  }
}

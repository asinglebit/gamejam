export class EventController {

  /*
    events: {
      [event_type_1]: {
        [caller_id_1]: callback_1,
        [caller_id_2]: callback_2
      },
      [event_type_2]: {
        [caller_id_1]: callback_3,
        [caller_id_2]: callback_4
      },
      ...
    }
  */
  private events: Record<string, Record<string, Function>> = {}
  
  constructor() {}

  emit(type: string, payload?: any) {
    if (!this.events[type]) return
    Object.keys(this.events[type]).forEach((id) => {
      this.events[type][id](payload)
    })
  }

  subscribe(type: string, id: string, callback: Function) {
    this.events[type] = this.events[type] || {}
    this.events[type][id] = callback
  }

  unsubscribe(id: string) {
    this.events = Object.keys(this.events).reduce((accumulator_event_types, current_event_type) => {
      const callbacks = Object.keys(this.events[current_event_type]).reduce((accumulator_ids, current_id) => {
        return {
          ...accumulator_ids,
          ...(current_id !== id ? { [current_id]: this.events[current_event_type][current_id] } : {}),
        }
      }, {})
      return {
        ...accumulator_event_types,
        ...(Object.keys(callbacks).length !== 0 ? { [current_event_type]: callbacks } : {}),
      }
    }, {})
  }
}

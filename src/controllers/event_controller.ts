export type EventType = {
  type: string
  payload?: any
}

export type EventController = {
  emit: (type: string, payload?: any) => void
  subscribe: (type: string, id: string, callback: Function) => void
  unsubscribe: (id: string) => void
}

export const createEventController = (): EventController => {
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
  let events: Record<string, Record<string, Function>> = {}

  const emit = (type: string, payload: any) => {
    if (!events[type]) return
    Object.keys(events[type]).forEach((id) => {
      events[type][id](payload)
    })
  }

  const subscribe = (type: string, id: string, callback: Function) => {
    events[type] = events[type] || {}
    events[type][id] = callback
  }

  const unsubscribe = (id: string) => {
    events = Object.keys(events).reduce((accumulator_event_types, current_event_type) => {
      const callbacks = Object.keys(events[current_event_type]).reduce((accumulator_ids, current_id) => {
        return {
          ...accumulator_ids,
          ...(current_id !== id ? { [current_id]: events[current_event_type][current_id] } : {}),
        }
      }, {})
      return {
        ...accumulator_event_types,
        ...(Object.keys(callbacks).length !== 0 ? { [current_event_type]: callbacks } : {}),
      }
    }, {})
  }

  return {
    emit,
    subscribe,
    unsubscribe,
  }
}

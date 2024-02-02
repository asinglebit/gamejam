
type Event = {
  duration: number
  ticker?: {
    delta: () => number
    reset: VoidFunction
  }
  callback: (delta?: number) => void
}

type Sequences = {
  type: "once" | "repeat"
  from: number
  current: number
  paused: boolean
  events: Event[]
}

type SequenceName = string

export class Sequencer {

  private map: Record<SequenceName, Sequences> = {}

  constructor() {}

  once(name: SequenceName, event: Event, paused: boolean = false) {
    this.onceSequence(name, [event], paused)
  }

  repeat(name: SequenceName, event: Event, paused: boolean = false) {
    this.repeatSequence(name, [event], paused)
  }
  
  onceSequence(name: SequenceName, events: Event[], paused: boolean = false) {
    this.map[name] = {
      type: 'once',
      current: 0,
      from: 0,
      paused,
      events
    }
  }

  repeatSequence(name: SequenceName, events: Event[], paused: boolean = false) {
    this.map[name] = {
      type: 'repeat',
      current: 0,
      from: 0,
      paused,
      events
    }
  }

  stop(name: SequenceName) {
    delete this.map[name]
  }

  pause(name: SequenceName) {
    this.map[name].paused = true
  }

  unpause(name: SequenceName) {
    this.map[name].paused = false
  }

  isPaused(name: SequenceName) {
    return this.map[name].paused
  }

  reset(name: SequenceName) {
    this.map[name].from = 0
    this.map[name].current = 0
  }

  tick(delta: number) {
    Object.entries(this.map).forEach(([ name, sequence ]) => {

      // This sequence
      if (sequence.paused) return
      const prev = sequence.current
      let priorDurations = 0
      for (let i = 0; i < sequence.events.length; ++i) {
        const isLast = i === sequence.events.length - 1
        const event = sequence.events[i]
        const timestamp = sequence.from + priorDurations + event.duration
        const contextualDelta = (event.ticker ? event.ticker.delta() : delta)
        let next = prev + contextualDelta
        if (prev > timestamp) {
          priorDurations += event.duration
          continue
        } else if (prev <= timestamp && next >= timestamp) {
          sequence.current = next
          event.callback(contextualDelta)
          if (isLast) {
            switch (sequence.type) {
              case 'once':
                this.stop(name)
                break
              case 'repeat':
                sequence.from = 0
                sequence.current = 0
                break
            }
          }
          break
        } else if (prev < timestamp) {
          sequence.current = next
          break
        }
      }
    })

    Object.entries(this.map).forEach(([ name, options ]) => {
      options.events.forEach(event => {
        event.ticker?.reset()
      })
    })
  }
}

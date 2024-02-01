export class Timer {

    private current: number = 0
    private checkpoints: any[]
  
    constructor(checkpoints: any[]) {
      this.checkpoints = checkpoints
    }
  
    tick(delta: number) {
      const prev = this.current
      this.current += delta
      for (let i = 0; i < this.checkpoints.length; ++i) {
        const isLast = i === this.checkpoints.length - 1
        const { checkpoint, callback } = this.checkpoints[i]
        if (prev < checkpoint && this.current > checkpoint) {
          callback()
          if (isLast) this.current = 0
          break
        }
      }
    }
}
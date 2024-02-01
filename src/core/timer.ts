export class Timer {

    private current: number = 0
    

    private map: Record<string, any> = {}
  
    constructor() {
    }

    
    once(timerName: string, timeout: number, callback: VoidFunction) {
      this.map[timerName] = {
        timeout,
        callback,
        type: 'once',
        addTime: this.current
      }
    }

    repeat(timerName: string, timeout: number, callback: VoidFunction) {
      this.map[timerName] = {
        timeout,
        callback,
        type: 'repeat',
        addTime: this.current
      }
    }

    stop(timerName: string) {
      delete this.map[timerName]
    }

    tick(delta: number) {
      this.current += delta

      Object.entries(this.map).forEach(([timerName, timerData]) => {
        if (this.current >= timerData.addTime + timerData.timeout) {
          timerData.callback()

          if (timerData.type === 'once') {
            this.stop(timerName)
          }

          if (timerData.type === 'repeat') {
            this.map[timerName].addTime = this.current
          }
        }
      })

      

      // for (let i = 0; i < this.checkpoints.length; ++i) {
      //   const isLast = i === this.checkpoints.length - 1
      //   const { checkpoint, callback } = this.checkpoints[i]
      //   if (prev < checkpoint && this.current > checkpoint) {
      //     callback()
      //     if (isLast) this.current = 0
      //     break
      //   }
      // }
    }
}
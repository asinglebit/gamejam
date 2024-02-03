export class SecondTimer {

    private timestamp: number
    private delta = 0
    private ticker = {
      delta: () => {

        // First call since last lock
        if (this.delta === 0) {
            const now = Date.now()
            this.delta = (now - this.timestamp) / 1000
            this.timestamp = now
        }
        
        return this.delta
      },
      reset: () => {
        this.delta = 0
      }
    }
  
    constructor() {
        this.timestamp = Date.now()
    }
  
    getTicker() {
      return this.ticker
    }
}

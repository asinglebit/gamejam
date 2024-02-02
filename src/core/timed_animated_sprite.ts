import * as PIXI from "pixi.js"

export class TimedAnimatedSprite extends PIXI.AnimatedSprite {

    private animations: Record<string, PIXI.Texture[]>
    private delta = 0
    private ticker = {
      delta: () => {
        return this.delta
      },
      reset: () => {
        this.delta = 0
      }
    }
  
    constructor(animations: Record<string, PIXI.Texture[]>, initial: string, autoUpdate = true) {
        const initialAnimation = animations[initial]
        super(initialAnimation, autoUpdate)
        this.animations = animations
    }
  
    onFrameChange = (currentFrame: number) => {
      this.delta++
    }
  
    getTicker() {
      return this.ticker
    }

    switch(animation: string) {
        this.textures = this.animations[animation]
    }
}

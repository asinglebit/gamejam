import * as PIXI from "pixi.js"
import { GameObject } from "../controllers/game_object_controller"
import { createSpriteProjectile } from "../utils/sprites"

export const createProjectile = (container: PIXI.Container, X: number, Y: number, speed = 5): GameObject => {
  // Construction

  const sprite = createSpriteProjectile()
  sprite.x = X
  sprite.y = Y
  container.addChild(sprite)

  // Members

  let shouldBeUnmounted = false

  // Methods

  const move = (x: number, dt: number) => {
    return x + speed * dt
  }

  // Api

  const update = (dt: number) => {
    sprite.x = move(sprite.x, dt)

    // Determine hit or miss conditions
    if (sprite.x > 1280) {
      shouldBeUnmounted = true
    }
  }

  const unmount = () => {
    // stop timers
    // destroy sprite
    sprite.destroy()
  }

  const pause = () => {
    sprite.stop()
  }

  const play = () => {
    sprite.play()
  }

  // Game object

  return {
    pause,
    play,
    shouldBeUnmounted: () => shouldBeUnmounted,
    update,
    unmount,
  }
}

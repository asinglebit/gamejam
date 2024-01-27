import { createSpriteProjectile } from "../sprites"

export const createProjectile = (container, X, Y, speed = 5) => {

  // Construction

  const sprite = createSpriteProjectile()
  sprite.x = X
  sprite.y = Y
  container.addChild(sprite)

  // Members
  
  let shouldBeUnmounted = false

  // Methods

  const move = (x, delta) => {
    return x + speed * delta
  }

  // Api

  const update = (delta) => {
    sprite.x = move(sprite.x, delta)

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

  // Game object

  return {
    shouldBeUnmounted: () => shouldBeUnmounted,
    update,
    unmount
  }
}
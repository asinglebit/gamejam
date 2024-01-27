import { createSpriteTile } from "../sprites"

export const createTile = (container, X, Y) => {

  // Construction

  const sprite = createSpriteTile()
  sprite.x = X
  sprite.y = Y
  container.addChild(sprite)

  // Api

  const update = (delta) => {}

  const unmount = () => {
    sprite.destroy()
  }

  // Game object

  return {
    shouldBeUnmounted: () => false,
    update,
    unmount
  }
}
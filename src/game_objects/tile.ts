import * as PIXI from "pixi.js"
import { GameObject } from "../controllers/game_object_controller"
import { createSpriteTile } from "../utils/sprites"

export const createTile = (container: PIXI.Container, { x, y }: Coordinates): GameObject => {
  // Construction

  const sprite = createSpriteTile()
  sprite.x = x
  sprite.y = y
  container.addChild(sprite)

  // Api

  const update = (dt: number) => {}

  const unmount = () => {
    sprite.destroy()
  }

  // Game object

  return {
    shouldBeUnmounted: () => false,
    update,
    unmount,
  }
}

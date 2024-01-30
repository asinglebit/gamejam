import * as PIXI from "pixi.js"
import { GameObject } from "../controllers/game_object_controller"
import { createSpriteTile } from "../utils/sprites"

export const createTile = (container: PIXI.Container, { x, y }: Coordinates): GameObject => {
  // Construction

  const sprite = createSpriteTile()
  sprite.x = x
  sprite.y = y
  sprite.interactive = true
  // sprite.on('mouseover', () => {
  //   if (isPlacing && !isOccupied) {
  //     uiTemporary.x = sprite.x + 80
  //     uiTemporary.y = sprite.y + 60
  //     uiTemporary.visible = true
  //   }
  // })
  // sprite.on('pointerdown', () => {
  //   if (isPlacing && !isOccupied) {
  //     isPlacing = false
  //     uiTemporary.visible = false
  //     GameObjectController.add(createUnitRanged(EventController, container, uiTemporary.x, uiTemporary.y))
  //     isOccupied = true
  //   }
  // })
  container.addChild(sprite)

  // State 
  let isPlacing = false
  let isOccupied = false

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

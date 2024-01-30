import * as PIXI from "pixi.js"
import { GameObject } from "../controllers/game_object_controller"
import { createSpriteRanged } from "../utils/sprites"
import { createGameObjectController } from "../controllers/game_object_controller"
import { EventController } from "../controllers/event_controller"
import * as Events from "../constants/events"
import { createProjectile } from "./"

export const createUnitRanged = (EventController: EventController, container: PIXI.Container, x: number, y: number): GameObject => {
  // Construction

  const sprite = createSpriteRanged()
  sprite.x = x
  sprite.y = y
  container.addChild(sprite)
  // Game object controller
  const GameObjectController = createGameObjectController()
  // State
  let projectileTimer = 40

  // Members

  let shouldBeUnmounted = false

  // Methods

  // Api

  const update = (delta: number) => {
    projectileTimer += delta
    if (projectileTimer >= 80) {
      projectileTimer = 0
      GameObjectController.add(createProjectile(container, sprite.x, sprite.y))
    }
    GameObjectController.update(delta)
  }

  const unmount = () => {
    GameObjectController.unmount()
    sprite.destroy()
    EventController.unsubscribe("unit")
  }

  const pause = () => {
    sprite.stop()
    GameObjectController.pause()
  }

  const play = () => {
    sprite.play()
    GameObjectController.play()
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

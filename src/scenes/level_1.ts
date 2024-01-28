import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { createProjectile, createTile } from "../game_objects"
import { CELL_SIZE } from "../constants/constants"
import { SCENE_NAMES } from "../constants/scenes"
import * as Events from "../constants/events"
import { Scene } from "../controllers/scene_controller"
import { EventController } from "../controllers/event_controller"

export const createSceneLevel1 = (app: PIXI.Application, EventController: EventController): Scene => {
  /**
   * Construction
   */

  const sceneName = SCENE_NAMES.LEVEL_1
  
  // Game object controller
  const GameObjectController = createGameObjectController()
  let container: PIXI.Container = null

  /**
   * Methods
   */

  const mount = () => {
    // Stage
    container = new PIXI.Container()
    app.stage.addChild(container)
    const factor = app.screen.width / 1280
    container.scale.x = factor
    container.scale.y = factor
    container.y = app.screen.height / 2 - (640 * factor) / 2

    // Background tiles
    for (let row_index = 0; row_index < 5; ++row_index) {
      for (let column_index = 0; column_index < 10; ++column_index) {
        GameObjectController.add(createTile(container, { x: column_index * CELL_SIZE, y: row_index * CELL_SIZE }))
      }
    }

    // Projectile for testing
    GameObjectController.add(createProjectile(container, Math.random() * 128, Math.floor(Math.random() * 128 * 5)))

    // Events
    EventController.subscribe(Events.ENTER_PAUSE_MENU, sceneName, () => {
      GameObjectController.pause()
    })

    EventController.subscribe(Events.LEAVE_PAUSE_MENU, sceneName, () => {
      GameObjectController.play()
    })

    EventController.subscribe(Events.RESIZE, SCENE_NAMES.MENU, () => {
      const factor = app.screen.width / 1280
      container.scale.x = factor
      container.scale.y = factor
      container.y = app.screen.height / 2 - (640 * factor) / 2
    })
  }

  const update = (dt: number) => {
    GameObjectController.update(dt)
  }

  const unmount = () => {
    GameObjectController.unmount()
    if (container) container.destroy()
    EventController.unsubscribe(sceneName)
  }

  /**
   * Api
   */

  return {
    name: sceneName,
    mount,
    update,
    unmount,
  }
}

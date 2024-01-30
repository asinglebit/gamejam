import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { Text } from "../game_objects"
import * as Events from "../constants/events"
import { SCENE_NAMES } from "../constants/scenes"
import { EventController } from "../controllers/event_controller"
import { Scene } from "../controllers/scene_controller"

export const createSceneMenu = (app: PIXI.Application, EventController: EventController): Scene => {
  /**
   * Construction
   */
  const sceneName = SCENE_NAMES.MENU

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

    // Title
    GameObjectController.add(
      new Text({
        text: "Game by A&A",
        color: 0xffffff,
      }, {
        x: 0,
        y: 0,
      }, container)
    )

    // Levels
    GameObjectController.add(
      new Text({
        text:  "Level 1",
        color: 0x888888,
      },{
        x: 0,
        y: 100,
      },
      container,
      EventController,
      {
        type: Events.CHANGE_SCENES,
        payload: SCENE_NAMES.LEVEL_1,
      }
      )
    )

    // Center container
    container.x = app.screen.width / 2
    container.y = app.screen.height / 2 - container.getLocalBounds().height / 2

    // Subscribe to events
    EventController.subscribe(Events.RESIZE, sceneName, () => {
      container.x = app.screen.width / 2
      container.y = app.screen.height / 2 - container.getLocalBounds().height / 2
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

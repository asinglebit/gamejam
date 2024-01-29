import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { createText } from "../game_objects"
import * as Events from "../constants/events"
import { SCENE_NAMES } from "../constants/scenes"
import { EventController } from "../controllers/event_controller"
import { Scene } from "../controllers/scene_controller"

export const createScenePause = (app: PIXI.Application, EventController: EventController): Scene => {
  /**
   * Construction
   */
  const sceneName = SCENE_NAMES.PAUSE

  // Game object controller
  const GameObjectController = createGameObjectController()
  let container: PIXI.Container = null
  let container_menu: PIXI.Container = null

  /**
   * Methods
   */

  const mount = () => {
    // Stage
    container = new PIXI.Container()
    app.stage.addChild(container)

    // Pause button
    const pause_button = createText({
      container,
      color: 0xffffff,
      placement: {
        x: app.screen.width - 50,
        y: 50,
      },
      title: "||",
      EventController,
      eventClick: {
        type: Events.ENTER_PAUSE_MENU,
      },
    })

    // Pause menu container
    container_menu = new PIXI.Container()
    container_menu.x = app.screen.width / 2
    container_menu.y = app.screen.height / 2
    container.addChild(container_menu)

    // Pause menu
    const play_button = createText({
      hidden: true,
      color: 0x000000,
      container: container_menu,
      placement: {
        x: 0,
        y: -30,
      },
      title: "Resume",
      EventController,
      eventClick: {
        type: Events.LEAVE_PAUSE_MENU,
      },
    })
    const restart_button = createText({
      hidden: true,
      color: 0x000000,
      container: container_menu,
      placement: {
        x: 0,
        y: 0,
      },
      title: "Restart Level",
      EventController,
      eventClick: {
        type: Events.RELOAD_SCENES,
      },
    })
    const menu_button = createText({
      hidden: true,
      color: 0x000000,
      container: container_menu,
      placement: {
        x: 0,
        y: 30,
      },
      title: "Return to Menu",
      EventController,
      eventClick: {
        type: Events.CHANGE_SCENES,
        payload: SCENE_NAMES.MENU,
      },
    })

    // Register game objects
    GameObjectController.add(pause_button)
    GameObjectController.add(play_button)
    GameObjectController.add(restart_button)
    GameObjectController.add(menu_button)

    // Events
    EventController.subscribe(Events.ENTER_PAUSE_MENU, sceneName, () => {
      pause_button.hide()
      play_button.show()
      restart_button.show()
      menu_button.show()
    })

    EventController.subscribe(Events.LEAVE_PAUSE_MENU, sceneName, () => {
      pause_button.show()
      play_button.hide()
      restart_button.hide()
      menu_button.hide()
    })

    EventController.subscribe(Events.RESIZE, sceneName, () => {
      pause_button.place({x: app.screen.width - 50, y: 50})
      container_menu.x = app.screen.width / 2
      container_menu.y = app.screen.height / 2
    })
  }

  const update = (dt: number) => {
    GameObjectController.update(dt)
  }

  const unmount = () => {
    GameObjectController.unmount()
    if (container_menu) container_menu.destroy()
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

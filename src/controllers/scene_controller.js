import { createSceneMenu, createScenePause, createSceneLevel1, createSceneLevel2 } from "../scenes"
import { createEventController } from "./event_controller"
import * as Events from "../constants/events"
import * as Scenes from "../constants/scenes"

export const createSceneController = (app) => {

  /**
   * Construction
   */

  const EventController = createEventController()
  let scenes = {
    [Scenes.MENU]: createSceneMenu(app, EventController),
    [Scenes.PAUSE]: createScenePause(app, EventController),
    [Scenes.LEVEL_1]: createSceneLevel1(app, EventController),
    [Scenes.LEVEL_2]: createSceneLevel2(app, EventController)
  }
  let loaded = []
  let paused = false

  /**
   * Methods
   */

  // Update level
  const update = (delta) => {
    loaded.forEach(level => {
      switch (level.name) {
        case Scenes.MENU:
        case Scenes.PAUSE:
          level.update(delta)
          break
        default:
          if (!paused) level.update(delta)
          break
      }
    })
  }

  // Select level
  const load = (...sceneNames) => {
    loaded.forEach(scene => scene.unmount())
    loaded = sceneNames.map(sceneName => {
      scenes[sceneName].mount()
      return scenes[sceneName]
    })
  }

  /**
   * Events
   */

  EventController.subscribe(Events.CHANGE_SCENES, "scenecontroller", (scene) => {
    switch (scene) {
      case Scenes.MENU : {
        load(Scenes.MENU)
        break
      }
      case Scenes.LEVEL_1: {
        load(Scenes.LEVEL_1, Scenes.PAUSE)
        break
      }
      case Scenes.LEVEL_2: {
        load(Scenes.LEVEL_2, Scenes.PAUSE)
        break
      }
    }
    paused = false
  })
  
  EventController.subscribe(Events.ENTER_PAUSE_MENU, "scenecontroller", () => {
    paused = true
  })

  EventController.subscribe(Events.LEAVE_PAUSE_MENU, "scenecontroller", () => {
    paused = false
  })

  EventController.subscribe(Events.RELOAD_SCENES, "scenecontroller", () => {
    loaded.forEach((scene) => {
      scene.unmount()
      scene.mount()
      paused = false
    })
  })

  /**
   * Api
   */

  return {
    load,
    update
  }
}
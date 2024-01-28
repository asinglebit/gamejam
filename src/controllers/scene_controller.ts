import * as PIXI from "pixi.js"
import { createSceneMenu, createScenePause, createSceneLevel1, createSceneLevel2 } from "../scenes"
import { createEventController } from "./event_controller"
import * as Events from "../constants/events"
import { SCENE_NAMES } from "../constants/scenes"

export type Scene = {
  name: string
  update: (dt: number) => void
  unmount: VoidFunction
  mount: VoidFunction
}

export const createSceneController = (app: PIXI.Application) => {
  /**
   * Construction
   */

  const EventController = createEventController()
  let scenes: Record<SCENE_NAMES, Scene> = {
    [SCENE_NAMES.MENU]: createSceneMenu(app, EventController),
    [SCENE_NAMES.PAUSE]: createScenePause(app, EventController),
    [SCENE_NAMES.LEVEL_1]: createSceneLevel1(app, EventController),
    [SCENE_NAMES.LEVEL_2]: createSceneLevel2(app, EventController),
  }
  let loaded: Scene[] = []
  let paused = false

  /**
   * Methods
   */

  // Update level
  const update = (dt: number) => {
    loaded.forEach((scene) => {
      switch (scene.name) {
        case SCENE_NAMES.MENU:
        case SCENE_NAMES.PAUSE:
          scene.update(dt)
          break
        default:
          if (!paused) scene.update(dt)
          break
      }
    })
  }

  // Select level
  const load = (sceneNames: SCENE_NAMES[]) => {
    loaded.forEach((scene) => scene.unmount())
    loaded = sceneNames.map((sceneName) => {
      scenes[sceneName].mount()
      return scenes[sceneName]
    })
  }

  /**
   * Events
   */

  EventController.subscribe(Events.RESIZE_APP, "scenecontroller", () => {
    const parent = app.view.parentNode
    // @ts-ignore wtf ts html typing
    app.renderer.resize(parent.clientWidth, parent.clientHeight)
    EventController.emit(Events.RESIZE)
  })

  EventController.subscribe(Events.CHANGE_SCENES, "scenecontroller", (scene: SCENE_NAMES) => {
    switch (scene) {
      case SCENE_NAMES.MENU: {
        load([SCENE_NAMES.MENU])
        break
      }
      case SCENE_NAMES.LEVEL_1: {
        load([SCENE_NAMES.LEVEL_1, SCENE_NAMES.PAUSE])
        break
      }
      case SCENE_NAMES.LEVEL_2: {
        load([SCENE_NAMES.LEVEL_2, SCENE_NAMES.PAUSE])
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

  window.addEventListener("resize", () => EventController.emit(Events.RESIZE_APP))
  EventController.emit(Events.RESIZE_APP)

  /**
   * Api
   */

  return {
    load,
    update,
  }
}

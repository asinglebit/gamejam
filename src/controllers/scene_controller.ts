import * as PIXI from "pixi.js"
import { Level1Stage, Stage, MenuStage } from "../scenes"
import { createEventController } from "./event_controller"
import * as Events from "../constants/events"
import { SCENE_NAMES } from "../constants/scenes"

export const createSceneController = (app: PIXI.Application) => {
  /**
   * Construction
   */

  const EventController = createEventController()
  let stages: Record<SCENE_NAMES, Stage> = {
    [SCENE_NAMES.MENU]: new MenuStage(app, EventController),
    [SCENE_NAMES.LEVEL_1]: new Level1Stage(app, EventController),
  }
  let loaded: Stage[] = []
  let isPaused = false

  /**
   * Methods
   */

  // Update level
  const update = (dt: number) => {
    loaded.forEach((scene) => {
      switch (scene.stageName) {
        case SCENE_NAMES.MENU:
          scene.update(dt)
          break
        case SCENE_NAMES.LEVEL_1:
          scene.update(dt, isPaused)
        default:
          if (!isPaused) scene.update(dt)
          break
      }
    })
  }

  // Select level
  const load = (sceneNames: SCENE_NAMES[]) => {
    loaded.forEach((scene) => scene.unmount())
    loaded = sceneNames.map((sceneName) => {
      stages[sceneName].mount()
      return stages[sceneName]
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
    // debugger
    switch (scene) {
      case SCENE_NAMES.MENU: {
        load([SCENE_NAMES.MENU])
        break
      }
      case SCENE_NAMES.LEVEL_1: {
        load([SCENE_NAMES.LEVEL_1])
        break
      }
     
    }
    isPaused = false
  })

  EventController.subscribe(Events.ENTER_PAUSE_MENU, "scenecontroller", () => {
    isPaused = true
  })

  EventController.subscribe(Events.LEAVE_PAUSE_MENU, "scenecontroller", () => {
    isPaused = false
  })

  EventController.subscribe(Events.RELOAD_SCENES, "scenecontroller", () => {
    loaded.forEach((scene) => {
      scene.unmount()
      scene.mount()
      isPaused = false
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

import * as PIXI from "pixi.js"
import { Level1Stage, MenuStage } from "../scenes"
import { Stage } from "../core/stage"
import { createEventController } from "./event_controller"
import * as Events from "../constants/events"
import { STAGE_NAME } from "../constants/scenes"

export const createSceneController = (app: PIXI.Application) => {
  /**
   * Construction
   */

  const eventController = createEventController()
  let stage: Stage = null
  let isPaused = false

  /**
   * Methods
   */

  // Update level
  const update = (dt: number) => {
    stage && stage.update(dt, isPaused)
  }

  // Select level
  const load = (stageName: STAGE_NAME) => {
    if (stage) stage.unmount()
    switch(stageName) {
      case STAGE_NAME.MENU: stage = new MenuStage(app, eventController); break
      case STAGE_NAME.LEVEL_1: stage = new Level1Stage(app, eventController); break
    }
    isPaused = false
  }

  /**
   * Events
   */

  window.addEventListener("resize", () => eventController.emit(Events.RESIZE_APP))

  eventController.subscribe(Events.CHANGE_SCENES, "scenecontroller", (stageName: STAGE_NAME) => load(stageName))
  eventController.subscribe(Events.ENTER_PAUSE_MENU, "scenecontroller", () => { isPaused = true })
  eventController.subscribe(Events.LEAVE_PAUSE_MENU, "scenecontroller", () => { isPaused = false })
  eventController.subscribe(Events.RELOAD_SCENES, "scenecontroller", () => load(stage.stageName))
  eventController.subscribe(Events.RESIZE_APP, "scenecontroller", () => {
    const parent = app.view.parentNode
    // @ts-ignore wtf ts html typing
    app.renderer.resize(parent.clientWidth, parent.clientHeight)
    eventController.emit(Events.RESIZE)
  })
  
  eventController.emit(Events.RESIZE_APP)

  /**
   * Api
   */

  return {
    load,
    update,
  }
}

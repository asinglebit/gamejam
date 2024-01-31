import * as PIXI from "pixi.js"
import { Level1Stage, MenuStage } from "../stages"
import { Stage } from "../core/stage"
import { createEventController } from "./event_controller"
import { EVENTS } from "../enums/events"
import { STAGES } from "../enums/stages"

export const createStageController = (app: PIXI.Application) => {
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
  const load = (stageName: STAGES) => {
    if (stage) stage.unmount()
    switch(stageName) {
      case STAGES.MENU: stage = new MenuStage(app, eventController); break
      case STAGES.LEVEL_1: stage = new Level1Stage(app, eventController); break
    }
    isPaused = false
  }

  /**
   * Events
   */

  window.addEventListener("resize", () => eventController.emit(EVENTS.RESIZE_APP))

  eventController.subscribe(EVENTS.CHANGE_STAGE, "StageController", (stageName: STAGES) => load(stageName))
  eventController.subscribe(EVENTS.PAUSE, "StageController", () => { isPaused = true })
  eventController.subscribe(EVENTS.UNPAUSE, "StageController", () => { isPaused = false })
  eventController.subscribe(EVENTS.RELOAD_STAGE, "StageController", () => load(stage.stageName))
  eventController.subscribe(EVENTS.RESIZE_APP, "StageController", () => {
    const parent = app.view.parentNode
    // @ts-ignore wtf ts html typing
    app.renderer.resize(parent.clientWidth, parent.clientHeight)
    eventController.emit(EVENTS.RESIZE)
  })
  
  eventController.emit(EVENTS.RESIZE_APP)

  /**
   * Api
   */

  return {
    load,
    update,
  }
}

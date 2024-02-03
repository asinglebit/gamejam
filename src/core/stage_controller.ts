import * as PIXI from "pixi.js"

import { EVENTS } from "../enums/events"
import { STAGES } from "../enums/stages"

import { Stage } from "./stage"
import { EventController } from "./event_controller"

import { Level1Stage, MenuStage } from "../stages"

export class StageController {
  
  private app: PIXI.Application
  private eventController: EventController = new EventController()
  private stage: Stage = null
  private isPaused = false

  constructor(app: PIXI.Application) {
    this.app = app

    window.addEventListener("resize", () => this.eventController.emit(EVENTS.RESIZE_APP))
    window.addEventListener('keydown', (event) => {
      if (event.repeat) return;
      this.eventController.emit(EVENTS.KEY_PRESS, event.key)
    })

    this.eventController.subscribe(EVENTS.CHANGE_STAGE, "StageController", (stageName: STAGES) => this.load(stageName))
    this.eventController.subscribe(EVENTS.PAUSE, "StageController", () => { this.isPaused = true })
    this.eventController.subscribe(EVENTS.UNPAUSE, "StageController", () => { this.isPaused = false })
    this.eventController.subscribe(EVENTS.RELOAD_STAGE, "StageController", () => this.load(this.stage.stageName))
    this.eventController.subscribe(EVENTS.RESIZE_APP, "StageController", () => {
      const parent = this.app.view.parentNode
      // @ts-ignore wtf ts html typing
      this.app.renderer.resize(parent.clientWidth, parent.clientHeight)
      this.eventController.emit(EVENTS.RESIZE)
    })    
    this.eventController.emit(EVENTS.RESIZE_APP)
  }

  update (dt: number) {
    this.stage && this.stage.update(dt, this.isPaused)
  }
  
  load (stageName: STAGES) {
    if (this.stage) this.stage.unmount()
    switch(stageName) {
      case STAGES.MENU: this.stage = new MenuStage(this.app, this.eventController); break
      case STAGES.LEVEL_1: this.stage = new Level1Stage(this.app, this.eventController); break
    }
    this.isPaused = false
  }
}

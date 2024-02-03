import * as PIXI from "pixi.js"

import { STAGES } from "../enums/stages"
import { EventController } from "./event_controller"
import { PauseOverlay } from "../components/common/pause"

export class Stage {
  public stageName: STAGES
  protected pauseOverlay: PauseOverlay
  protected stage: PIXI.Container
  protected app: PIXI.Application
  protected eventController: EventController
  protected isPausable: boolean

  constructor(stageName: STAGES, app: PIXI.Application, eventController: EventController, isPausable: boolean) {
    
    // Store arguments
    this.app = app
    this.eventController = eventController
    this.isPausable = isPausable
    this.stageName = stageName

    // Stage initialization
    this.stage = new PIXI.Container()
    this.stage.sortableChildren = true
    this.stage.name = STAGES[this.stageName]
    this.app.stage.addChild(this.stage)

    // Pause overlay
    if (this.isPausable) this.pauseOverlay = new PauseOverlay(this.app, this.stage, this.eventController)
  }

  update(dt: number, isPaused?: boolean) {
    if (this.isPausable) this.pauseOverlay.update(dt)
  }

  unmount() {
    if (this.isPausable) this.pauseOverlay.unmount()
    this.stage.destroy(true)
  }
}

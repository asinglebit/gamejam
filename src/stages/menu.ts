import * as PIXI from "pixi.js"

import { EVENTS } from "../enums/events"
import { STAGES } from "../enums/stages"

import { ComponentController } from "../core/component_controller"
import { EventController } from "../core/event_controller"
import { Stage } from "../core/stage"

import { Text } from "../components"
import { FONT_FAMILY } from "../constants"

export class MenuStage extends Stage {
  private componentController: ComponentController
  private menuContainer: PIXI.Container
  private credits: PIXI.Text

  constructor(app: PIXI.Application, eventController: EventController) {

    // Super constructor
    super(STAGES.MENU, app, eventController, false)

    // Setup private members
    this.componentController = new ComponentController()

    // Continue stage initialization
    this.menuContainer = new PIXI.Container()
    this.stage.addChild(this.menuContainer)

    // Main title
    const title = new PIXI.Text(`Game Title`, {
      fontFamily: FONT_FAMILY,
      fontSize: 100,
      fill: 0xFFFFFF,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 1
    })
    title.anchor.x = 0.5
    title.anchor.y = 1
    this.menuContainer.addChild(title)
    const subtitle = new PIXI.Text(`Game by A&A`, {
      fontFamily: FONT_FAMILY,
      fontSize: 18,
      fill: 0xFFFFFF,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 1
    })
    subtitle.anchor.x = 0.5
    subtitle.anchor.y = 0
    this.menuContainer.addChild(subtitle)

    // List of levels
    this.componentController.add(
      new Text(
        { text: "The only level.", color: 0x888888 },
        { x: 0, y: 180 },
        this.menuContainer,
        () => this.eventController.emit(EVENTS.CHANGE_STAGE, STAGES.LEVEL_1)
      )
    )

    // Subscribe to events
    this.eventController.subscribe(EVENTS.RESIZE, this.stageName, () => {
      this.relayout()
    })

    this.credits = new PIXI.Text(`
      Soundtrack: Run Amok by Kevin MacLeod | https://incompetech.com/
      Music promoted by https://www.chosic.com/free-music/all/
      Creative Commons CC BY 3.0
      https://creativecommons.org/licenses/by/3.0/
    `, {
      fontFamily: FONT_FAMILY,
      fontSize: 14,
      fill: 0xFFFFFF,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 1
    })
    this.credits.anchor.x = 0.5
    this.credits.anchor.y = 1
    this.stage.addChild(this.credits)

    // Center menuContainer
    this.relayout()
  }

  relayout() {
    this.credits.x = this.app.screen.width / 2
    this.credits.y = this.app.screen.height - 30
    this.menuContainer.x = this.app.screen.width / 2
    this.menuContainer.y = this.app.screen.height / 2 - 160
  }

  update(dt: number) {
    this.componentController.update(dt)
  }

  unmount() {
    this.componentController.unmount()
    this.eventController.unsubscribe(this.stageName)
    super.unmount()
  }
}

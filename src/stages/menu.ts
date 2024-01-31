import * as PIXI from "pixi.js"
import { createComponentController } from "../controllers/component_controller"
import { Text } from "../game_objects"
import { EVENTS } from "../enums/events"
import { STAGES } from "../enums/stages"
import { EventController } from "../controllers/event_controller"
import { Stage } from "../core/stage"

export class MenuStage extends Stage {
  private componentController: {}
  private menuContainer: PIXI.Container

  constructor(app: PIXI.Application, eventController: EventController) {

    // Super constructor
    super(STAGES.MENU, app, eventController, false)

    // Setup private members
    this.componentController = createComponentController()

    // Continue stage initialization
    this.menuContainer = new PIXI.Container()
    this.stage.addChild(this.menuContainer)

    // Main title
    // @ts-ignore
    this.componentController.add(
      new Text(
        { text: "Game by A&A", color: 0xffffff, },
        { x: 0, y: 0, },
        this.menuContainer
      )
    )

    // List of levels
    // @ts-ignore
    this.componentController.add(
      new Text(
        { text: "Level 1", color: 0x888888 },
        { x: 0, y: 100 },
        this.menuContainer,
        () => this.eventController.emit(EVENTS.CHANGE_STAGE, STAGES.LEVEL_1)
      )
    )

    // Center menuContainer
    this.relayout()

    // Subscribe to events
    this.eventController.subscribe(EVENTS.RESIZE, this.stageName, () => {
      this.relayout()
    })
  }

  relayout() {
    this.menuContainer.x = this.app.screen.width / 2
    this.menuContainer.y = this.app.screen.height / 2 - this.menuContainer.getLocalBounds().height / 2
  }

  update(dt: number) {
    // @ts-ignore
    this.componentController.update(dt)
  }

  unmount() {
    // @ts-ignore
    this.componentController.unmount()
    this.eventController.unsubscribe(this.stageName)
    super.unmount()
  }
}

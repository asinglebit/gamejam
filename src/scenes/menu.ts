import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { Text } from "../game_objects"
import * as Events from "../constants/events"
import { STAGE_NAME } from "../constants/scenes"
import { EventController } from "../controllers/event_controller"
import { Stage } from "../core/stage"

export class MenuStage extends Stage {
  private gameObjectController: {}
  private menuContainer: PIXI.Container

  constructor(app: PIXI.Application, eventController: EventController) {

    // Super constructor
    super(STAGE_NAME.MENU, app, eventController, false)

    // Setup private members
    this.gameObjectController = createGameObjectController()

    // Continue stage initialization
    this.menuContainer = new PIXI.Container()
    this.stage.addChild(this.menuContainer)

    // Main title
    // @ts-ignore
    this.gameObjectController.add(
      new Text(
        { text: "Game by A&A", color: 0xffffff, },
        { x: 0, y: 0, },
        this.menuContainer
      )
    )

    // List of levels
    // @ts-ignore
    this.gameObjectController.add(
      new Text(
        { text: "Level 1", color: 0x888888 },
        { x: 0, y: 100 },
        this.menuContainer,
        () => this.eventController.emit(Events.CHANGE_SCENES, STAGE_NAME.LEVEL_1)
      )
    )

    // Center menuContainer
    this.relayout()

    // Subscribe to events
    this.eventController.subscribe(Events.RESIZE, this.stageName, () => {
      this.relayout()
    })
  }

  relayout() {
    this.menuContainer.x = this.app.screen.width / 2
    this.menuContainer.y = this.app.screen.height / 2 - this.menuContainer.getLocalBounds().height / 2
  }

  update(dt: number) {
    // @ts-ignore
    this.gameObjectController.update(dt)
  }

  unmount() {
    // @ts-ignore
    this.gameObjectController.unmount()
    this.eventController.unsubscribe(this.stageName)
    super.unmount()
  }
}
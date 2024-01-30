import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { Text } from "../game_objects"
import * as Events from "../constants/events"
import { SCENE_NAMES } from "../constants/scenes"
import { EventController } from "../controllers/event_controller"
import { Stage } from "./level_1"


export class MenuStage extends Stage {
  private gameObjectController: {}
  private container: PIXI.Container

  constructor(app: PIXI.Application, eventController: EventController) {
    super(app, eventController, false)
    this.stageName = SCENE_NAMES.MENU

    this.gameObjectController = createGameObjectController()
  }

  mount() {
    // Stage
    this.stage.name = this.stageName
    this.container = new PIXI.Container()
    this.stage.addChild(this.container)
    this.app.stage.addChild(this.stage)

    // @ts-ignore
    this.gameObjectController.add(
      new Text({
        text: "Game by A&A",
        color: 0xffffff,
      }, {
        x: 0,
        y: 0,
      }, this.container)
    )

    // Levels
    // @ts-ignore
    this.gameObjectController.add(
      new Text({
        text: "Level 1",
        color: 0x888888,
      }, {
        x: 0,
        y: 100,
      },
        this.container,
        () => {
          this.eventController.emit(Events.CHANGE_SCENES, SCENE_NAMES.LEVEL_1)
        }
      )
    )

    // Center container
    this.container.x = this.app.screen.width / 2
    this.container.y = this.app.screen.height / 2 - this.container.getLocalBounds().height / 2

    // Subscribe to events
    this.eventController.subscribe(Events.RESIZE, this.stageName, () => {
      this.container.x = this.app.screen.width / 2
      this.container.y = this.app.screen.height / 2 - this.container.getLocalBounds().height / 2
    })
  }


  update(dt: number) {
    // @ts-ignore
    this.gameObjectController.update(dt)
  }

  unmount() {
    super.unmount()
    // @ts-ignore
    this.gameObjectController.unmount()
    // this.container?.destroy(true)
    this.eventController.unsubscribe(this.stageName)
  }

}
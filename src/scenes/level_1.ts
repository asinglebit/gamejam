import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { CELL_SIZE } from "../constants/constants"
import { STAGE_NAME } from "../constants/scenes"
import * as Events from "../constants/events"
import { EventController } from "../controllers/event_controller"
import { createSpriteUITile, createSpriteRanged, createSpriteTile } from "../utils/sprites"
import { UnitRanged } from "../game_objects/unit_ranged"
import { Stage } from "../core/stage"

export class Level1Stage extends Stage {

  private cellRows = 5
  private cellColumns = 10
  private sceneWidth = this.cellColumns * CELL_SIZE
  private sceneHeight = this.cellRows * CELL_SIZE
  private gameObjectController: {}
  private fieldContainer: PIXI.Container
  private containerControls: PIXI.Container
  private isPlacing = false

  constructor(app: PIXI.Application, eventController: EventController) {
    super(STAGE_NAME.LEVEL_1, app, eventController, true)

    this.gameObjectController = createGameObjectController()
    
    this.fieldContainer = new PIXI.Container()
    this.stage.addChild(this.fieldContainer)
    
    this.containerControls = new PIXI.Container()
    this.containerControls.x = 20
    this.containerControls.y = 20
    this.stage.addChild(this.containerControls)

    // Controls
    const uiTile = createSpriteUITile()
    uiTile.scale.x = 1
    uiTile.scale.y = 1
    this.containerControls.addChild(uiTile)
    const uiRanged = createSpriteRanged()
    uiRanged.x = 30
    uiRanged.y = 21
    uiRanged.scale.x = 0.4
    uiRanged.scale.y = 0.4
    uiRanged.stop()
    uiTile.addChild(uiRanged)
    uiTile.interactive = true
    uiTile.on('pointerdown', () => {
      this.isPlacing = true
    })

    // Reset layout
    this.relayout()

    // Temporary tiles
    const uiTemporary = createSpriteRanged()
    uiTemporary.stop()
    uiTemporary.visible = false;

    // Background tiles
    for (let row_index = 0; row_index < this.cellRows; ++row_index) {
      for (let column_index = 0; column_index < this.cellColumns; ++column_index) {
        const sprite = createSpriteTile()
        sprite.x = column_index * CELL_SIZE
        sprite.y = row_index * CELL_SIZE
        sprite.interactive = true
        //@ts-ignore
        sprite.occupied = null
        sprite.on('mouseover', () => {
          //@ts-ignore
          if (this.isPlacing && !sprite.occupied) {
            uiTemporary.x = sprite.x + 80
            uiTemporary.y = sprite.y + 60
            uiTemporary.visible = true
          }
        })
        sprite.on('pointerdown', () => {
          //@ts-ignore
          if (this.isPlacing && !sprite.occupied) {
            this.isPlacing = false
            uiTemporary.visible = false
            // @ts-ignore
            this.gameObjectController.add(new UnitRanged({ x: uiTemporary.x, y: uiTemporary.y }, this.fieldContainer))
            //@ts-ignore
            sprite.occupied = true
          }
        })
        this.fieldContainer.addChild(sprite)
      }
    }

    this.fieldContainer.addChild(uiTemporary)
    
    // Events
    // @ts-ignore
    this.eventController.subscribe(Events.ENTER_PAUSE_MENU, this.stageName, this.gameObjectController.pause)
    // @ts-ignore
    this.eventController.subscribe(Events.LEAVE_PAUSE_MENU, this.stageName, this.gameObjectController.play)
    this.eventController.subscribe(Events.RESIZE, this.stageName, () => this.relayout())
  }

  relayout() {
    const factor = this.app.screen.width / this.sceneWidth
    this.fieldContainer.scale.x = factor
    this.fieldContainer.scale.y = factor
    this.fieldContainer.y = this.app.screen.height / 2 - (this.sceneHeight * factor) / 2
  }

  update(dt: number, isPaused: boolean) {
    super.update(dt, isPaused)

    // @ts-ignore
    !isPaused && this.gameObjectController.update(dt)
  }

  unmount() {
    // @ts-ignore
    this.gameObjectController.unmount()
    this.eventController.unsubscribe(this.stageName)
    this.fieldContainer.destroy()
    this.containerControls.destroy()
    super.unmount()
  }
}


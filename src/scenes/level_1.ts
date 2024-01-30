import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { CELL_SIZE } from "../constants/constants"
import { SCENE_NAMES } from "../constants/scenes"
import * as Events from "../constants/events"
import { Scene } from "../controllers/scene_controller"
import { EventController } from "../controllers/event_controller"
import { createSpriteUITile, createSpriteRanged, createSpriteTile } from "../utils/sprites"
import { UnitRanged } from "../game_objects/unit_ranged"

export const createSceneLevel1 = (app: PIXI.Application, EventController: EventController): Scene => {

  /**
   * Construction
   */

  // Constants
  const sceneName = SCENE_NAMES.LEVEL_1
  const cellRows = 5
  const cellColumns = 10
  const sceneWidth = CELL_SIZE * cellColumns
  const sceneHeight = CELL_SIZE * cellRows
  // Game object controller
  const GameObjectController = createGameObjectController()
  // Container references
  let container: PIXI.Container = null
  let containerControls: PIXI.Container = null
  // State
  let isPlacing = false

  /**
   * Methods
   */

  const relayout = () => {
    const factor = app.screen.width / sceneWidth
    container.scale.x = factor
    container.scale.y = factor
    container.y = app.screen.height / 2 - (sceneHeight * factor) / 2
  }

  const mount = () => {

    // Containers
    container = new PIXI.Container()
    app.stage.addChild(container)
    containerControls = new PIXI.Container()
    containerControls.x = 20
    containerControls.y = 20
    app.stage.addChild(containerControls)

    // Controls
    const uiTile = createSpriteUITile()
    uiTile.scale.x = 1
    uiTile.scale.y = 1
    containerControls.addChild(uiTile)
    const uiRanged = createSpriteRanged()
    uiRanged.x = 30
    uiRanged.y = 21
    uiRanged.scale.x = 0.4
    uiRanged.scale.y = 0.4
    uiRanged.stop()
    uiTile.addChild(uiRanged)
    uiTile.interactive = true
    uiTile.on('pointerdown', () => {
      isPlacing = true
    })

    // Reset layout
    relayout()
    
    // Temporary tiles
    const uiTemporary = createSpriteRanged()
    uiTemporary.stop()
    uiTemporary.visible = false;

    // Background tiles
    for (let row_index = 0; row_index < cellRows; ++row_index) {
      for (let column_index = 0; column_index < cellColumns; ++column_index) {
        const sprite = createSpriteTile()
        sprite.x = column_index * CELL_SIZE
        sprite.y = row_index * CELL_SIZE
        sprite.interactive = true
        //@ts-ignore
        sprite.occupied = null
        sprite.on('mouseover', () => {
          //@ts-ignore
          if (isPlacing && !sprite.occupied) {
            uiTemporary.x = sprite.x + 80
            uiTemporary.y = sprite.y + 60
            uiTemporary.visible = true
          }
        })
        sprite.on('pointerdown', () => {
          //@ts-ignore
          if (isPlacing && !sprite.occupied) {
            isPlacing = false
            uiTemporary.visible = false
            GameObjectController.add(new UnitRanged({ x: uiTemporary.x, y: uiTemporary.y }, container))
            //@ts-ignore
            sprite.occupied = true
          }
        })
        container.addChild(sprite)
      }
    }

    container.addChild(uiTemporary)
    

    // Projectile for testing
    

    // Events
    EventController.subscribe(Events.ENTER_PAUSE_MENU, sceneName, GameObjectController.pause)
    EventController.subscribe(Events.LEAVE_PAUSE_MENU, sceneName, GameObjectController.play)
    EventController.subscribe(Events.RESIZE, sceneName, relayout)
  }

  const update = (dt: number) => {
    GameObjectController.update(dt)
  }

  const unmount = () => {
    GameObjectController.unmount()
    if (containerControls) containerControls.destroy()
    if (container) container.destroy()
    EventController.unsubscribe(sceneName)
  }

  /**
   * Api
   */

  return {
    name: sceneName,
    mount,
    update,
    unmount,
  }
}

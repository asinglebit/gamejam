import * as PIXI from "pixi.js"

import { EVENTS } from "../enums/events"
import { STAGES } from "../enums/stages"
import { CELL_HALF_SIZE, CELL_SIZE } from "../constants"

import { Stage } from "../core/stage"
import { ComponentController } from "../core/component_controller"
import { EventController } from "../core/event_controller"
import { IComponent } from "../core/component"

import { createSpriteUITile, createSpriteRangedIdle, createSpriteTile } from "../utils/sprites"
import { UnitRanged, Tile } from "../components"
import { Projectile } from "../components/projectile"
import { Enemy } from "../components/enemy"

export class Level1Stage extends Stage {

  private cellRows = 5
  private cellColumns = 10
  private sceneWidth = this.cellColumns * CELL_SIZE
  private sceneHeight = this.cellRows * CELL_SIZE
  private componentController: ComponentController
  private fieldContainer: PIXI.Container
  private containerControls: PIXI.Container

  private isPaused = false
  private isPlacing = false
  private occupiedTiles: string[] = []

  private timer = 190

  constructor(app: PIXI.Application, eventController: EventController) {
    super(STAGES.LEVEL_1, app, eventController, true)

    this.componentController = new ComponentController()
    
    this.fieldContainer = new PIXI.Container()
    this.stage.addChild(this.fieldContainer)
    
    this.containerControls = new PIXI.Container()
    this.containerControls.x = 45
    this.containerControls.y = 45
    this.stage.addChild(this.containerControls)

    // Controls
    const uiTile = createSpriteUITile()

    uiTile.scale.x = 1
    uiTile.scale.y = 1
    this.containerControls.addChild(uiTile)
    const uiRanged = createSpriteRangedIdle()
    uiRanged.scale.x = 0.4
    uiRanged.scale.y = 0.4
    uiRanged.play()
    uiTile.addChild(uiRanged)
    uiTile.interactive = true
    uiTile.on('pointerdown', () => {
      if (!this.isPaused) {
        this.isPlacing = true
      }
    })

    // Reset layout
    this.relayout()

    // Temporary tiles
    const uiTemporary = createSpriteRangedIdle()
    uiTemporary.play()
    uiTemporary.alpha = 0.4
    uiTemporary.visible = false;

    // Background tiles
    for (let row_index = 0; row_index < this.cellRows; ++row_index) {
      for (let column_index = 0; column_index < this.cellColumns; ++column_index) {

        // Tile position
        const x = CELL_HALF_SIZE + column_index * CELL_SIZE
        const y = CELL_HALF_SIZE + row_index * CELL_SIZE

        // Interactive callbacks
        const onPointerDown = (uid: string) => {
          if (!this.isPaused && this.isPlacing && this.isTileFree(uid)) {
            this.isPlacing = false
            uiTemporary.visible = false
            this.addUnit(x, y)
            this.occupyTile(uid)
          }
        }
        const onMouseOver = (uid: string) => {
          if (!this.isPaused && this.isPlacing && this.isTileFree(uid)) {
            uiTemporary.x = x
            uiTemporary.y = y
            uiTemporary.visible = true
          }
        }

        // Add tile
        this.componentController.add(new Tile({ x, y }, this.fieldContainer, onPointerDown, onMouseOver))
      }
    }

    this.fieldContainer.addChild(uiTemporary)
    
    // Events
    this.eventController.subscribe(EVENTS.PAUSE, this.stageName, () => {
      this.isPaused = true
      this.componentController.pause()
      uiRanged.stop()
      uiTemporary.stop()
    })
    this.eventController.subscribe(EVENTS.UNPAUSE, this.stageName, () => {
      this.isPaused = false
      this.componentController.play()
      uiRanged.play()
      uiTemporary.play()
    })
    this.eventController.subscribe(EVENTS.RESIZE, this.stageName, () => this.relayout())
  }

  addUnit(x: number, y: number) {
    const onFireProjectile = () => {
      this.componentController.add(new Projectile({ x, y }, this.fieldContainer, 5, () => {}))
    }
    this.componentController.add(new UnitRanged({ x, y }, this.fieldContainer, onFireProjectile))
  }

  isTileFree(uid: string): boolean {
    return !this.occupiedTiles.includes(uid)
  }

  occupyTile(uid: string) {
    this.freeTile(uid)
    this.occupiedTiles.push(uid)
  }

  freeTile(uid: string) {
    const index = this.occupiedTiles.indexOf(uid);
    if (index !== -1) this.occupiedTiles.splice(index, 1);
  }

  spawnEnemy() {
    this.componentController.add(new Enemy(
      {
        x: CELL_SIZE * 11,
        y: CELL_SIZE * Math.floor(Math.random() * 5) + 54
      },
      this.fieldContainer
      )
    )
  }

  checkForHits() {
    const projectiles: Projectile[] = this.componentController.get("Projectile") as Projectile[]
    const enemies: Enemy[] = this.componentController.get("Enemy") as Enemy[]
    for (let i = 0; i < projectiles.length; ++i) {
      for (let j = 0; j < enemies.length; ++j) {
        const projectile = projectiles[i]
        const enemy = enemies[j]
        if (projectile.isIntersecting(enemy)) {
          projectile.shouldBeUnmounted = true
          enemy.shouldBeUnmounted = true
        }
      }
    }
  }

  relayout() {
    const factor = this.app.screen.width / this.sceneWidth
    this.fieldContainer.scale.x = factor
    this.fieldContainer.scale.y = factor
    this.fieldContainer.y = this.app.screen.height / 2 - (this.sceneHeight * factor) / 2
  }

  update(dt: number, isPaused: boolean) {
    super.update(dt, isPaused)
    if (!isPaused) {
      this.componentController.update(dt)
      this.timer += dt

      this.checkForHits()

      if (this.timer > 200) {
        this.spawnEnemy()
        this.timer = 0
      }
    }
  }

  unmount() {
    this.componentController.unmount()
    this.eventController.unsubscribe(this.stageName)
    this.fieldContainer.destroy()
    this.containerControls.destroy()
    super.unmount()
  }
}


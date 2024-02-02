import * as PIXI from "pixi.js"

import { EVENTS } from "../enums/events"
import { STAGES } from "../enums/stages"
import { CELL_HALF_SIZE, CELL_SIZE } from "../constants"

import { Stage } from "../core/stage"
import { ComponentController } from "../core/component_controller"
import { EventController } from "../core/event_controller"

import { createSpriteUITile, createSpriteRanged, createDefenderSprite } from "../utils/sprites"
import { UnitRanged, Tile } from "../components"
import { Projectile } from "../components/projectile"
import { Enemy } from "../components/enemy"
import { EnemyAttack } from "../components/enemy_attack"
import { Defender } from "../components/defender"

type UnitType = 'Range' | 'Defender'

export class Level1Stage extends Stage {

  private cellRows = 5
  private cellColumns = 10
  private sceneWidth = this.cellColumns * CELL_SIZE
  private sceneHeight = this.cellRows * CELL_SIZE
  private componentController: ComponentController
  private fieldContainer: PIXI.Container
  private containerControls: PIXI.Container

  private isPaused = false
  private placingUnitType: UnitType
  private occupiedTiles: string[] = []

  private timer = 190

  constructor(app: PIXI.Application, eventController: EventController) {
    super(STAGES.LEVEL_1, app, eventController, true)

    this.componentController = new ComponentController()
    
    this.fieldContainer = new PIXI.Container()
    this.fieldContainer.name = "fieldContainer"
    this.stage.addChild(this.fieldContainer)
    
    this.containerControls = new PIXI.Container()
    this.containerControls.name = "containerControls"
    this.containerControls.x = 45
    this.containerControls.y = 45
    this.stage.addChild(this.containerControls)

    // Temporary tiles
    const uiTemporary = new PIXI.Container()
    uiTemporary.alpha = 0.4
    uiTemporary.visible = false;


    // Controls
    const uiTileRanged = createSpriteUITile()
    uiTileRanged.name = "uiTile"
    uiTileRanged.scale.x = 1.2
    uiTileRanged.scale.y = 1.2
    this.containerControls.addChild(uiTileRanged)
    const uiRanged = createSpriteRanged()
    uiRanged.name = "uiRanged"
    uiRanged.scale.x = 1
    uiRanged.scale.y = 1
    uiRanged.play()
    uiTileRanged.addChild(uiRanged)
    uiTileRanged.interactive = true
    uiTileRanged.on('pointerdown', () => {
      if (!this.isPaused) {
        this.placingUnitType = 'Range'
        const rangeTemp = createSpriteRanged()
        rangeTemp.play()
        uiTemporary.addChild(rangeTemp)
      }
    })

    //  Controls
     const uiTileDefender = createSpriteUITile()
     uiTileDefender.name = "uiTile"
     uiTileDefender.scale.x = 1.2
     uiTileDefender.scale.y = 1.2
     this.containerControls.addChild(uiTileDefender)
     const uiDefender = createDefenderSprite()
     uiDefender.name = "uiDefender"
     uiDefender.scale.x = 0.3
     uiDefender.scale.y = 0.3
     uiDefender.play()
     uiTileDefender.addChild(uiDefender)
     uiTileDefender.x = 128
     uiTileDefender.interactive = true
     uiTileDefender.on('pointerdown', () => {
       if (!this.isPaused) {
         this.placingUnitType = 'Defender'
         const defenderTemp = createDefenderSprite()
        defenderTemp.play()
        uiTemporary.addChild(defenderTemp)
       }
     })

    // Reset layout
    this.relayout()



    // Background tiles
    for (let row_index = 0; row_index < this.cellRows; ++row_index) {
      for (let column_index = 0; column_index < this.cellColumns; ++column_index) {

        // Tile position
        const x = CELL_HALF_SIZE + column_index * CELL_SIZE
        const y = CELL_HALF_SIZE + row_index * CELL_SIZE

        // Interactive callbacks
        const onPointerDown = (uid: string) => {
          if (!this.isPaused && this.placingUnitType && this.isTileFree(uid)) {
            console.log(this.placingUnitType)
            this.addUnit(x, y, this.placingUnitType)
            this.placingUnitType = null
            uiTemporary.visible = false
            uiTemporary.removeChildren()
            this.occupyTile(uid)
          }
        }
        const onMouseOver = (uid: string) => {
          if (!this.isPaused && this.placingUnitType && this.isTileFree(uid)) {
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
    this.eventController.subscribe(EVENTS.GAME_OVER, this.stageName, () => {
      this.isPaused = true
      this.componentController.pause()
      uiRanged.stop()
      // uiTemporary.stop()
    })
    this.eventController.subscribe(EVENTS.PAUSE, this.stageName, () => {
      this.isPaused = true
      this.componentController.pause()
      uiRanged.stop()
      // uiTemporary.stop()
    })
    this.eventController.subscribe(EVENTS.UNPAUSE, this.stageName, () => {
      this.isPaused = false
      this.componentController.play()
      uiRanged.play()
      // uiTemporary.play()
    })
    this.eventController.subscribe(EVENTS.RESIZE, this.stageName, () => this.relayout())
  }

  addUnit(x: number, y: number, unitType: UnitType) {
    console.log(unitType)

    if (unitType === 'Range') {
      const onFireProjectile = () => {
        this.componentController.add(new Projectile({ x, y }, this.fieldContainer, 5))
      }
      this.componentController.add(new UnitRanged({ x, y }, this.fieldContainer, onFireProjectile))
    }

    if (unitType === 'Defender') {
      this.componentController.add(new Defender({ x, y }, this.fieldContainer))
    }
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
    const onAttack = ({ x, y }: Coordinates, damage: number) => {
      this.componentController.add(new EnemyAttack({ x, y }, this.fieldContainer, damage))
    }
    const onReachEnd = () => {
      this.eventController.emit(EVENTS.GAME_OVER)
    }
    this.componentController.add(new Enemy(
      {
        x: CELL_SIZE * 11,
        y: CELL_SIZE * Math.floor(Math.random() * 5) + 54
      },
      this.fieldContainer,
      onAttack,
      onReachEnd
    ))
  }

  checkForHits() {
    const rangedUnits: UnitRanged[] = this.componentController.get("UnitRanged") as UnitRanged[]
    const projectiles: Projectile[] = this.componentController.get("Projectile") as Projectile[]
    const enemies: Enemy[] = this.componentController.get("Enemy") as Enemy[]
    const enemyAttacks: EnemyAttack[] = this.componentController.get("EnemyAttack") as EnemyAttack[]
   
    for (let i = 0; i < enemies.length; ++i) {
      const enemy = enemies[i]
      if (enemy.shouldBeUnmounted) continue
      // Check projectile hits
      for (let j = 0; j < projectiles.length; ++j) {
        const projectile = projectiles[j]
        if (projectile.shouldBeUnmounted) continue
        if (projectile.isIntersecting(enemy)) {
          enemy.hit(projectile.getDamage())
          projectile.attack()
        }
      }

      // Check ranged unit hits
      for (let j = 0; j < rangedUnits.length; ++j) {
        const rangedUnit = rangedUnits[j]
        if (rangedUnit.shouldBeUnmounted) continue
        if (rangedUnit.isIntersecting(enemy)) {
          enemy.attack()
        }
      }
    }

    for (let i = 0; i < rangedUnits.length; ++i) {
      const rangedUnit = rangedUnits[i]
      if (rangedUnit.shouldBeUnmounted) continue
      // Check projectile hits
      for (let j = 0; j < enemyAttacks.length; ++j) {
        const enemyAttack = enemyAttacks[j]
        if (enemyAttack.shouldBeUnmounted) continue
        if (enemyAttack.isIntersecting(rangedUnit)) {
          enemyAttack.shouldBeUnmounted = true
          rangedUnit.hit(enemyAttack.getDamage())
        }
      }
    }
  }

  relayout() {
    const factorX = (this.app.screen.width / this.sceneWidth)
    const factorY = (this.app.screen.height / this.sceneHeight)
    const factor = Math.min(factorX, factorY)
    this.fieldContainer.scale.x = factor
    this.fieldContainer.scale.y = factor
    this.fieldContainer.x = this.app.screen.width / 2 - (this.sceneWidth * factor) / 2
    this.fieldContainer.y = this.app.screen.height / 2 - (this.sceneHeight * factor) / 2
  }

  update(dt: number, isPaused: boolean) {
    super.update(dt, isPaused)
    if (!isPaused) {
      this.componentController.update(dt)
      this.timer += dt

      this.checkForHits()

      if (this.timer > 200 && this.timer < 204) {
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


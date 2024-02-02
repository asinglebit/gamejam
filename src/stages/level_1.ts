import * as PIXI from "pixi.js"

import { EVENTS } from "../enums/events"
import { STAGES } from "../enums/stages"
import { CELL_HALF_SIZE, CELL_SIZE } from "../constants"

import { Stage } from "../core/stage"
import { ComponentController } from "../core/component_controller"
import { EventController } from "../core/event_controller"

import { createSpriteUITile, createSpriteRanged, createDefenderSprite, createSpriteMelee, createSpriteProducer } from "../utils/sprites"
import { UnitRanged, Tile } from "../components"
import { Projectile } from "../components/attacks/projectile"
import { Enemy } from "../components/enemies/enemy"
import { EnemyAttack } from "../components/attacks/enemy_attack"
import { Defender } from "../components/units/defender"
import { Melee } from "../components/units/melee"
import { IComponent } from "../core/component"
import { Swing } from "../components/attacks/swing"
import { Producer } from "../components/units/producer"

type UnitType = 'Range' | 'Defender' | 'Melee' | 'Producer'

export class Level1Stage extends Stage {

  private cellRows = 5
  private cellColumns = 10
  private sceneWidth = this.cellColumns * CELL_SIZE
  private sceneHeight = this.cellRows * CELL_SIZE
  private componentController: ComponentController
  private fieldContainer: PIXI.Container
  private containerControls: PIXI.Container
  private containerBalance: PIXI.Container
  private textBalance: PIXI.Text

  private isPaused = false
  private placingUnitType: UnitType
  private occupiedTiles: string[] = []

  private balance: number = 100

  private timer = 190

  constructor(app: PIXI.Application, eventController: EventController) {
    super(STAGES.LEVEL_1, app, eventController, true)

    this.componentController = new ComponentController()
    
    this.fieldContainer = new PIXI.Container()
    this.fieldContainer.name = "fieldContainer"
    this.stage.addChild(this.fieldContainer)
    
    // Balance
    this.containerBalance = new PIXI.Container()
    this.containerBalance.name = "containerBalance"
    this.containerBalance.x = 30
    this.containerBalance.y = 30
    this.stage.addChild(this.containerBalance)
    this.textBalance = new PIXI.Text(`$${this.balance}`, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xFFFFFF,
      align: "center",
    });
    this.textBalance.anchor.set(0)
    this.containerBalance.addChild(this.textBalance)

    // Controls
    this.containerControls = new PIXI.Container()
    this.containerControls.name = "containerBalance"
    this.containerControls.x = 45
    this.containerControls.y = 45
    this.stage.addChild(this.containerControls)

    // Temporary tiles
    const uiTemporary = new PIXI.Container()
    uiTemporary.alpha = 0.4
    uiTemporary.visible = false;

    // Temporary units
    const rangeTemp = createSpriteRanged()
    rangeTemp.stop()
    // TODO: Sprites need to be fixed
    rangeTemp.scale.x = 2
    rangeTemp.scale.y = 2
    const meleeTemp = createSpriteMelee()
    meleeTemp.stop()
    // TODO: Sprites need to be fixed
    meleeTemp.scale.x = 2
    meleeTemp.scale.y = 2
    const producerTemp = createSpriteProducer()
    producerTemp.stop()
    // TODO: Sprites need to be fixed
    producerTemp.scale.x = 2
    producerTemp.scale.y = 2
    const defenderTemp = createDefenderSprite()
    defenderTemp.stop()

    // Producer
    const uiTileProducer = createSpriteUITile()
    uiTileProducer.name = "uiTileProducer"
    uiTileProducer.scale.x = 1.2
    uiTileProducer.scale.y = 1.2
    this.containerControls.addChild(uiTileProducer)
    const uiProducer = createSpriteProducer()
    uiProducer.name = "uiProducer"
    uiProducer.x = -1
    uiProducer.y = 5
    uiProducer.scale.x = 0.7
    uiProducer.scale.y = 0.7
    uiProducer.play()
    this.containerControls.addChild(uiProducer)
    const priceProducer = new PIXI.Text(`$10`, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xFFFFFF,
      align: "center",
      strokeThickness: 4
    });
    priceProducer.anchor.set(0.5)
    priceProducer.y += 35
    this.containerControls.addChild(priceProducer)
    uiTileProducer.x = 0
    uiTileProducer.eventMode = "dynamic"
    uiTileProducer.on('pointerdown', () => {
      if (!this.isPaused) {
        this.placingUnitType = 'Producer'
        uiTemporary.removeChildren()
        uiTemporary.addChild(producerTemp)
      }
    })

    // Ranged
    const uiTileRanged = createSpriteUITile()
    uiTileRanged.name = "uiTile"
    uiTileRanged.scale.x = 1.2
    uiTileRanged.scale.y = 1.2
    this.containerControls.addChild(uiTileRanged)
    const uiRanged = createSpriteRanged()
    uiRanged.name = "uiRanged"
    uiRanged.scale.x = 1
    uiRanged.scale.y = 1
    uiRanged.x = 64
    uiRanged.play()
    this.containerControls.addChild(uiRanged)
    const priceRanged = new PIXI.Text(`$40`, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xFFFFFF,
      align: "center",
      strokeThickness: 4
    });
    priceRanged.anchor.set(0.5)
    priceRanged.x = 64
    priceRanged.y += 35
    this.containerControls.addChild(priceRanged)
    uiTileRanged.x = 64
    uiTileRanged.eventMode = "dynamic"
    uiTileRanged.on('pointerdown', () => {
      if (!this.isPaused) {
        this.placingUnitType = 'Range'
        if (uiTemporary.children.length) uiTemporary.removeChildAt(0)
        uiTemporary.addChild(rangeTemp)
      }
    })

    // Melee
    const uiTileMelee = createSpriteUITile()
    uiTileMelee.name = "uiTile"
    uiTileMelee.scale.x = 1.2
    uiTileMelee.scale.y = 1.2
    this.containerControls.addChild(uiTileMelee)
    const uiMelee = createSpriteMelee()
    uiMelee.name = "uiMelee"
    uiMelee.x = -1
    uiMelee.y = 5
    uiMelee.scale.x = 0.7
    uiMelee.scale.y = 0.7
    uiMelee.x = 128
    uiMelee.play()
    this.containerControls.addChild(uiMelee)
    const priceMelee = new PIXI.Text(`$100`, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xFFFFFF,
      align: "center",
      strokeThickness: 4
    });
    priceMelee.anchor.set(0.5)
    priceMelee.x = 128
    priceMelee.y += 35
    this.containerControls.addChild(priceMelee)
    uiTileMelee.x = 128
    uiTileMelee.eventMode = "dynamic"
    uiTileMelee.on('pointerdown', () => {
      if (!this.isPaused) {
        this.placingUnitType = 'Melee'
        if (uiTemporary.children.length) uiTemporary.removeChildAt(0)
        uiTemporary.addChild(meleeTemp)
      }
    })

    // Defender
    const uiTileDefender = createSpriteUITile()
    uiTileDefender.name = "uiTile"
    uiTileDefender.scale.x = 1.2
    uiTileDefender.scale.y = 1.2
    this.containerControls.addChild(uiTileDefender)
    const uiDefender = createDefenderSprite()
    uiDefender.name = "uiDefender"
    uiDefender.scale.x = 0.3
    uiDefender.scale.y = 0.3
    uiDefender.x = 192
    uiDefender.play()
    this.containerControls.addChild(uiDefender)
    const priceDefender = new PIXI.Text(`$300`, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xFFFFFF,
      align: "center",
      strokeThickness: 4
    });
    priceDefender.anchor.set(0.5)
    priceDefender.x = 192
    priceDefender.y += 35
    this.containerControls.addChild(priceDefender)
    uiTileDefender.x = 192
    uiTileDefender.eventMode = "dynamic"
    uiTileDefender.on('pointerdown', () => {
      if (!this.isPaused) {
        this.placingUnitType = 'Defender'
        if (uiTemporary.children.length) uiTemporary.removeChildAt(0)
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
      this.containerControls.visible = false
    })
    this.eventController.subscribe(EVENTS.PAUSE, this.stageName, () => {
      this.isPaused = true
      this.componentController.pause()
      this.containerControls.visible = false
      this.containerBalance.visible = false
      uiRanged.stop()
      uiDefender.stop()
      uiMelee.stop()
      uiProducer.stop()
    })
    this.eventController.subscribe(EVENTS.UNPAUSE, this.stageName, () => {
      this.isPaused = false
      this.componentController.play()
      this.containerControls.visible = true
      this.containerBalance.visible = false
      uiRanged.play()
      uiDefender.play()
      uiMelee.play()
      uiProducer.play()
    })
    this.eventController.subscribe(EVENTS.RESIZE, this.stageName, () => this.relayout())
  }

  addUnit(x: number, y: number, unitType: UnitType) {
    switch (unitType) {
      case 'Producer': {
        if (this.balance < 10) return
        const onEarn = (money: number) => {
          this.balance += money
          this.textBalance.text = `$${this.balance}`
        }
        this.componentController.add(new Producer({ x, y }, this.fieldContainer, onEarn))
        this.balance -= 10
        this.textBalance.text = `$${this.balance}`
        break
      }
      case 'Melee': {
        if (this.balance < 100) return
        const onSwing = () => {
          this.componentController.add(new Swing({ x, y }, this.fieldContainer, 5))
        }
        this.componentController.add(new Melee({ x, y }, this.fieldContainer, onSwing))
        this.balance -= 100
        this.textBalance.text = `$${this.balance}`
        break
      }
      case 'Range': {
        if (this.balance < 40) return
        const onFireProjectile = () => {
          this.componentController.add(new Projectile({ x, y }, this.fieldContainer, 5))
        }
        this.componentController.add(new UnitRanged({ x, y }, this.fieldContainer, onFireProjectile))
        this.balance -= 40
        this.textBalance.text = `$${this.balance}`
        break
      }
      case 'Defender': {
        if (this.balance < 300) return
        this.componentController.add(new Defender({ x, y }, this.fieldContainer))
        this.balance -= 300
        this.textBalance.text = `$${this.balance}`
        break
      }
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
    const melee: Melee[] = this.componentController.get("Melee") as Melee[]
    const producer: Producer[] = this.componentController.get("Producer") as Producer[]
    const projectiles: Projectile[] = this.componentController.get("Projectile") as Projectile[]
    const swings: Swing[] = this.componentController.get("Swing") as Swing[]
    const enemies: Enemy[] = this.componentController.get("Enemy") as Enemy[]
    const enemyAttacks: EnemyAttack[] = this.componentController.get("EnemyAttack") as EnemyAttack[]

    const playerUnits = [...rangedUnits, ...melee, ...producer] as IComponent[]
    const playerDamagingZones = [...projectiles, ...swings] as IComponent[]
   
    for (let i = 0; i < enemies.length; ++i) {
      const enemy = enemies[i]
      if (enemy.shouldBeUnmounted) continue
      // Check projectile hits
      for (let j = 0; j < playerDamagingZones.length; ++j) {
        const playerDamagingZone = playerDamagingZones[j]
        if (playerDamagingZone.shouldBeUnmounted) continue
        if (playerDamagingZone.isIntersecting(enemy)) {
          enemy.hit(playerDamagingZone.getDamage())
          playerDamagingZone.attack()
        }
      }

      // Check ranged unit hits
      for (let j = 0; j < playerUnits.length; ++j) {
        const playerUnit: IComponent = playerUnits[j]
        if (playerUnit.shouldBeUnmounted) continue
        if (playerUnit.isIntersecting(enemy)) {
          enemy.attack()
          playerUnit.attack()
        }
      }
    }

    for (let i = 0; i < playerUnits.length; ++i) {
      const playerUnit = playerUnits[i]
      if (playerUnit.shouldBeUnmounted) continue
      // Check projectile hits
      for (let j = 0; j < enemyAttacks.length; ++j) {
        const enemyAttack = enemyAttacks[j]
        if (enemyAttack.shouldBeUnmounted) continue
        if (enemyAttack.isIntersecting(playerUnit)) {
          enemyAttack.shouldBeUnmounted = true
          playerUnit.hit(enemyAttack.getDamage())
        }
      }
    }
  }

  relayout() {
    this.containerControls.x = (this.app.screen.width / 2) - 192 / 2
    this.containerControls.y = (this.app.screen.height) - 60
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
    this.containerBalance.destroy()
    super.unmount()
  }
}


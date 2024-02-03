import * as PIXI from "pixi.js"
import { CompositeTilemap } from '@pixi/tilemap';

import { EVENTS } from "../enums/events"
import { STAGES } from "../enums/stages"
import { CELL_HALF_SIZE, CELL_SIZE, FONT_FAMILY } from "../constants"

import { Stage } from "../core/stage"
import { ComponentController } from "../core/component_controller"
import { EventController } from "../core/event_controller"

import { createSpriteUITile, createSpriteRanged, createDefenderSprite, createSpriteMelee, createSpriteProducer, createSpriteTree, createRandomProp, createTileMap } from "../utils/sprites"
import { UnitRanged, Tile } from "../components"
import { Projectile } from "../components/attacks/projectile"
import { Enemy } from "../components/enemies/enemy"
import { EnemyAttack } from "../components/attacks/enemy_attack"
import { Defender } from "../components/units/defender"
import { Melee } from "../components/units/melee"
import { IComponent } from "../core/component"
import { Swing } from "../components/attacks/swing"
import { Producer } from "../components/units/producer"
import { Sequencer } from "../core/sequencer";

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
  private textTimeRemaining: PIXI.Text
  private tilemap: CompositeTilemap

  private isPaused = false
  private isGameOver = false
  private placingUnitType: UnitType
  private occupiedTiles: string[] = []

  private balance: number = 1000
  private timeRemaining: number = 100
  private sequencer: Sequencer

  constructor(app: PIXI.Application, eventController: EventController) {
    super(STAGES.LEVEL_1, app, eventController, true)

    this.componentController = new ComponentController()
    
    this.fieldContainer = new PIXI.Container()
    this.fieldContainer.name = "fieldContainer"
    this.fieldContainer.sortableChildren = true
    this.stage.addChild(this.fieldContainer)

    // Tilemap
    this.tilemap = createTileMap()
    this.tilemap.zIndex = -1
    this.tilemap.x = (this.sceneWidth / 2) - 40 * CELL_HALF_SIZE
    this.tilemap.y = (this.sceneHeight / 2) - 40 * CELL_HALF_SIZE
    this.fieldContainer.addChild(this.tilemap)
    
    // Time remaining
    this.textTimeRemaining = new PIXI.Text(`${this.timeRemaining}`, {
      fontFamily: FONT_FAMILY,
      fontSize: 64,
      fill: 0xFFFFFF,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 7 
    });
    this.textTimeRemaining.anchor.set(0.5)
    this.textTimeRemaining.y = 55
    this.stage.addChild(this.textTimeRemaining)

    // Balance
    this.containerBalance = new PIXI.Container()
    this.containerBalance.name = "containerBalance"
    this.containerBalance.x = 30
    this.containerBalance.y = 20
    this.stage.addChild(this.containerBalance)
    this.textBalance = new PIXI.Text(`$${this.balance}`, {
      fontFamily: FONT_FAMILY,
      fontSize: 42,
      fill: 0xFFFFFF,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 7 
    });
    this.textBalance.anchor.set(0)
    this.containerBalance.addChild(this.textBalance)

    // Controls
    this.containerControls = new PIXI.Container()
    this.containerControls.name = "containerBalance"
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
    uiTileProducer.scale.x = 1.6
    uiTileProducer.scale.y = 1.6
    uiTileProducer.on("mouseenter", () => {
      uiTileProducer.scale.set(1.8)
      priceProducer.visible = true
    })
    uiTileProducer.on("mouseleave", () => {
      uiTileProducer.scale.set(1.6)
      priceProducer.visible = false
    })
    this.containerControls.addChild(uiTileProducer)
    const uiProducer = createSpriteProducer()
    uiProducer.name = "uiProducer"
    uiProducer.x = -1
    uiProducer.y = 10
    uiProducer.scale.x = 1
    uiProducer.scale.y = 1
    uiProducer.play()
    this.containerControls.addChild(uiProducer)
    const priceProducer = new PIXI.Text(`$10`, {
      fontFamily: FONT_FAMILY,
      fontSize: 24,
      fill: 0xFFFFFF,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 7 
    });
    priceProducer.visible = false
    priceProducer.anchor.set(0.5)
    priceProducer.y += 45
    this.containerControls.addChild(priceProducer)
    uiTileProducer.x = 0
    uiTileProducer.eventMode = "dynamic"
    uiTileProducer.on('pointerdown', () => {
      if (!this.isPaused) {
        this.componentController.get("Tile").forEach((tile: Tile )=> tile.showPlaceholder())
        this.placingUnitType = 'Producer'
        uiTemporary.removeChildren()
        uiTemporary.addChild(producerTemp)
      }
    })

    // Ranged
    const uiTileRanged = createSpriteUITile()
    uiTileRanged.name = "uiTile"
    uiTileRanged.scale.x = 1.6
    uiTileRanged.scale.y = 1.6
    uiTileRanged.on("mouseenter", () => {
      uiTileRanged.scale.set(1.8)
      priceRanged.visible = true
    })
    uiTileRanged.on("mouseleave", () => {
      uiTileRanged.scale.set(1.6)
      priceRanged.visible = false
    })
    this.containerControls.addChild(uiTileRanged)
    const uiRanged = createSpriteRanged()
    uiRanged.name = "uiRanged"
    uiRanged.scale.x = 1.3
    uiRanged.scale.y = 1.3
    uiRanged.x = 80
    uiRanged.play()
    this.containerControls.addChild(uiRanged)
    const priceRanged = new PIXI.Text(`$40`, {
      fontFamily: FONT_FAMILY,
      fontSize: 24,
      fill: 0xFFFFFF,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 7 
    });
    priceRanged.visible = false
    priceRanged.anchor.set(0.5)
    priceRanged.x = 80
    priceRanged.y += 45
    this.containerControls.addChild(priceRanged)
    uiTileRanged.x = 80
    uiTileRanged.eventMode = "dynamic"
    uiTileRanged.on('pointerdown', () => {
      if (!this.isPaused) {
        this.componentController.get("Tile").forEach((tile: Tile )=> tile.showPlaceholder())
        this.placingUnitType = 'Range'
        if (uiTemporary.children.length) uiTemporary.removeChildAt(0)
        uiTemporary.addChild(rangeTemp)
      }
    })

    // Melee
    const uiTileMelee = createSpriteUITile()
    uiTileMelee.name = "uiTile"
    uiTileMelee.scale.x = 1.6
    uiTileMelee.scale.y = 1.6
    uiTileMelee.on("mouseenter", () => {
      uiTileMelee.scale.set(1.8)
      priceMelee.visible = true
    })
    uiTileMelee.on("mouseleave", () => {
      uiTileMelee.scale.set(1.6)
      priceMelee.visible = false
    })
    this.containerControls.addChild(uiTileMelee)
    const uiMelee = createSpriteMelee()
    uiMelee.name = "uiMelee"
    uiMelee.scale.x = 0.9
    uiMelee.scale.y = 0.9
    uiMelee.x = 80 * 2 - 3
    uiMelee.y = 5
    uiMelee.play()
    this.containerControls.addChild(uiMelee)
    const priceMelee = new PIXI.Text(`$100`, {
      fontFamily: FONT_FAMILY,
      fontSize: 24,
      fill: 0xFFFFFF,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 7 
    });
    priceMelee.visible = false
    priceMelee.anchor.set(0.5)
    priceMelee.x = 80 * 2
    priceMelee.y += 45
    this.containerControls.addChild(priceMelee)
    uiTileMelee.x = 80 * 2
    uiTileMelee.eventMode = "dynamic"
    uiTileMelee.on('pointerdown', () => {
      if (!this.isPaused) {
        this.componentController.get("Tile").forEach((tile: Tile )=> tile.showPlaceholder())
        this.placingUnitType = 'Melee'
        if (uiTemporary.children.length) uiTemporary.removeChildAt(0)
        uiTemporary.addChild(meleeTemp)
      }
    })

    // Defender
    const uiTileDefender = createSpriteUITile()
    uiTileDefender.name = "uiTile"
    uiTileDefender.scale.x = 1.6
    uiTileDefender.scale.y = 1.6
    uiTileDefender.on("mouseenter", () => {
      uiTileDefender.scale.set(1.8)
      priceDefender.visible = true
    })
    uiTileDefender.on("mouseleave", () => {
      uiTileDefender.scale.set(1.6)
      priceDefender.visible = false
    })
    this.containerControls.addChild(uiTileDefender)
    const uiDefender = createDefenderSprite()
    uiDefender.name = "uiDefender"
    uiDefender.scale.x = 0.35
    uiDefender.scale.y = 0.35
    uiDefender.x = 80 * 3 + 2
    uiDefender.y = 7
    uiDefender.play()
    this.containerControls.addChild(uiDefender)
    const priceDefender = new PIXI.Text(`$300`, {
      fontFamily: FONT_FAMILY,
      fontSize: 24,
      fill: 0xFFFFFF,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 7 
    });
    priceDefender.visible = false
    priceDefender.anchor.set(0.5)
    priceDefender.x = 80 * 3
    priceDefender.y += 45
    this.containerControls.addChild(priceDefender)
    uiTileDefender.x = 80 * 3
    uiTileDefender.eventMode = "dynamic"
    uiTileDefender.on('pointerdown', () => {
      if (!this.isPaused) {
        this.componentController.get("Tile").forEach((tile: Tile )=> tile.showPlaceholder())
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
            this.spawUnit(uid, x, y, this.placingUnitType)
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

    const trees: PIXI.AnimatedSprite[] = []

    for (let row_index = -3; row_index < this.cellRows + 3; ++row_index) {
      for (let column_index = -4; column_index < this.cellColumns + 4; ++column_index) {
        if (row_index > -1 && row_index < this.cellRows + 1 && column_index > -1 && column_index < this.cellColumns ) {
          if (row_index > 0 && row_index < this.cellRows && column_index > 0 && column_index < this.cellColumns - 1 ) {
            if (Math.random() > 0.2) continue
            // Tile position
            const x = CELL_HALF_SIZE + column_index * CELL_SIZE  + Math.floor(Math.random() * 50) -  Math.floor(Math.random() * 50)
            const y = CELL_HALF_SIZE + row_index * CELL_SIZE + Math.floor(Math.random() * 50) -  Math.floor(Math.random() * 50)
            const flower = createRandomProp()
            flower.x = x
            flower.y = y
            flower.scale.x = Math.floor(Math.random() * 2) + 1.5
            flower.scale.y = flower.scale.x
            this.fieldContainer.addChild(flower)
          } else {
            if (Math.random() > 0.9) continue
            // Tile position
            const x = CELL_HALF_SIZE + column_index * CELL_SIZE  + Math.floor(Math.random() * 50) -  Math.floor(Math.random() * 50)
            const y = CELL_HALF_SIZE + row_index * CELL_SIZE + Math.floor(Math.random() * 50) -  Math.floor(Math.random() * 50)
            const flower = createRandomProp()
            flower.x = x
            flower.y = y
            flower.scale.x = Math.floor(Math.random() * 2) + 1.5
            flower.scale.y = flower.scale.x
            this.fieldContainer.addChild(flower)
          }
        } else {
          if (Math.random() > 0.7) continue
  
          // Tile position
          const x = CELL_HALF_SIZE + column_index * CELL_SIZE  + Math.floor(Math.random() * 50) -  Math.floor(Math.random() * 50)
          const y = CELL_HALF_SIZE + row_index * CELL_SIZE + Math.floor(Math.random() * 50) -  Math.floor(Math.random() * 50)
          const tree = createSpriteTree()
          tree.x = x
          tree.y = y
          tree.scale.x = Math.floor(Math.random() * 2) + 1.5
          tree.scale.y = tree.scale.x
          tree.zIndex = 9999
          this.fieldContainer.addChild(tree)
          tree.gotoAndPlay(Math.floor(Math.random() * 7))
          trees.push(tree)
        }
      }
    }
    this.fieldContainer.addChild(uiTemporary)

    // Initialize sequencer
    this.sequencer = new Sequencer()
    this.sequencer.repeatSequence("wave", [{
      duration: 200,
      callback: () => {
        this.spawnEnemy()
      }
    }])
    this.sequencer.repeatSequence("timer", [{
      duration: 60,
      callback: () => {
        this.timeRemaining--
        if (this.timeRemaining <= 0) {
          this.timeRemaining = 0
          this.eventController.emit(EVENTS.GAME_WON)
          this.sequencer.pause("timer")
          this.sequencer.pause("wave")
          this.componentController.get("Enemy").forEach(enemy => {
            enemy.hit(9999)
          })
        }
        this.textTimeRemaining.text = this.timeRemaining
      }
    }])
    
    // Events
    this.eventController.subscribe(EVENTS.GAME_OVER, this.stageName, () => {
      this.containerControls.visible = false
      this.textBalance.visible = false
      this.textTimeRemaining.visible = false
      this.isGameOver = true
      this.sequencer.pause("timer")
    })
    this.eventController.subscribe(EVENTS.GAME_WON, this.stageName, () => {
      this.containerControls.visible = false
      this.textBalance.visible = false
      this.textTimeRemaining.visible = false
      this.isGameOver = true
    })
    this.eventController.subscribe(EVENTS.PAUSE, this.stageName, () => {
      this.isPaused = true
      this.componentController.pause()
      this.containerControls.visible = false
      this.containerBalance.visible = false
      this.textTimeRemaining.visible = false
      uiRanged.stop()
      uiDefender.stop()
      uiMelee.stop()
      uiProducer.stop()
      trees.forEach(tree => tree.stop())
    })
    this.eventController.subscribe(EVENTS.UNPAUSE, this.stageName, () => {
      this.isPaused = false
      this.componentController.play()
      if (!this.isGameOver) {
        this.containerControls.visible = true
        this.containerBalance.visible = true
        this.textTimeRemaining.visible = true
      }
      uiRanged.play()
      uiDefender.play()
      uiMelee.play()
      uiProducer.play()
      trees.forEach(tree => tree.play())
    })
    this.eventController.subscribe(EVENTS.RESIZE, this.stageName, () => this.relayout())
  }

  spawUnit(uid: string, x: number, y: number, unitType: UnitType) {
    
    const onDie = () => {
      this.freeTile(uid)
    }

    switch (unitType) {
      case 'Producer': {
        if (this.balance < 10) return
        const onEarn = (money: number) => {
          this.balance += money
          this.textBalance.text = `$${this.balance}`
        }
        this.componentController.add(new Producer({ x, y }, this.fieldContainer, onEarn, onDie))
        this.balance -= 10
        this.textBalance.text = `$${this.balance}`
        break
      }
      case 'Melee': {
        if (this.balance < 100) return
        const onSwing = () => {
          this.componentController.add(new Swing({ x, y }, this.fieldContainer, 5))
        }
        this.componentController.add(new Melee({ x, y }, this.fieldContainer, onSwing, onDie))
        this.balance -= 100
        this.textBalance.text = `$${this.balance}`
        break
      }
      case 'Range': {
        if (this.balance < 40) return
        const onFireProjectile = () => {
          this.componentController.add(new Projectile({ x, y }, this.fieldContainer, 5))
        }
        this.componentController.add(new UnitRanged({ x, y }, this.fieldContainer, onFireProjectile, onDie))
        this.balance -= 40
        this.textBalance.text = `$${this.balance}`
        break
      }
      case 'Defender': {
        if (this.balance < 300) return
        this.componentController.add(new Defender({ x, y }, this.fieldContainer, onDie))
        this.balance -= 300
        this.textBalance.text = `$${this.balance}`
        break
      }
    }

    this.componentController.get("Tile").forEach((tile: Tile )=> tile.hidePlaceholder())
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
    this.componentController.add(new Enemy({
        x: CELL_SIZE * 13,
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
    const defender: Defender[] = this.componentController.get("Defender") as Defender[]
    
    const projectiles: Projectile[] = this.componentController.get("Projectile") as Projectile[]
    const swings: Swing[] = this.componentController.get("Swing") as Swing[]

    const enemies: Enemy[] = this.componentController.get("Enemy") as Enemy[]

    const enemyAttacks: EnemyAttack[] = this.componentController.get("EnemyAttack") as EnemyAttack[]

    const playerUnits = [...rangedUnits, ...melee, ...producer, ...defender] as IComponent[]
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
    this.textTimeRemaining.x = (this.app.screen.width / 2)
    this.containerControls.x = (this.app.screen.width / 2) - 80*3 / 2
    this.containerControls.y = (this.app.screen.height) - 70
    const factorX = (this.app.screen.width / (this.sceneWidth + 200))
    const factorY = (this.app.screen.height / (this.sceneHeight + 200))
    const factor = Math.min(factorX, factorY)
    this.fieldContainer.scale.x = factor
    this.fieldContainer.scale.y = factor
    this.fieldContainer.x = this.app.screen.width / 2 - (this.sceneWidth * factor) / 2
    this.fieldContainer.y = this.app.screen.height / 2 - (this.sceneHeight * factor) / 2
  }

  update(delta: number, isPaused: boolean) {
    super.update(delta, isPaused)
    if (!isPaused) {
      this.componentController.update(delta)
      this.checkForHits()
      this.sequencer.tick(delta)
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

import * as PIXI from "pixi.js"
import { CompositeTilemap } from '@pixi/tilemap';

import { EVENTS } from "../enums/events"
import { STAGES } from "../enums/stages"
import { CELL_HALF_SIZE, CELL_SIZE, FONT_FAMILY } from "../constants"

import { Stage } from "../core/stage"
import { ComponentController } from "../core/component_controller"
import { EventController } from "../core/event_controller"

import { createSpriteUIButton, createSpriteRanged, createSpriteStoneGolem, createSpriteWarrior, createSpriteBlacksmith, createSpriteTree, createSpriteFlower, createTileMap, createSpriteRock, createSpriteGrass, createSpriteHouse } from "../utils/sprites"
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
import { SecondTimer } from "../core/timer";
import { formatSeconds } from "../utils/time";
import { TimedAnimatedSprite } from "../core/timed_animated_sprite";
import { soundGameOver } from "../utils/sounds";
import { range, scatter } from "../utils/math";

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
  private timer: SecondTimer
  private uiTileProducer: PIXI.Sprite
  private uiTileRanged: PIXI.Sprite
  private uiTileMelee: PIXI.Sprite
  private uiTileDefender: PIXI.Sprite
  private uiTemporary: PIXI.Container
  private rangeTemp: TimedAnimatedSprite
  private meleeTemp: TimedAnimatedSprite
  private producerTemp: TimedAnimatedSprite
  private defenderTemp: TimedAnimatedSprite
  private trees: PIXI.AnimatedSprite[]

  private isPaused = false
  private isGameOver = false
  private placingUnitType: UnitType
  private occupiedTiles: string[] = []

  private balance: number = 50
  private timeRemaining: number = 100
  private sequencer: Sequencer
  
  constructor(app: PIXI.Application, eventController: EventController) {
    super(STAGES.LEVEL_1, app, eventController, true)

    this.componentController = new ComponentController()
    this.timer = new SecondTimer()
    
    this.fieldContainer = new PIXI.Container()
    this.fieldContainer.name = "fieldContainer"
    this.fieldContainer.sortableChildren = true
    this.stage.addChild(this.fieldContainer)

    // Tilemap
    this.tilemap = createTileMap({ x: this.sceneWidth / 2, y: this.sceneHeight / 2})
    this.fieldContainer.addChild(this.tilemap)
    
    // Time remaining
    this.textTimeRemaining = new PIXI.Text(formatSeconds(this.timeRemaining), {
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
    this.uiTemporary = new PIXI.Container()
    this.uiTemporary.alpha = 0.4
    this.uiTemporary.visible = false;
    this.rangeTemp = createSpriteRanged()
    this.rangeTemp.stop()
    this.meleeTemp = createSpriteWarrior()
    this.meleeTemp.stop()
    this.producerTemp = createSpriteBlacksmith()
    this.producerTemp.stop()
    this.defenderTemp = createSpriteStoneGolem()
    this.defenderTemp.stop()

    // Producer
    this.uiTileProducer = createSpriteUIButton()
    this.uiTileProducer.name = "uiTileProducer"
    this.uiTileProducer.scale.x = 1.6
    this.uiTileProducer.scale.y = 1.6
    this.uiTileProducer.on("mouseenter", () => {
      this.uiTileProducer.scale.set(1.8)
      priceProducer.visible = true
    })
    this.uiTileProducer.on("mouseleave", () => {
      this.placingUnitType !== 'Producer' && this.uiTileProducer.scale.set(1.6)
      priceProducer.visible = false
    })
    this.containerControls.addChild(this.uiTileProducer)
    const uiProducer = createSpriteBlacksmith()
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
    this.uiTileProducer.x = 0
    this.uiTileProducer.eventMode = "dynamic"
    this.uiTileProducer.on('pointerdown', () => this.selectProducer())

    // Ranged
    this.uiTileRanged = createSpriteUIButton()
    this.uiTileRanged.name = "uiTile"
    this.uiTileRanged.scale.x = 1.6
    this.uiTileRanged.scale.y = 1.6
    this.uiTileRanged.on("mouseenter", () => {
      this.uiTileRanged.scale.set(1.8)
      priceRanged.visible = true
    })
    this.uiTileRanged.on("mouseleave", () => {
      this.placingUnitType !== 'Range' && this.uiTileRanged.scale.set(1.6)
      priceRanged.visible = false
    })
    this.containerControls.addChild(this.uiTileRanged)
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
    this.uiTileRanged.x = 80
    this.uiTileRanged.eventMode = "dynamic"
    this.uiTileRanged.on('pointerdown', () => this.selectRanged())

    // Melee
    this.uiTileMelee = createSpriteUIButton()
    this.uiTileMelee.name = "uiTile"
    this.uiTileMelee.scale.x = 1.6
    this.uiTileMelee.scale.y = 1.6
    this.uiTileMelee.on("mouseenter", () => {
      this.uiTileMelee.scale.set(1.8)
      priceMelee.visible = true
    })
    this.uiTileMelee.on("mouseleave", () => {
      this.placingUnitType !== 'Melee' && this.uiTileMelee.scale.set(1.6)
      priceMelee.visible = false
    })
    this.containerControls.addChild(this.uiTileMelee)
    const uiMelee = createSpriteWarrior()
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
    this.uiTileMelee.x = 80 * 2
    this.uiTileMelee.eventMode = "dynamic"
    this.uiTileMelee.on('pointerdown', () => this.selectMelee())

    // Defender
    this.uiTileDefender = createSpriteUIButton()
    this.uiTileDefender.name = "uiTile"
    this.uiTileDefender.scale.x = 1.6
    this.uiTileDefender.scale.y = 1.6
    this.uiTileDefender.on("mouseenter", () => {
      this.uiTileDefender.scale.set(1.8)
      priceDefender.visible = true
    })
    this.uiTileDefender.on("mouseleave", () => {
      this.placingUnitType !== 'Defender' && this.uiTileDefender.scale.set(1.6)
      priceDefender.visible = false
    })
    this.containerControls.addChild(this.uiTileDefender)
    const uiDefender = createSpriteStoneGolem()
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
    this.uiTileDefender.x = 80 * 3
    this.uiTileDefender.eventMode = "dynamic"
    this.uiTileDefender.on('pointerdown', () => this.selectDefender())

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
          }
        }
        const onMouseOver = (uid: string) => {
          if (!this.isPaused && this.placingUnitType && this.isTileFree(uid)) {
            this.uiTemporary.x = x
            this.uiTemporary.y = y
            this.uiTemporary.visible = true
          }
        }

        // Add tile
        this.componentController.add(new Tile({ x, y }, this.fieldContainer, onPointerDown, onMouseOver))
      }
    }

    this.fieldContainer.addChild(this.uiTemporary)

    this.decorate()

    // Initialize sequencer
    this.sequencer = new Sequencer()
    this.sequencer.repeatSequence("wave", [
      ...(
        Array(9).fill(true).map(() => ({
            duration: 5,
            ticker: this.timer.getTicker(),
            callback: () => {this.spawnEnemy()}
        }))
      ),
      ...(
        Array(5).fill(true).map(() => ({
          duration: 1,
          ticker: this.timer.getTicker(),
          callback: () => {this.spawnEnemy(); this.spawnEnemy()}
        }))
      ),
      ...(
        Array(6).fill(true).map(() => ({
            duration: 5,
            ticker: this.timer.getTicker(),
            callback: () => {this.spawnEnemy()}
        }))
      ),
      ...(
        Array(20).fill(true).map(() => ({
          duration: 1,
          ticker: this.timer.getTicker(),
          callback: () => {this.spawnEnemy(); this.spawnEnemy(); this.spawnEnemy()}
        }))
      ),
    ])
    this.sequencer.repeatSequence("timer", [{
      duration: 1,
      ticker: this.timer.getTicker(),
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
        this.textTimeRemaining.text = formatSeconds(this.timeRemaining)
        if (this.timeRemaining < 6) {
          this.textTimeRemaining.style.fill = 0xFF4444
          this.textTimeRemaining.style.stroke = 0x441100
        }
      }
    }])
    
    // Events
    this.eventController.subscribe(EVENTS.GAME_OVER, this.stageName, () => {
      this.containerControls.visible = false
      this.textBalance.visible = false
      this.textTimeRemaining.visible = false
      this.sequencer.pause("timer")
      this.isGameOver = true
      soundGameOver.play()
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
      this.trees.forEach(tree => tree.stop())
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
      this.trees.forEach(tree => tree.play())
    })
    this.eventController.subscribe(EVENTS.KEY_PRESS, this.stageName, (key: string) => {
      switch (key) {
        case "1": 
          this.selectProducer()
          break
        case "2":
          this.selectRanged()
          break
        case "3":
          this.selectMelee()
          break
        case "4":
          this.selectDefender()
          break
        default: return
      }
    })
    this.eventController.subscribe(EVENTS.RESIZE, this.stageName, () => this.relayout())
  }

  /**
   * Set dressing
   */

  decorate() {

    // Trees
    this.trees =
      scatter(CELL_SIZE, { left: -1, width: 11, top: 0, height: 6 }, 4, 40)
      .map(({ x, y }) => {
        const tree: PIXI.AnimatedSprite = createSpriteTree()
        tree.position.set(x, y)
        const scale = range(0.3, 0.6)
        tree.scale.set(scale)
        tree.zIndex = Math.floor(y)
        this.fieldContainer.addChild(tree)
        return tree
      })

    // Flowers
    scatter(CELL_SIZE, { left: 0, width: 10, top: 0, height: 5 }, 4, 40, false)
    .filter(() => Math.random() > 0.7)
    .map(({ x, y }) => {
      const prop = createSpriteFlower()
      prop.position.set(x, y)
      const scale = range(4, 6) / 10
      prop.scale.set(scale)
      prop.scale.x *= Math.random() > 0.5 ? 1 : -1
      prop.zIndex = Math.floor(y)
      this.fieldContainer.addChild(prop)
      return prop
    })

    // Rocks
    scatter(CELL_SIZE, { left: 0, width: 10, top: 0, height: 5 }, 4, 40, false)
    .filter(() => Math.random() > 0.9)
    .map(({ x, y }) => {
      const prop = createSpriteRock()
      prop.position.set(x, y)
      const scale = range(9, 11) / 10
      prop.scale.set(scale)
      prop.scale.x *= Math.random() > 0.5 ? 1 : -1
      prop.zIndex = Math.floor(y)
      this.fieldContainer.addChild(prop)
      return prop
    })

    // Grass patches
    scatter(CELL_SIZE, { left: 0, width: 10, top: 0, height: 5 }, 4, 40, false)
    .filter(() => Math.random() > 0.5)
    .map(({ x, y }) => {
      const prop = createSpriteGrass()
      prop.position.set(x, y)
      const scale = range(5, 10) / 10
      prop.scale.set(scale)
      prop.scale.x *= Math.random() > 0.5 ? 1 : -1
      prop.zIndex = Math.floor(y)
      this.fieldContainer.addChild(prop)
      return prop
    })

    // House
    if (Math.random() > 0.8) {
      const prop = createSpriteHouse()
      const x = range(0, 10) * CELL_SIZE
      const y = ((Math.random() > 0.5) ? -1 : 8) * CELL_SIZE + 30
      prop.position.set(x, y)
      prop.zIndex = Math.floor( y)
      this.fieldContainer.addChild(prop)
    }
  }

  /**
   * Spawning units
   */

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

    this.placingUnitType = null
    this.uiTemporary.visible = false
    this.uiTemporary.removeChildren()
    this.occupyTile(uid)
    this.componentController.get("Tile").forEach((tile: Tile )=> tile.hidePlaceholder())
    this.uiTileProducer.scale.set(1.6)
    this.uiTileRanged.scale.set(1.6)
    this.uiTileMelee.scale.set(1.6)
    this.uiTileDefender.scale.set(1.6)
  }

  selectProducer() {
    if (!this.isPaused) {
      this.uiTileRanged.scale.set(1.6)
      this.uiTileMelee.scale.set(1.6)
      this.uiTileDefender.scale.set(1.6)
      this.uiTileProducer.scale.set(1.8)
      this.componentController.get("Tile").forEach((tile: Tile )=> tile.showPlaceholder())
      this.placingUnitType = 'Producer'
      this.uiTemporary.removeChildren()
      this.uiTemporary.addChild(this.producerTemp)
    }
  }

  selectMelee() {
    if (!this.isPaused) {
      this.uiTileProducer.scale.set(1.6)
      this.uiTileRanged.scale.set(1.6)
      this.uiTileDefender.scale.set(1.6)
      this.uiTileMelee.scale.set(1.8)
      this.componentController.get("Tile").forEach((tile: Tile )=> tile.showPlaceholder())
      this.placingUnitType = 'Melee'
      if (this.uiTemporary.children.length) this.uiTemporary.removeChildAt(0)
      this.uiTemporary.addChild(this.meleeTemp)
    }
  }

  selectRanged() {
    if (!this.isPaused) {
      this.uiTileProducer.scale.set(1.6)
      this.uiTileMelee.scale.set(1.6)
      this.uiTileDefender.scale.set(1.6)
      this.uiTileRanged.scale.set(1.8)
      this.componentController.get("Tile").forEach((tile: Tile )=> tile.showPlaceholder())
      this.placingUnitType = 'Range'
      if (this.uiTemporary.children.length) this.uiTemporary.removeChildAt(0)
      this.uiTemporary.addChild(this.rangeTemp)
    }
  }

  selectDefender() {
    if (!this.isPaused) {
      this.uiTileProducer.scale.set(1.6)
      this.uiTileRanged.scale.set(1.6)
      this.uiTileMelee.scale.set(1.6)
      this.uiTileDefender.scale.set(1.8)
      this.componentController.get("Tile").forEach((tile: Tile )=> tile.showPlaceholder())
      this.placingUnitType = 'Defender'
      if (this.uiTemporary.children.length) this.uiTemporary.removeChildAt(0)
     this.uiTemporary.addChild(this.defenderTemp)
    }
  }

  spawnEnemy() {
    const onAttack = ({ x, y }: Coordinates, damage: number) => {
      this.componentController.add(new EnemyAttack({ x, y }, this.fieldContainer, damage))
    }
    const onReachEnd = () => {
      if (!this.isGameOver) {
        this.eventController.emit(EVENTS.GAME_OVER)
      }
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

  /**
   * Tile state management
   */

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

  /**
   * Collision handling
   */

  collide() {
    const enemies = this.componentController.get("Enemy") as Enemy[]
    const units = this.componentController.get("UnitRanged", "Melee", "Producer", "Defender") as IComponent[]
    const enemyAttacks = this.componentController.get("EnemyAttack") as EnemyAttack[]
    const unitAttacks = this.componentController.get("Projectile", "Swing") as IComponent[]
   
    for (let i = 0; i < enemies.length; ++i) {
      const enemy = enemies[i]
      if (enemy.shouldBeUnmounted) continue
      // Check unit attacks for reaching enemies
      for (let j = 0; j < unitAttacks.length; ++j) {
        const playerDamagingZone = unitAttacks[j]
        if (playerDamagingZone.shouldBeUnmounted) continue
        if (playerDamagingZone.isIntersecting(enemy)) {
          enemy.hit(playerDamagingZone.getDamage())
          playerDamagingZone.attack()
        }
      }
      // Check for units in close proximity to enemies
      for (let j = 0; j < units.length; ++j) {
        const playerUnit: IComponent = units[j]
        if (playerUnit.shouldBeUnmounted) continue
        if (playerUnit.isIntersecting(enemy)) {
          enemy.attack()
          playerUnit.attack()
        }
      }
    }

    // Check enemy attacks for reaching units
    for (let i = 0; i < units.length; ++i) {
      const playerUnit = units[i]
      if (playerUnit.shouldBeUnmounted) continue
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
      this.collide()
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

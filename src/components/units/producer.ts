import * as PIXI from "pixi.js"

import { Component } from "../../core/component"
import { Sequencer } from "../../core/sequencer"
import { CollisionRegion } from "../../core/collision_region"
import { TimedAnimatedSprite } from "../../core/timed_animated_sprite"
import { createSpriteBlacksmith, createSpriteAnvil } from "../../utils/sprites"
import { FONT_FAMILY } from "../../constants"
import { soundAnvil, soundScream } from "../../utils/sounds"

export class Producer extends Component {

  private componentContainer: PIXI.Container
  private sprite: TimedAnimatedSprite
  private anvil: PIXI.AnimatedSprite

  // Sprite specifics
  private sequencer: Sequencer
  private health: number = 2
  private profitability: number = 10
  private onEarn: (money: number) => void
  private onDie: VoidFunction

  /// #if DEBUG
  private debug_health: PIXI.Text
  /// #endif

  constructor({ x, y }: Coordinates, container: PIXI.Container, onEarn: (money: number) => void, onDie?: VoidFunction) {
    // Super constructor
    super("Producer")

    // Store arguments
    this.onEarn = onEarn
    this.onDie = onDie

    // Initialize component
    this.componentContainer = new PIXI.Container()
    this.componentContainer.x = x
    this.componentContainer.y = y
    this.componentContainer.scale.x = 2
    this.componentContainer.scale.y = 2
    container.addChild(this.componentContainer)
    this.anvil = createSpriteAnvil()
    this.anvil.y += 15
    this.anvil.stop()
    this.anvil.loop = false
    this.componentContainer.addChild(this.anvil)
    this.sprite = createSpriteBlacksmith()
    this.sprite.name = this.UID
    this.sprite.loop = true
    this.sprite.play()
    this.componentContainer.addChild(this.sprite)

    // Filters
    const lightFilter = new PIXI.ColorMatrixFilter()
    lightFilter.matrix = [ 
      1, 0, 0, 0, 0.15, 
      0, 1, 0, 0, 0.15, 
      0, 0, 1, 0, 0.15, 
      0, 0, 0, 1, 0
    ];

    // Initialize sequencer
    this.sequencer = new Sequencer()

    this.sequencer.repeatSequence("anvil", [{
      duration: 0,
      callback: () => {
        this.anvil.gotoAndPlay(0)
      }
    }, {
      duration: 100,
      callback: () => {}
    }])

    this.sequencer.repeatSequence("produce", [{
      duration: 0,
      callback: () => {
        this.sprite.switch("idle")
        this.sprite.gotoAndPlay(0)
      }
    }, {
      duration: 50,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.sprite.switch("produce")
        this.sprite.gotoAndPlay(0)
      }
    }, {
      duration: 13,
      ticker: this.sprite.getTicker(),
      callback: () => {
        soundAnvil.play()
      }
    }, {
      duration: 10,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.onEarn(this.profitability)
      }
    }])

    this.sequencer.repeatSequence("hurt", [{
      duration: 0,
      callback: () => {
        this.sprite.filters = [lightFilter]
      }
    },{
      duration: 10,
      ticker: this.sprite.getTicker(),
      callback: () => {
        this.sprite.filters = []
        this.sequencer.pause("hurt")
        this.sequencer.unpause("produce")
      }
    }], true)

    this.sequencer.onceSequence("death", [{
      duration: 0,
      callback: () => {
        this.onDie && this.onDie()
        // More fun this way
        // this.shouldBeUnmounted = true
        this.sprite.visible = false
        soundScream.play()
        /// #if DEBUG
        collider.visible = false
        this.debug_health.visible = false
        /// #endif
      }
    }], true)

    /// #if DEBUG
    const collider = new PIXI.Graphics()
    collider.lineStyle(2, 0xff0000)
    collider.drawCircle(2, -5, this.getCollisionRegion().radius)
    collider.endFill()
    collider.scale.set(0.5)
    this.sprite.addChild(collider)
    this.debug_health = new PIXI.Text(`HP:${this.health}`, {
      fontFamily: FONT_FAMILY,
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
      stroke: 0x14402f,
      strokeThickness: 5
    })
    this.debug_health.anchor.set(0.5)
    this.debug_health.y -= 40
    this.debug_health.scale.x = 0.5
    this.debug_health.scale.y = 0.5
    this.sprite.addChild(this.debug_health)
    /// #endif
  }

  hit(damage: number) {
    this.health -= damage
    if (this.health <= 0) {
      if (this.sequencer.isPaused("death")) {
        this.sequencer.pause("produce")
        this.sequencer.pause("hurt")
        this.sequencer.unpause("death")
      }
    } else {
      if (this.sequencer.isPaused("hurt")) {
        this.sequencer.unpause("hurt")
      }
    }

    /// #if DEBUG
    this.debug_health.text = `HP:${this.health}`
    /// #endif
  }

  update(delta: number) {
    this.sequencer.tick(delta)
  }

  pause() {
    this.sprite.stop()
  }

  play() {
    this.sprite.play()
  }

  unmount() {
    super.unmount()
    this.sprite.destroy()
    this.anvil.destroy()
    this.componentContainer.destroy()
  }

  getCollisionRegion(): CollisionRegion {
    return this.health <= 0 ? null : {
      center: {
        x: this.componentContainer.x + 2,
        y: this.componentContainer.y - 5,
      },
      radius: 30,
    }
  }
}

import * as PIXI from "pixi.js"
import { Component } from "../../core/component"
import { Sequencer } from "../../core/sequencer"
import { createSpriteStoneGolem } from "../../utils/sprites"
import { CollisionRegion } from "../../core/collision_region"
import { FONT_FAMILY } from "../../constants"
import { TimedAnimatedSprite } from "../../core/timed_animated_sprite"

export class Defender extends Component {

  private sprite: TimedAnimatedSprite

  // Sprite specifics
  private sequencer: Sequencer
  private health: number = 50
  private onDie: VoidFunction

  /// #if DEBUG
  private debug_health: PIXI.Text
  /// #endif

  constructor({ x, y }: Coordinates, container: PIXI.Container, onDie?: VoidFunction) {
    // Super constructor
    super("Defender")

    // Store arguments
    this.onDie = onDie

    // Initialize component
    this.sprite = createSpriteStoneGolem()
    this.sprite.name = this.UID
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.zIndex = Math.floor(y)
    this.sprite.gotoAndPlay(0)
    container.addChild(this.sprite)

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

    this.sequencer.repeatSequence("idle", [{
      duration: 0,
      callback: () => {
        this.sprite.switch("idle")
        this.sprite.gotoAndPlay(0)
      }
    }, {
      duration: 8,
      ticker: this.sprite.getTicker(),
      callback: () => {}
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
        this.sequencer.unpause("idle")
      }
    }], true)

    this.sequencer.onceSequence("death", [{
      duration: 0,
      callback: () => {
        this.onDie && this.onDie()
        this.shouldBeUnmounted = true
        /// #if DEBUG
        collider.visible = false
        this.debug_health.visible = false
        /// #endif
      }
    }], true)

    /// #if DEBUG
    const collider = new PIXI.Graphics()
    collider.lineStyle(2, 0xff0000)
    collider.drawCircle(0, -20, this.getCollisionRegion().radius)
    collider.endFill()
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
    this.debug_health.y = -40
    this.sprite.addChild(this.debug_health)
    /// #endif
  }

  hit(damage: number) {
    this.health -= damage
    if (this.health <= 0) {
      if (this.sequencer.isPaused("death")) {
        this.sequencer.pause("idle")
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
  }

  getCollisionRegion(): CollisionRegion {
    return this.health <= 0 ? null : {
      center: {
        x: this.sprite.x,
        y: this.sprite.y - 20,
      },
      radius: 30,
    }
  }
}

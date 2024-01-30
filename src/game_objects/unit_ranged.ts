import * as PIXI from "pixi.js"
import { GameObject } from "../controllers/game_object_controller"
import { createSpriteRanged } from "../utils/sprites"

export class UnitRanged implements GameObject {
  public UID: string
  public shouldBeUnmounted: false

  private sprite: PIXI.AnimatedSprite
  private projectileTimer = 0

  constructor({ x, y }: Coordinates, container: PIXI.Container) {
    this.sprite = createSpriteRanged()
    this.sprite.x = x
    this.sprite.y = y
    container.addChild(this.sprite)
  }

  lshouldBeUnmounted = false

  update(delta: number) {
    this.projectileTimer += delta
    if (this.projectileTimer >= 80) {
      this.projectileTimer = 0
      console.log("GameObjectController.add(createProjectile(container, this.sprite.x, this.sprite.y))")
    }
  }

  unmount() {
    this.sprite.destroy()
  }


  pause() {
    this.sprite.stop()
  }

  play() {
    this.sprite.play()
  }
}


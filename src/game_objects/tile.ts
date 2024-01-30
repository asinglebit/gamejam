import * as PIXI from "pixi.js"
import { GameObject } from "../controllers/game_object_controller"
import { createSpriteTile } from "../utils/sprites"
import { nanoid } from 'nanoid'


export class Tile implements GameObject {
  public UID: string
  public shouldBeUnmounted: boolean

  private sprite: PIXI.Sprite

  public isPlacing = false
  public isOccupied = false

  constructor({ x, y}: Coordinates, container: PIXI.Container) {
    this.UID = `Tile_${nanoid()}`
    this.shouldBeUnmounted = false
    this.sprite = createSpriteTile()
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.interactive = true

    container.addChild(this.sprite)
  }

  update(dt: number){}

  unmount() {
    this.sprite.destroy()
  }

}
import * as PIXI from "pixi.js"
import { GameObject } from "../controllers/game_object_controller"
import { createSpriteTile } from "../utils/sprites"
import { nanoid } from 'nanoid'


export class Tile extends GameObject {
  public isPlacing = false
  public isOccupied = false

  constructor({ x, y}: Coordinates, container: PIXI.Container) {
    super()

    this.UID = `Tile_${nanoid()}`
    this.shouldBeUnmounted = false
    this.sprite = createSpriteTile()
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.interactive = true

    container.addChild(this.sprite)
  }
}
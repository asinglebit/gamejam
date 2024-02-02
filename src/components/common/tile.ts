import * as PIXI from "pixi.js"

import { Component } from "../../core/component"

import { createSpriteTile } from "../../utils/sprites"

export class Tile extends Component {

  private sprite: PIXI.Sprite

  constructor(
    { x, y}: Coordinates,
    container: PIXI.Container,
    onPointerDown?: (uid: string) => void,
    onMouseOver?: (uid: string) => void
  ) {

    // Super constructor
    super("Tile")
    
    // Initialize component
    this.sprite = createSpriteTile()
    this.sprite.name = this.UID
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.eventMode = "dynamic"
    container.addChild(this.sprite)

    // Setup interactive callbacks
    if (onPointerDown) {
      this.sprite.eventMode = "dynamic"
      this.sprite.on("pointerdown", () => onPointerDown(this.UID))
    }
    if (onMouseOver) {
      this.sprite.eventMode = "dynamic"
      this.sprite.on("mouseover", () => onMouseOver(this.UID))
    }
  }

  unmount() {
    super.unmount()
  }
}

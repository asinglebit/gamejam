import * as PIXI from "pixi.js"

import { Component } from "../core/component"

import { createSpriteTile } from "../utils/sprites"

export class Tile extends Component {

  private sprite: PIXI.Sprite

  constructor({ x, y}: Coordinates, container: PIXI.Container) {

    // Super constructor
    super("Tile")
    
    // Initialize component
    this.sprite = createSpriteTile()
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.interactive = true
    container.addChild(this.sprite)
  }

  unmount() {
    super.unmount()
  }
}

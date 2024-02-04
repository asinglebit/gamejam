import * as PIXI from "pixi.js"

import { Component } from "../../core/component"
import { createSpriteShadow } from "../../utils/sprites";
import { CELL_SIZE } from "../../constants";

export class Tile extends Component {

  private sprite: PIXI.Sprite
  private shadow: PIXI.Sprite

  constructor(
    { x, y}: Coordinates,
    container: PIXI.Container,
    onPointerDown?: (uid: string) => void,
    onMouseOver?: (uid: string) => void
  ) {

    // Super constructor
    super("Tile")
    
    // Initialize component
    this.sprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
    this.sprite.width = CELL_SIZE;
    this.sprite.height = CELL_SIZE;
    this.sprite.tint = 0xFF0000;
    this.sprite.name = this.UID
    this.sprite.anchor.set(0.5)
    this.sprite.alpha = 0
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.eventMode = "dynamic"
    container.addChild(this.sprite)
    this.shadow = createSpriteShadow()
    this.shadow.x = x
    this.shadow.y = y
    this.shadow.alpha = 0.5
    this.shadow.zIndex = 0
    this.shadow.visible = false
    container.addChild(this.shadow)

    // Setup interactive callbacks
    if (onPointerDown) {
      this.sprite.on("pointerdown", () => onPointerDown(this.UID))
    }
    if (onMouseOver) {
      this.sprite.on("mouseover", () => onMouseOver(this.UID))
    }
  }

  showPlaceholder() {
    this.shadow.visible = true
  }

  hidePlaceholder() {
    this.shadow.visible = false
  }

  unmount() {
    super.unmount()
    this.sprite.destroy()
    this.shadow.destroy()
  }
}

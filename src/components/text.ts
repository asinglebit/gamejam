import * as PIXI from "pixi.js"

import { Component } from "../core/component"

type TextProps = {
  text: string
  color: string | number
  hidden?: boolean
}

export class Text extends Component {

  private sprite: PIXI.Sprite

  constructor(
    { text, color, hidden }: TextProps,
    { x, y }: Coordinates,
    container: PIXI.Container,
    onClick?: VoidFunction
  ) {

    // Super constructor
    super("Text")

    // Initialize component
    this.sprite = new PIXI.Text(text, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: color,
      align: "center",
    })
    this.sprite.name = this.UID
    const bounds = this.sprite.getLocalBounds()
    this.sprite.x = x - bounds.width / 2
    this.sprite.y = y - bounds.height / 2
    if (hidden) this.sprite.visible = false
    container.addChild(this.sprite)

    // Setup interactive callbacks
    if (onClick) {
      this.sprite.cursor = "pointer"
      this.sprite.eventMode = "dynamic"
      this.sprite.on("pointerdown", onClick)
    }
  }

  unmount() {
    super.unmount()
  }

  hide() {
    this.sprite.visible = false
  }

  show() {
    this.sprite.visible = true
  }
}

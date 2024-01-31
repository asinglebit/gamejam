import * as PIXI from "pixi.js"
import { GameObject } from "../core/game_object"
import { nanoid } from "nanoid"

type TextProps = {
  text: string
  color: string | number
  hidden?: boolean
}

export class Text extends GameObject {
  private sprite: PIXI.Sprite

  constructor(
    { text, color, hidden }: TextProps,
    { x, y }: Coordinates,
    container: PIXI.Container,
    onClick?: VoidFunction
  ) {

    // Super constructor
    super()

    // Initialize game object
    this.UID = `Text_${nanoid()}`
    this.sprite = new PIXI.Text(text, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: color,
      align: "center",
    })
    const bounds = this.sprite.getLocalBounds()
    this.sprite.x = x - bounds.width / 2
    this.sprite.y = y - bounds.height / 2
    if (hidden) this.sprite.visible = false
    container.addChild(this.sprite)

    if (onClick) {
      this.sprite.cursor = "pointer"
      this.sprite.eventMode = "dynamic"
      this.sprite.on("pointerdown", onClick)
    }
  }

  unmount(): void {
    super.unmount()
  }

  hide() {
    this.sprite.visible = false
  }

  show() {
    this.sprite.visible = true
  }
}

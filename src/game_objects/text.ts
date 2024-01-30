import * as PIXI from "pixi.js"
import { GameObject } from "../controllers/game_object_controller"
import { EventController, EventType } from "../controllers/event_controller"

type CreateTextProps = {
  hidden?: boolean
  color: string | number
  container: PIXI.Container
  placement: Coordinates
  title: string
  EventController?: EventController
  eventClick?: EventType
}

type TextProps = {
  text: string
  color: string | number
  hidden?: boolean
}

export class Text implements GameObject {
  public UID: string
  public shouldBeUnmounted: false

  private text: PIXI.Text

  constructor({ text, color, hidden }: TextProps, { x, y }: Coordinates, container: PIXI.Container, eventController?: EventController, eventClick?: EventType) {
    this.text = new PIXI.Text(text, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: color,
      align: "center",
    })

    const bounds = this.text.getLocalBounds()

    this.text.x = x - bounds.width / 2
    this.text.y = y - bounds.height / 2
    if (hidden) this.text.visible = false
    container.addChild(this.text)

    if (eventController && eventClick) {
      this.text.cursor = "pointer"
      this.text.eventMode = "dynamic"
      this.text.on("pointerdown", () => {
        eventController.emit(eventClick.type, eventClick.payload)
      })
    }
  }

  update(dt: number) { }

  unmount() {
    this.text.destroy()
  }

  hide() {
    this.text.visible = false
  }

  show() {
    this.text.visible = true
  }

  // place({ x, y }: Coordinates) {
  //   const bounds = this.text.getLocalBounds()
  //   this.text.x = x - bounds.width / 2
  //   this.text.y = y - bounds.height / 2
  // }
}

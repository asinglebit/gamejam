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

export const createText = ({
  hidden,
  color,
  container,
  placement,
  title,
  EventController,
  eventClick,
}: CreateTextProps): GameObject => {
  // Construction
  const text = new PIXI.Text(title, {
    fontFamily: "Arial",
    fontSize: 24,
    fill: color,
    align: "center",
  })
  const bounds = text.getLocalBounds()
  text.x = placement.x - bounds.width / 2
  text.y = placement.y - bounds.height / 2
  if (hidden) text.visible = false
  container.addChild(text)

  // Events

  if (EventController && eventClick) {
    text.cursor = "pointer"
    text.eventMode = "dynamic"
    text.on("pointerdown", () => {
      EventController.emit(eventClick.type, eventClick.payload)
    })
  }

  // Methods

  const update = (dt: number) => {}

  const unmount = () => {
    text.destroy()
  }

  const hide = () => {
    text.visible = false
  }

  const show = () => {
    text.visible = true
  }

  const place = ({ x, y }: Coordinates) => {
    text.x = x - bounds.width / 2
    text.y = y - bounds.height / 2
  }

  // Api

  return {
    shouldBeUnmounted: () => false,
    update,
    unmount,
    hide,
    show,
    place,
  }
}

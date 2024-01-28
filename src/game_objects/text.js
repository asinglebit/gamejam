import * as PIXI from "pixi.js"

export const createText = ({
  hidden,
  color,
  container,
  placement,
  title,
  EventController,
  eventClick
}) => {

  // Construction
  const text = new PIXI.Text(title, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: color,
    align: 'center',
  });
  const bounds = text.getLocalBounds()
  text.x = placement.x - bounds.width / 2
  text.y = placement.y - bounds.height / 2
  if (hidden) text.visible = false
  container.addChild(text)

  // Events

  if (EventController) {
    if (eventClick) {
      text.cursor = 'pointer'
      text.eventMode = "dynamic"
      text.on("click", () => {
        EventController.emit(eventClick.type, eventClick.payload)
      })
    }
  }
  
  // Methods

  const update = (delta) => {}

  const unmount = () => {
    text.destroy()
  }

  const hide = () => {
    text.visible = false
  }

  const show = () => {
    text.visible = true
  }

  // Api

  return {
    shouldBeUnmounted: () => false,
    update,
    unmount,
    hide,
    show
  }
}
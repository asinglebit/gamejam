import * as PIXI from "pixi.js"

import { EVENTS } from "../enums/events"
import { STAGES } from "../enums/stages"

import { Component } from "../core/component"
import { EventController } from "../core/event_controller"

import { Text } from "."

export class PauseOverlay extends Component {
  
  private app: PIXI.Application
  private container: PIXI.Container
  private text_result: PIXI.Text
  private eventController: EventController
  private stage: PIXI.Container

  constructor(app: PIXI.Application, stage: PIXI.Container, eventController: EventController) {

    // Super constructor
    super("PauseOverlay")

    // Store arguments
    this.app = app
    this.stage = stage
    this.eventController = eventController
  
    // Initialize component
    this.container = new PIXI.Container()
    this.container.name = this.UID
    this.container.zIndex = 9999
    this.stage.addChild(this.container)

    // Game result container
    const text_result = new PIXI.Text(`Game Over`, {
      fontFamily: "Arial",
      fontSize: 42,
      fill: 0xFF0000,
      align: "center",
      strokeThickness: 2
    });
    text_result.anchor.set(0.5)
    text_result.x = app.screen.width / 2
    text_result.y = app.screen.height / 2 - 60
    text_result.visible = false
    this.container.addChild(text_result)

    // Pause button container
    const container_pause = new PIXI.Container()
    container_pause.name = "container_pause"
    container_pause.x = this.app.screen.width - 40
    container_pause.y = 42
    this.container.addChild(container_pause)

    // Pause button
    const pause_button = new Text(
      { text: "||", color: 0xffffff, },
      { x: 0, y: 0, },
      container_pause,
      () => this.eventController.emit(EVENTS.PAUSE)
    )

    // Pause menu container
    const container_menu = new PIXI.Container()
    container_menu.name = "container_menu"
    container_menu.x = this.app.screen.width / 2
    container_menu.y = this.app.screen.height / 2
    this.container.addChild(container_menu)

    // Pause menu
    const play_button = new Text(
      { text: "Resume", color: 0x000000, hidden: true },
      { x: 0, y: -30, },
      container_menu,
      () => this.eventController.emit(EVENTS.UNPAUSE)
    )
    const restart_button = new Text(
      { text: "Restart Level", hidden: true, color: 0x000000 },
      { x: 0, y: 0 },
      container_menu,
      () => this.eventController.emit(EVENTS.RELOAD_STAGE)
    )
    const menu_button = new Text(
      { text: "Return to Menu", hidden: true, color: 0x000000 },
      { x: 0, y: 30 },
      container_menu,
      () => this.eventController.emit(EVENTS.CHANGE_STAGE, STAGES.MENU)
    )

    // Events
    this.eventController.subscribe(EVENTS.GAME_OVER, this.UID, () => {
      text_result.visible = true
      pause_button.hide()
      play_button.hide()
      restart_button.show()
      menu_button.show()
    })
    this.eventController.subscribe(EVENTS.PAUSE, this.UID, () => {
      text_result.visible = false
      pause_button.hide()
      play_button.show()
      restart_button.show()
      menu_button.show()
    })
    this.eventController.subscribe(EVENTS.UNPAUSE, this.UID, () => {
      text_result.visible = false
      pause_button.show()
      play_button.hide()
      restart_button.hide()
      menu_button.hide()
    })
    this.eventController.subscribe(EVENTS.RESIZE, this.UID, () => {
      container_pause.x = this.app.screen.width - 40
      container_pause.y = 40
      container_menu.x = this.app.screen.width / 2
      container_menu.y = this.app.screen.height / 2
      text_result.x = app.screen.width / 2
      text_result.y = app.screen.height / 2 - 60
    })
  }

  unmount () {
    if (this.container) this.container.destroy(true)
    this.eventController.unsubscribe(this.UID)
  }
}

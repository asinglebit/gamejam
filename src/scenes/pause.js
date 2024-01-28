import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { createText } from "../game_objects"
import * as Events from "../constants/events"
import * as Scenes from "../constants/scenes"

export const createScenePause = (app, EventController) => {

    /**
     * Construction
     */

    // Game object controller
    const GameObjectController = createGameObjectController()
    let container = null

    /**
     * Methods
     */

    const mount = () => {
        // Stage
        container = new PIXI.Container()
        container.width = app.screen.width
        container.height = app.screen.height
        app.stage.addChild(container)
        // Levels
        const pause_button = createText({
            container,
            color: 0xFFFFFF,
            placement: {
                x: app.screen.width - 50,
                y: 50
            },
            title: "||",
            EventController,
            eventClick: {
                type: Events.ENTER_PAUSE_MENU
            }
        })
        const play_button = createText({
            hidden: true,
            color: 0x000000,
            container,
            placement: {
                x: app.screen.width / 2,
                y: 250
            },
            title: "Resume",
            EventController,
            eventClick: {
                type: Events.LEAVE_PAUSE_MENU
            }
        })
        const restart_button = createText({
            hidden: true,
            color: 0x000000,
            container,
            placement: {
                x: app.screen.width / 2,
                y: 250 + 30
            },
            title: "Restart Level",
            EventController,
            eventClick: {
                type: Events.RELOAD_SCENES
            }
        })
        const menu_button = createText({
            hidden: true,
            color: 0x000000,
            container,
            placement: {
                x: app.screen.width / 2,
                y: 250 + 60
            },
            title: "Return to Menu",
            EventController,
            eventClick: {
                type: Events.CHANGE_SCENES,
                payload: Scenes.MENU
            }
        })

        GameObjectController.add(pause_button)
        GameObjectController.add(play_button)
        GameObjectController.add(restart_button)
        GameObjectController.add(menu_button)
    
        EventController.subscribe(Events.ENTER_PAUSE_MENU, Scenes.PAUSE, () => {
            pause_button.hide()
            play_button.show()
            restart_button.show()
            menu_button.show()
        })
        
        EventController.subscribe(Events.LEAVE_PAUSE_MENU, Scenes.PAUSE, () => {
            pause_button.show()
            play_button.hide()
            restart_button.hide()
            menu_button.hide()
        })        
    }

    const update = (delta) => {
        GameObjectController.update(delta)
    }

    const unmount = () => {
        GameObjectController.unmount()
        if (container) container.destroy()
        EventController.unsubscribe(Scenes.PAUSE)
    }

    /**
     * Api
     */

    return {
        name: Scenes.PAUSE,
        mount,
        update,
        unmount
    }
}

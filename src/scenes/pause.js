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
    let container_menu = null

    /**
     * Methods
     */

    const mount = () => {
        
        // Stage
        container = new PIXI.Container()
        app.stage.addChild(container)

        // Pause button
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

        // Pause menu container
        container_menu = new PIXI.Container()
        container_menu.x = app.screen.width / 2
        container_menu.y = app.screen.height / 2
        container.addChild(container_menu)

        // Pause menu
        const play_button = createText({
            hidden: true,
            color: 0x000000,
            container: container_menu,
            placement: {
                x: 0,
                y: -30
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
            container: container_menu,
            placement: {
                x: 0,
                y: 0
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
            container: container_menu,
            placement: {
                x: 0,
                y: 30
            },
            title: "Return to Menu",
            EventController,
            eventClick: {
                type: Events.CHANGE_SCENES,
                payload: Scenes.MENU
            }
        })

        // Register game objects
        GameObjectController.add(pause_button)
        GameObjectController.add(play_button)
        GameObjectController.add(restart_button)
        GameObjectController.add(menu_button)
    
        // Events
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

        EventController.subscribe(Events.RESIZE, Scenes.PAUSE, () => {
            pause_button.place(app.screen.width - 50, 50)
            container_menu.x = app.screen.width / 2
            container_menu.y = app.screen.height / 2
        })      
    }

    const update = (delta) => {
        GameObjectController.update(delta)
    }

    const unmount = () => {
        GameObjectController.unmount()
        if (container_menu) container_menu.destroy()
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

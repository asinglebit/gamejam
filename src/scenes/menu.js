import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { createText } from "../game_objects"
import * as Events from "../constants/events"
import * as Scenes from "../constants/scenes"

export const createSceneMenu = (app, EventController) => {

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
        container.height = 640
        app.stage.addChild(container)
        // Title
        GameObjectController.add(createText({
            container,
            color: 0xFFFFFF,
            placement: {
                x: app.screen.width / 2,
                y: 640 / 4
            },
            title: "Game by A&A"
        }))
        // Levels
        GameObjectController.add(createText({
            container,
            color: 0x888888,
            placement: {
                x: app.screen.width / 2,
                y: 250
            },
            title: "Level 1",
            EventController,
            eventClick: {
                type: Events.CHANGE_SCENES,
                payload: Scenes.LEVEL_1
            }
        }))
        GameObjectController.add(createText({
            container,
            color: 0x888888,
            placement: {
                x: app.screen.width / 2,
                y: 250 + 30
            },
            title: "Level 2",
            EventController,
            eventClick: {
                type: Events.CHANGE_SCENES,
                payload: Scenes.LEVEL_2
            }
        }))
    }

    const update = (delta) => {
        GameObjectController.update(delta)
    }

    const unmount = () => {
        GameObjectController.unmount()
        if (container) container.destroy()
    }
    
    /**
     * Api
     */

    return {
        name: Scenes.MENU,
        mount,
        update,
        unmount
    }
}

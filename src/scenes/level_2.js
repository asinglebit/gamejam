import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { createProjectile, createTile } from "../game_objects"
import { CELL_SIZE } from "../constants/constants"
import * as Scenes from "../constants/scenes"
import * as Events from "../constants/events"

export const createSceneLevel2 = (app, EventController) => {

    /**
     * Construction
     */

    // Game object controller
    const GameObjectController = createGameObjectController()
    let container = null
    let timer = 0

    /**
     * Methods
     */

    const mount = () => {
        
        // Stage
        container = new PIXI.Container()
        app.stage.addChild(container)
        const factor = app.screen.width / 1280
        container.scale.x = factor
        container.scale.y = factor
        container.y = app.screen.height / 2 - 384 * factor / 2

        // Background tiles
        for (let row_index = 0; row_index < 3; ++row_index) {
            for (let column_index = 0; column_index < 10; ++column_index) {
                GameObjectController.add(createTile(container, column_index * CELL_SIZE, row_index * CELL_SIZE))
            }
        }

        // Projectile for testing
        GameObjectController.add(createProjectile(container, Math.random() * 128 , Math.floor(Math.random() * 128 * 3)))

        // Events
        EventController.subscribe(Events.ENTER_PAUSE_MENU, Scenes.LEVEL_2, () => {
            GameObjectController.pause()
        })   

        EventController.subscribe(Events.LEAVE_PAUSE_MENU, Scenes.LEVEL_2, () => {
            GameObjectController.play()
        })   

        EventController.subscribe(Events.RESIZE, Scenes.MENU, () => {
            const factor = app.screen.width / 1280
            container.scale.x = factor
            container.scale.y = factor
            container.y = app.screen.height / 2 - 384 * factor / 2
        })
    }

    const update = (delta) => {
        timer += delta
        if (timer > 10) {
            timer = 0
            GameObjectController.add(createProjectile(container, Math.random() * 128 , Math.floor(Math.random() * 128 * 3)))
        }
        GameObjectController.update(delta)
    }

    const unmount = () => {
        GameObjectController.unmount()
        if (container) container.destroy()
        EventController.unsubscribe(Scenes.LEVEL_2)
    }
    
    /**
     * Api
     */

    return {
        name: Scenes.LEVEL_2,
        mount,
        update,
        unmount
    }
}

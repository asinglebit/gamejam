import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { createProjectile, createTile } from "../game_objects"
import { CELL_SIZE } from "../constants"

export const createLevelGame = (app, select) => {

    /**
     * Construction
     */

    // Game object controller
    const GAME_OBJECT_CONTROLLER = createGameObjectController()
    let container = null

    /**
     * Methods
     */

    const mount = () => {
        // Stage
        container = new PIXI.Container()
        container.width = app.screen.width
        container.height = app.screen.height
        container.interactive = true
        container.on('click', function(){
            select('menu');
            console.log("sadsa")
        })
        app.stage.addChild(container)
        // Background tiles
        for (let row_index = 0; row_index < 5; ++row_index) {
            for (let column_index = 0; column_index < 10; ++column_index) {
                GAME_OBJECT_CONTROLLER.add(createTile(container, column_index * CELL_SIZE, row_index * CELL_SIZE))
            }
        }
        // Projectile for testing
        GAME_OBJECT_CONTROLLER.add(createProjectile(container, Math.random() * 128 , Math.floor(Math.random() * 128 * 5)))
    }

    const update = (delta) => {
        GAME_OBJECT_CONTROLLER.update(delta)
    }

    const unmount = () => {
        GAME_OBJECT_CONTROLLER.unmount()
        if (container) container.destroy()
    }
    
    /**
     * Api
     */

    return {
        mount,
        update,
        unmount
    }
}

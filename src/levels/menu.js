import * as PIXI from "pixi.js"
import { createGameObjectController } from "../controllers/game_object_controller"
import { createProjectile, createTile } from "../game_objects"
import { CELL_SIZE } from "../constants"

export const createLevelMenu = (app, select) => {

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
        app.stage.addChild(container)
        container.on('click', function(){
            select('game');
            console.log("sadsa")
        })
        // Background tiles
        GAME_OBJECT_CONTROLLER.add(createTile(container, 3 * CELL_SIZE, 3 * CELL_SIZE))
        // Projectile for testing
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

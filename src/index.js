import * as PIXI from "pixi.js"

import { loadSprites } from "./sprites"
import { createLevelController } from "./controllers/level_controller"

// Main entry point
const startApp = () => {

  // Initialize pixi
  const app = new PIXI.Application({ background: "#1099bb", resizeTo: window })
  globalThis.__PIXI_APP__ = app
  document.body.appendChild(app.view)

  // Initialize level controller
  const LEVEL_CONTROLLER = createLevelController(app)
  LEVEL_CONTROLLER.select("menu")

  // Game loop
  app.ticker.add((delta) => {

    // Level controller handles updates for the selected context
    LEVEL_CONTROLLER.update(delta)
  })
}

// Wait for the page to load, load all resources and start the game
document.addEventListener("DOMContentLoaded", async () => {
  await loadSprites()
  startApp()
})

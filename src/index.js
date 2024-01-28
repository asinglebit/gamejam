import * as PIXI from "pixi.js"

import { loadSprites } from "./utils/sprites"
import { createSceneController } from "./controllers/scene_controller"
import * as Scenes from "./constants/scenes"

// Main entry point
const startApp = () => {

  // Initialize pixi
  const app = new PIXI.Application({ background: "#111111", resizeTo: window })
  
  document.body.appendChild(app.view)
  globalThis.__PIXI_APP__ = app

  // Initialize scene controller
  const SceneController = createSceneController(app)
  SceneController.load(Scenes.MENU)

  // Game loop
  app.ticker.add((delta) => {

    // Scene controller handles updates for the selected context
    SceneController.update(delta)
  })
}

// Wait for the page to load, load all resources and start the game
document.addEventListener("DOMContentLoaded", async () => {
  await loadSprites()
  startApp()
})

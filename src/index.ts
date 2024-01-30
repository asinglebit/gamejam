import * as PIXI from "pixi.js"

import { loadSprites } from "./utils/sprites"
import { createSceneController } from "./controllers/scene_controller"
import { SCENE_NAMES } from "./constants/scenes"

// Main entry point
const startApp = () => {
  // Initialize pixi
  const app = new PIXI.Application({
    background: "#111111",
    // @ts-ignore TODO fix typings
    autoResize: true,
    roundPixels: true,
    autoDensity: true,
    antialias: false,
    resolution: window.devicePixelRatio,
  })

  window.__PIXI_APP__ = app

  // @ts-ignore TODO fix typings
  document.querySelector("#root").appendChild(app.view)

  // Initialize scene controller
  const SceneController = createSceneController(app)
  SceneController.load([SCENE_NAMES.LEVEL_1, SCENE_NAMES.PAUSE])

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

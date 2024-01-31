import * as PIXI from "pixi.js"

import { loadSprites } from "./utils/sprites"
import { createStageController } from "./controllers/stage_controller"
import { STAGES } from "./enums/stages"

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

  // Initialize stage controller
  const stageController = createStageController(app)
  stageController.load(STAGES.MENU)

  // Game loop
  app.ticker.add((delta) => {
    // Stage controller handles updates for the selected context
    stageController.update(delta)
  })


}

// Wait for the page to load, load all resources and start the game
document.addEventListener("DOMContentLoaded", async () => {
  await loadSprites()
  startApp()
})

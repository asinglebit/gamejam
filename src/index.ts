import * as PIXI from "pixi.js"

import { STAGES } from "./enums/stages"
import { StageController } from "./core/stage_controller"
import { loadSprites } from "./utils/sprites"
import { FONT_FAMILY } from "./constants"
// import { soundOst } from "./utils/sounds"

// Main entry point
const startApp = () => {
  // Initialize pixi
  const app = new PIXI.Application({
    background: "#111111",
    // @ts-ignore TODO fix typings
    autoResize: true,
    antialias: false,
    roundPixels: true,
    autoDensity: true,
    resolution: window.devicePixelRatio,
  })

  window.__PIXI_APP__ = app

  // @ts-ignore TODO fix typings
  document.querySelector("#root").appendChild(app.view)

  // Initialize stage controller
  const stageController = new StageController(app)
  stageController.load(STAGES.LEVEL_1)
  // soundOst.play()
  // Game loop
  app.ticker.add((delta) => {
    // Stage controller handles updates for the selected context
    stageController.update(delta)
  })
}

// Wait for the page to load, load all resources and start the game
document.addEventListener("DOMContentLoaded", async () => {
  await loadSprites()
  // @ts-ignore
  window.WebFont.load({
    google: {
      families: [FONT_FAMILY],
    },
    active() {
      startApp()
    },
  })

  YaGames.init().then((ysdk) => {
    console.log("Yandex SDK initialized")
    window.ysdk = ysdk

    // @ts-ignore
    ysdk.adv.showFullscreenAdv()
  })
})

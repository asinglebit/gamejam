import * as PIXI from "pixi.js"

import { $state } from "./store"
import { loadSprites, createBulletSprite, renderRanged, renderTile, renderUndead } from "./render"
import { createBullet } from "./bullet"
import { createGameController } from "./gameController"

// unity_types = "ranged" | "producer" | "obstacle"

document.addEventListener("DOMContentLoaded", async () => {
  await loadSprites()
  startApp()
})

const startApp = () => {
  
  const app = new PIXI.Application({ background: "#1099bb", resizeTo: window })
  globalThis.__PIXI_APP__ = app
  document.body.appendChild(app.view)

  // Stage
  const container = new PIXI.Container()
  container.width = app.screen.width
  container.height = app.screen.height
  app.stage.addChild(container)

  const MAX_SCENE_WIDTH = app.screen.width

  // Cells
  for (let row_index = 0; row_index < 5; ++row_index) {
    for (let column_index = 0; column_index < 10; ++column_index) {
      // Cell object
      renderTile(container, column_index, row_index)
    }
  }

  // Place units
  $state.getState().level.grid.map((row, row_index) => {
    row.map((cell, column_index) => {
      if (cell === null) return
      switch (cell.type) {
        case "ranged": {
          renderRanged(container, column_index, row_index)
          //   let cell = new PIXI.Graphics()
          //   cell.beginFill(0x333333)
          //   cell.drawRect(15, 15, cell_size - 15, cell_size - 15)
          //   cell.x = column_index * cell_size
          //   cell.y = row_index * cell_size
          //   container.addChild(cell)
          break
        }
        default:
          break
      }
    })
  })
  const GLOBAL_CONTROLLER = createGameController()
  renderUndead(container, 5, 2)


  
  setInterval(() => {
    GLOBAL_CONTROLLER.addGameObj(createBullet(container, Math.random() * 128 , Math.floor(Math.random() * 128 * 5)))

  }, 250)
  for (let i = 0; i < 100; i++) {
  }


  app.ticker.add((delta) => {

    GLOBAL_CONTROLLER.update(delta)
  })
}

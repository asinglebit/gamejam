import * as PIXI from "pixi.js"

import { $state } from "./store"
import { loadSprites, renderProjectile, renderRanged, renderTile, renderUndead } from "./render"

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

  renderUndead(container, 5, 2)
  const ball = renderProjectile(container, 10, 10)
  // renderRanged(container, 0, 0)

  app.ticker.add((delta) => {
    ball.x += 5
  })
}

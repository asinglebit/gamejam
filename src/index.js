import * as PIXI from 'pixi.js'
import { createStore, createEvent, createEffect } from "effector"

// unity_types = "ranged" | "producer" | "obstacle"

const $state = createStore({
    screen: "Level 1",
    level: {
        grid: [
            [null, {type: "ranged"}, null, null, null, null, null, null, null, null],
            [null, null, {type: "ranged"}, null, null, null, null, null, null, null],
            [null, {type: "ranged"}, null, null, null, null, null, null, null, null],
            [null, {type: "ranged"}, null, null, null, null, null, null, null, null],
            [null, {type: "ranged"}, null, null, null, null, null, null, null, null]
        ],
    }
})

const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });
globalThis.__PIXI_APP__ = app;
document.body.appendChild(app.view);

// Stage
const container = new PIXI.Container();
container.width = app.screen.width
container.height = app.screen.height
app.stage.addChild(container);

// Constants
const cell_size = 100

// Cells
for (let row_index = 0; row_index < 5; ++row_index) {
    for (let column_index = 0; column_index < 10; ++column_index) {
        // Cell object
        let cell = new PIXI.Graphics()
        cell.beginFill(0x111111)
        cell.drawRect(5, 5, cell_size - 5, cell_size - 5)
        cell.x = column_index * cell_size
        cell.y = row_index * cell_size
        container.addChild(cell)        
    }
}

// Place units
$state.getState().level.grid.map((row, row_index) => {
    row.map((cell, column_index) => {
        if (cell === null) return
        switch (cell.type) {
            case "ranged": {
                let cell = new PIXI.Graphics()
                cell.beginFill(0x333333)
                cell.drawRect(15, 15, cell_size - 15, cell_size - 15)
                cell.x = column_index * cell_size
                cell.y = row_index * cell_size
                container.addChild(cell)
                break;
            }
            default: break;
        }
    })
})


container.addChild(obj);

app.ticker.add((delta) => {

});

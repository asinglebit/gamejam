import * as PIXI from "pixi.js"

declare global {
  type Coordinates = {
    x: number
    y: number
  }

  interface Window {
    __PIXI_APP__: PIXI.Application
  }
}

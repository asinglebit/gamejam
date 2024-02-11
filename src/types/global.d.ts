import * as PIXI from "pixi.js"

declare module "*.mp3" // '*.wav' if you're using wav format

declare global {
  type Coordinates = {
    x: number
    y: number
  }

  interface Window {
    __PIXI_APP__: PIXI.Application
    ysdk: {}
  }

  const YaGames: {
    init: () => Promise<{}>
  }
}

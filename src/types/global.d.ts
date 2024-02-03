import * as PIXI from "pixi.js"

declare module '*.tmx' {
  const css: any;
  export default css;
}

declare global {
  type Coordinates = {
    x: number
    y: number
  }

  interface Window {
    __PIXI_APP__: PIXI.Application
  }
}

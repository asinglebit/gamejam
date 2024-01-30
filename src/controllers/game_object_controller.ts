import * as PIXI from "pixi.js"

export interface IGameObject  {
  pause?: VoidFunction
  play?: VoidFunction
  shouldBeUnmounted: boolean
  update: (dt: number) => void
  unmount: VoidFunction
  UID: string
  hide?: VoidFunction
  show?: VoidFunction
}


export class GameObject implements IGameObject {
  public UID: string
  public shouldBeUnmounted: false

  protected sprite: PIXI.Sprite

  constructor() {
  }

  update(dt: number){}

  unmount() {
    this.sprite.destroy(true)
  }
}



export const createGameObjectController = () => {
  /**
   * Construction
   */

  let gameObjects: IGameObject[] = []

  /**
   * Methods
   */

  // Compute the state of each of the game objects for the next tick
  const update = (delta: number) => {
    // Unmount game objects scheduled for unmounting
    gameObjects = gameObjects.filter((gameObject) => {
      if (gameObject.shouldBeUnmounted) {
        gameObject.unmount()
        return false
      }
      return true
    })
    // Update the rest of the game objects
    gameObjects.forEach((gameObject) => gameObject.update(delta))
  }

  // Computes the state of each of the game objects for the next tick
  const add = (gameObject: IGameObject) => {
    gameObjects.push(gameObject)
  }

  // Unmounts all of the game objects and releases memory
  const unmount = () => {
    gameObjects.forEach((gameObject) => gameObject.unmount())
    gameObjects = []
  }

  const pause = () => {
    gameObjects.forEach((gameObject) => {
      if (gameObject.pause) {
        gameObject.pause()
      }
    })
  }

  const play = () => {
    gameObjects.forEach((gameObject) => {
      if (gameObject.play) {
        gameObject.play()
      }
    })
  }

  /**
   * Api
   */

  return {
    update,
    add,
    unmount,
    pause,
    play,
  }
}

export const createGameObjectController = () => {

  /**
   * Construction
   */

  let gameObjects = []

  /**
   * Methods
   */

  // Compute the state of each of the game objects for the next tick
  const update = (delta) => {
    // Unmount game objects scheduled for unmounting
    gameObjects = gameObjects.filter(gameObject => {
        if (gameObject.shouldBeUnmounted()) {
          gameObject.unmount()
          return false
        }
        return true
      })
    // Update the rest of the game objects
    gameObjects.forEach(gameObject => gameObject.update(delta))
  }

  // Computes the state of each of the game objects for the next tick
  const add = (gameObject) => {
    gameObjects.push(gameObject)
  }

  // Unmounts all of the game objects and releases memory
  const unmount = () => {
    gameObjects.forEach(gameObject => gameObject.unmount())
    gameObjects = []
  }

  const pause = () => {
    gameObjects.forEach(gameObject => {
      if (gameObject.pause) {
        gameObject.pause()
      }
    })
  }

  const play = () => {
    gameObjects.forEach(gameObject => {
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
    play
  }
}
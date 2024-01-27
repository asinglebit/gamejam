export const createGameController = () => {

  let gameObjs = []

  const gameController = {
    gameObjs,
    update: (dt) => {
      gameObjs = gameObjs.filter(gameObj => {
        if (gameObj.shouldBeDeleted()) {
          gameObj.unmount()
          return false
        }
        return true
      })
      gameObjs.forEach(gameObj => gameObj.update(dt))
    },
    addGameObj: (gameObj) => gameObjs.push(gameObj)
  }

  return gameController
}
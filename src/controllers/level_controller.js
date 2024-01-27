import { createLevelMenu, createLevelGame } from "../levels"

export const createLevelController = (app) => {

  /**
   * Construction
   */

  // TODO: figure out how to move this function below the construction phase for cleaner code
  const select = (level) => {
    selected.unmount()
    selected = levels[level]
    selected.mount()
  }

  let levels = {
    menu: createLevelMenu(app, select),
    game: createLevelGame(app, select)
  }
  let selected = levels.menu

  /**
   * Methods
   */

  // Update level
  const update = (delta) => {
    selected.update(delta)
  }

  /**
   * Api
   */

  return {
    select,
    update
  }
}
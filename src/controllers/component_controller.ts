import { IComponent } from "../core/component"

export const createComponentController = () => {
  /**
   * Construction
   */

  let components: IComponent[] = []

  /**
   * Methods
   */

  // Compute the state of each of the game objects for the next tick
  const update = (delta: number) => {
    // Unmount game objects scheduled for unmounting
    components = components.filter((component) => {
      if (component.shouldBeUnmounted) {
        component.unmount()
        return false
      }
      return true
    })
    // Update the rest of the game objects
    components.forEach((component) => component.update(delta))
  }

  // Computes the state of each of the game objects for the next tick
  const add = (component: IComponent) => {
    components.push(component)
  }

  // Unmounts all of the game objects and releases memory
  const unmount = () => {
    components.forEach((component) => component.unmount())
    components = []
  }

  const pause = () => {
    components.forEach((component) => {
      if (component.pause) {
        component.pause()
      }
    })
  }

  const play = () => {
    components.forEach((component) => {
      if (component.play) {
        component.play()
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

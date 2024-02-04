import { IComponent } from "./component"

export class ComponentController {

  private components: IComponent[] = []
  
  constructor() {
  }

  // Compute the state of each of the game objects for the next tick
  update(delta: number) {
    // Unmount game objects scheduled for unmounting
    this.components = this.components.filter((component) => {
      if (component.shouldBeUnmounted) {
        component.unmount()
        return false
      }
      return true
    })
    // Update the rest of the game objects
    this.components.forEach((component) => component.update(delta))
  }

  // Computes the state of each of the game objects for the next tick
  add(component: IComponent) {
    this.components.push(component)
  }

  // Unmounts all of the game objects and releases memory
  unmount () {
    this.components.forEach((component) => component.unmount())
    this.components = []
  }

  pause() {
    this.components.forEach((component) => {
      if (component.pause) {
        component.pause()
      }
    })
  }

  play() {
    this.components.forEach((component) => {
      if (component.play) {
        component.play()
      }
    })
  }

  get(...tags: string[]): IComponent[] {
    return this.components.filter(component => {
      return tags.includes(component.constructor.name)
    })
  }
}

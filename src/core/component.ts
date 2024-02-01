import { nanoid } from "nanoid"
import { CollisionRegion } from "./collision_region"

export interface IComponent  {
    UID: string
    shouldBeUnmounted: boolean
    update: (dt: number) => void
    unmount: VoidFunction
    pause?: VoidFunction
    play?: VoidFunction
    hide?: VoidFunction
    show?: VoidFunction
    getCollisionRegion: () => CollisionRegion | null
    isIntersecting: (component: IComponent) => boolean
}
  
export class Component implements IComponent {
    public UID: string
    public shouldBeUnmounted: boolean = false
  
    constructor(tag: string) {
        this.UID = `${tag}_${nanoid()}`
    }
  
    update(dt: number){}
  
    unmount() {}

    getCollisionRegion(): CollisionRegion | null {
        return null
    }

    isIntersecting(component: IComponent): boolean {
        return false
    }   
}

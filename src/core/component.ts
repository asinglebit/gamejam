import { nanoid } from "nanoid"

export interface IComponent  {
    UID: string
    shouldBeUnmounted: boolean
    update: (dt: number) => void
    unmount: VoidFunction
    pause?: VoidFunction
    play?: VoidFunction
    hide?: VoidFunction
    show?: VoidFunction
}
  
export class Component implements IComponent {
    public UID: string
    public shouldBeUnmounted: false
  
    constructor(tag: string) {
        this.UID = `${tag}_${nanoid()}`
    }
  
    update(dt: number){}
  
    unmount() {}
}

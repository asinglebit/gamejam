import { createBulletSprite } from "./render"

export const createBullet = (container, X, Y) => {

  const sprite = createBulletSprite()

  sprite.x = X
  sprite.y = Y
  container.addChild(sprite)
  

  const SPEED = 5 // per 16ms
  const moveX = (X, dt) => X + SPEED * dt

  const onDestroy = () => {
    sprite.destroy()
  }

  let shouldBeDeleted = false
  // let isPeaceful = false
  
  // const setPeaceful = () => {
  //   isPeaceful = true
  //   // setAnimation(sprite, 'die')
  // }



  const gameObj = {
    graphics: sprite,
    shouldBeDeleted: () => shouldBeDeleted,
    update: (dt) => {
      sprite.x = moveX(sprite.x, dt)

      if (sprite.x > 1280) {
        shouldBeDeleted = true
      }
    },
    unmount: () => {
      // stop timers
      // destroy sprite
      sprite.destroy()
    }
  }

  
  return gameObj
}
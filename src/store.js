import { createStore, createEvent, createEffect } from "effector"

export const $state = createStore({
  screen: "Level 1",
  level: {
    grid: [
      [null, { type: "ranged" }, null, null, null, null, null, null, null, null],
      [null, null, { type: "ranged" }, null, null, null, null, null, null, null],
      [null, { type: "ranged" }, null, null, null, null, null, null, null, null],
      [null, { type: "ranged" }, null, null, null, null, null, null, null, null],
      [null, { type: "ranged" }, null, null, null, null, null, null, null, null],
    ],
  },
})

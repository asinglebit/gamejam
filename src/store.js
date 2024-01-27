import { createStore, createEvent, createEffect } from "effector"

// Store

const $store = createStore({
  level: "menu",
  score: 0
});

// Events

const changeLevel = createEvent();
const changeScore = createEvent();

// Side effects

const changeLevelFx = createEffect((params) => {
  
});

// Binding events

$store
  .on(changeLevel, (state, level) => ({
    ...state,
    level
  }))
	.on(changeScore, (state, score) => ({
    ...state,
    score
  }));

// Triggering effects

sample({
  clock: changeLevel,
  source: $store,
  target: changeLevelFx,
});
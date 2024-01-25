import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });
globalThis.__PIXI_APP__ = app;
document.body.appendChild(app.view);

const texture = PIXI.Texture.from('https://pixijs.com/assets/bunny.png');

const container = new PIXI.Container();
app.stage.addChild(container);

for (let i = 0; i < 25; i++) {
    const bunny = new PIXI.Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);
}

container.x = app.screen.width / 2;
container.y = app.screen.height / 2;
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

app.ticker.add((delta) => {
    container.rotation -= 0.01 * delta;
});
let app;
const aliens = [];

const dudeUtil = {
	onSelect: function() {},
	add() {
		const dude = PIXI.Sprite.from('assets/eggHead.png');
		dude.anchor.set(0.5);
		dude.scale.set(0.8 + Math.random() * 0.3);
		dude.x = Math.random() * app.screen.width;
		dude.y = Math.random() * app.screen.height;
		dude.tint = Math.random() * 0xFFFFFF;
		// const direction = Math.random() * Math.PI * 2;
		// dude.rotation = -direction - Math.PI / 2;

		// Opt-in to interactivity
		dude.interactive = true;
		// Shows hand cursor
		dude.buttonMode = true;
		// Pointers normalize touch and mouse
		dude.on('pointerdown', function(event) {
			dudeUtil.onSelect(event);
		});

		aliens.push(dude);
		app.stage.addChild(dude);
	},
	remove(dude) {
		
		app.stage.removeChild(dude);
	}
};

const init = function ({ wrapper, onSelect = function() {} }) {
	app = new PIXI.Application();
	wrapper.appendChild(app.view);
	dudeUtil.onSelect = onSelect; 
}

export {
	init,
	dudeUtil as dude
};
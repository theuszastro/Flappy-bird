const sprites = new Image();
sprites.src = './assets/sprites.png';

const HitSound = new Audio('./assets/hit.wav');
HitSound.volume = 0.3;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class GameEngine {
	constructor() {
		this.gameLoop = this.gameLoop.bind(this);

		this.home;
		this.gameover;
		this.screen;

		this.flappyBird;
		this.backgroundGame;
		this.floor;
		this.pipes;
		this.points;
		this.frames;

		this.init();
	}

	init() {
		this.backgroundGame = this.createBackground();
		this.flappyBird = this.createFlappyBirdObject();
		this.floor = this.createFloor();
		this.pipes = this.createPipes();
		this.points = this.createScoreboard();
		this.frames = 0;

		this.home = this.createInitialScreen();
		this.gameover = this.createGameoverScreen();
		this.screen = {
			start: true,
			gaming: false,
			gameover: false,
		};

		canvas.onclick = () => {
			const { start, gaming, gameover } = this.screen;

			if (start) {
				this.flappyBird.velocity = 0;

				this.updateScreen('gaming');
			}

			if (gaming) {
				this.flappyBird.skip();
			}

			if (gameover) {
				this.init();
			}
		};

		this.gameLoop();
	}

	initialScreen() {
		this.backgroundGame.draw();
		this.floor.draw();
		this.flappyBird.drawGame();
		this.home.draw();

		this.floor.update();
		this.flappyBird.updateGame();
	}

	initGaming() {
		this.backgroundGame.draw();
		this.floor.draw();
		this.pipes.draw();
		this.flappyBird.drawGame();
		this.points.draw();

		this.floor.update();
		this.pipes.update();
		this.flappyBird.updateGame();
		this.points.update();
	}

	gameoverScreen() {
		this.backgroundGame.draw();
		this.floor.draw();
		this.pipes.draw();
		this.flappyBird.drawGame();
		this.gameover.draw();

		this.flappyBird.updateGame();
		this.floor.update();
	}

	createInitialScreen() {
		return {
			spriteX: 134,
			spriteY: 0,
			width: 174,
			height: 152,
			x: canvas.width / 2 - 174 / 2,
			y: 50,
			draw() {
				ctx.drawImage(
					sprites,
					this.spriteX,
					this.spriteY,
					this.width,
					this.height,
					this.x,
					this.y,
					this.width,
					this.height
				);
			},
		};
	}

	createGameoverScreen() {
		return {
			spriteX: 134,
			spriteY: 153,
			width: 226,
			height: 200,
			x: canvas.width / 2 - 226 / 2,
			y: 50,
			draw() {
				ctx.drawImage(
					sprites,
					this.spriteX,
					this.spriteY,
					this.width,
					this.height,
					this.x,
					this.y,
					this.width,
					this.height
				);
			},
		};
	}

	createBackground() {
		return {
			spriteX: 390,
			spriteY: 0,
			width: 275,
			height: 204,
			x: 0,
			y: canvas.height - 204,
			draw() {
				ctx.fillStyle = '#70c5ce';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				ctx.drawImage(
					sprites,
					this.spriteX,
					this.spriteY,
					this.width,
					this.height,
					this.x,
					this.y,
					this.width,
					this.height
				);

				ctx.drawImage(
					sprites,
					this.spriteX,
					this.spriteY,
					this.width,
					this.height,
					this.x + this.height,
					this.y,
					this.width,
					this.height
				);
			},
		};
	}

	createFlappyBirdObject() {
		const _this = this;

		return {
			spriteX: 0,
			spriteY: 0,
			width: 33,
			height: 24,
			x: 10,
			y: 50,
			jump: 4.6,
			velocity: 0,
			gravity: 0.25,
			movements: [
				{ spriteX: 0, spriteY: 0 },
				{ spriteX: 0, spriteY: 26 },
				{ spriteX: 0, spriteY: 52 },
				{ spriteX: 0, spriteY: 26 },
			],
			movementActual: 0,
			drawGame() {
				this.updateMovementActual();

				const { movements, movementActual, width, height, x, y } = this;

				const { spriteX, spriteY } = movements[movementActual];

				ctx.drawImage(sprites, spriteX, spriteY, width, height, x, y, width, height);
			},
			updateGame() {
				if (this.makeCollision()) {
					return;
				}

				this.velocity += this.gravity;

				if (_this.screen.gaming) {
					this.y += this.velocity;
				}
			},
			updateMovementActual() {
				const interval = 10;
				const passedInterval = _this.frames % interval === 0;

				if (passedInterval) {
					const baseOfIncrement = 1;
					const increment = baseOfIncrement + this.movementActual;
					const baseLoop = this.movements.length;

					this.movementActual = increment % baseLoop;
				}
			},
			makeCollision() {
				const flappyBirdY = this.y + this.height;
				const floorY = _this.floor.y;

				if (flappyBirdY >= floorY) {
					HitSound.play();
					_this.updateScreen('gameover');

					return true;
				}

				return false;
			},
			skip() {
				if (this.y <= this.jump * 2) {
					this.velocity = this.jump / 3;

					return;
				}

				this.velocity = -this.jump;
			},
		};
	}

	createFloor() {
		return {
			spriteX: 0,
			spriteY: 610,
			width: 224,
			height: 112,
			x: 0,
			y: canvas.height - 112,
			update() {
				const MovementFloor = 1;
				const RepeatIn = this.width / 2;
				const Moving = this.x - MovementFloor;

				this.x = Moving % RepeatIn;
			},
			draw() {
				ctx.drawImage(
					sprites,
					this.spriteX,
					this.spriteY,
					this.width,
					this.height,
					this.x,
					this.y,
					this.width,
					this.height
				);

				ctx.drawImage(
					sprites,
					this.spriteX,
					this.spriteY,
					this.width,
					this.height,
					this.x + this.width,
					this.y,
					this.width,
					this.height
				);
			},
		};
	}

	createPipes() {
		const _this = this;

		return {
			width: 52,
			height: 400,
			floor: {
				spriteX: 0,
				spriteY: 169,
			},
			sky: {
				spriteX: 52,
				spriteY: 169,
			},
			space: 90,
			pairs: [],
			draw() {
				this.pairs.forEach(pair => {
					const yRandom = pair.y;

					const pipeSkyX = pair.x;
					const pipeSkyY = yRandom;

					ctx.drawImage(
						sprites,
						this.sky.spriteX,
						this.sky.spriteY,
						this.width,
						this.height,
						pipeSkyX,
						pipeSkyY,
						this.width,
						this.height
					);

					const pipeFloorX = pair.x;
					const pipeFloorY = this.height + this.space + yRandom;

					ctx.drawImage(
						sprites,
						this.floor.spriteX,
						this.floor.spriteY,
						this.width,
						this.height,
						pipeFloorX,
						pipeFloorY,
						this.width,
						this.height
					);

					pair.pipeSky = {
						x: pipeSkyX,
						y: this.height + pipeSkyY,
					};

					pair.pipeFloor = {
						x: pipeFloorX,
						y: pipeFloorY,
					};
				});
			},
			makeCollision(pair) {
				const HeadOfFlappy = _this.flappyBird.y;
				const FootOfFlappy = _this.flappyBird.y + _this.flappyBird.height;

				if (_this.flappyBird.x + _this.flappyBird.width >= pair.x) {
					if (HeadOfFlappy <= pair.pipeSky.y) {
						return true;
					}

					if (FootOfFlappy >= pair.pipeFloor.y) {
						return true;
					}
				}

				return false;
			},
			update() {
				const Passed100Frames = _this.frames % 100 === 0;

				if (Passed100Frames) {
					this.pairs.push({
						x: canvas.width,
						y: -150 * (Math.random() + 1),
					});
				}

				this.pairs.forEach(pair => {
					pair.x = pair.x - 2;

					if (this.makeCollision(pair)) {
						HitSound.play();
						_this.updateScreen('gameover');

						return;
					}

					if (pair.x + this.width <= 0) {
						this.pairs.shift();
					}
				});
			},
		};
	}

	createScoreboard() {
		const _this = this;

		return {
			points: 0,
			interval: 20,
			draw() {
				ctx.font = '35px "VT323"';
				ctx.textAlign = 'right';
				ctx.fillStyle = 'white';
				ctx.fillText(`${this.points}`, canvas.width - 10, 35);
			},
			update() {
				const passedInterval = _this.frames % this.interval === 0;

				if (passedInterval) {
					this.points += 1;
				}
			},
		};
	}

	updateScreen(key) {
		const allKeys = Object.keys(this.screen);

		allKeys.map(item => {
			if (item === key) {
				this.screen[key] = true;
			} else {
				this.screen[item] = false;
			}
		});
	}

	gameLoop() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const { start, gaming, gameover } = this.screen;

		if (start) {
			this.initialScreen();
		}

		if (gaming) {
			this.initGaming();
		}

		if (gameover) {
			this.gameoverScreen();

			return;
		}

		this.frames += 1;

		requestAnimationFrame(this.gameLoop);
	}
}

new GameEngine();

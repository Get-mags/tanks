function BrownTank (game, x, y) {

	this.body = game.add.sprite(x, y, 'browntankbody');
	this.head = game.add.sprite(0, 0, 'browntankhead');
	game.physics.arcade.enable(this.body);
	this.body.anchor.setTo(0.5, 0.5);
	this.head.anchor.setTo(0.45, 0.5);
	this.body.addChild(this.head);
	this.body.parentFcn = this;
	this.gameObjType = "BROWN TANK";

	this.patrols = true;
	this.dir = 1;
	this.goalRot = 0;
	this.numBullets = 0;
	this.maxBullets = 1;
	this.rotDelay = 800;
	this.dead = false;

	this.multiplayerIx = -1;

	this.patrol = function () {
		if (this.dead) return;

		if (isMultiplayer) serverUpdateTankRotation (this.multiplayerIx);

		rotateTo(this.head, this.goalRot, this.rotDelay).onComplete.add(function () {
			this.dir *= -1;
			this.head.rotation = Phaser.Math.wrapAngle(this.head.rotation, true);
			this.goalRot = getRadTo(player.heart.x, player.heart.y, this.body.x, this.body.y) + this.dir;
			this.patrol();
		}, this);
	}

	this.act = function () {
		if (shouldFire(this.body.x, this.body.y, this.head.rotation, 1) && this.numBullets < this.maxBullets) {
			var params = {
				x: this.body.x,
				y: this.body.y,
				rot: this.head.rotation,
				numBounces: 1,
				speed: SLOW_BULLET_SPEED
			}
			fire(params, this, true);
		}
	}

	this.move = function () {}

	this.die = function () { 
		this.head.kill();
      this.body.kill();
		this.dead = true; 
	}
}

function GrayTank (game, x, y) {
	this.heart = game.add.sprite(x, y, 'tankcenter')
	this.body = this.heart.addChild(game.add.sprite(0, 0, 'graytankbody'));
	this.head = this.heart.addChild(game.add.sprite(0, 0, 'graytankhead'));
	game.physics.arcade.enable(this.heart);
	this.heart.anchor.setTo(0.5, 0.5);
	this.body.anchor.setTo(0.5, 0.5);
	this.head.anchor.setTo(0.45, 0.5);
	
	this.heart.parentFcn = this;
	this.gameObjType = "GRAY TANK";

	this.patrols = true;
	this.goalRot = 0;
	this.numBullets = 0;
	this.maxBullets = 1;
	this.seePlayer = false;
	this.direction = getRandomRotation();
	this.movSpeed = 30;
	this.rotDelay = 800;
	this.bulletDelay = 0;
	this.bulletDelayRequirement = 10;
	this.body.rotation = this.direction;

	this.multiplayerIx = -1;

	this.patrol = function () {
		if (this.dead) return;

		if (this.seePlayer) this.goalRot = getRadTo(player.heart.x, player.heart.y, this.heart.x, this.heart.y);
		else this.goalRot = getRandomRotation();

		if (isMultiplayer) serverUpdateTankRotation (this.multiplayerIx);

		rotateTo(this.head, this.goalRot, this.rotDelay).onComplete.add(function () {
			this.head.rotation = Phaser.Math.wrapAngle(this.head.rotation, true);
			this.patrol();
		}, this);
		
	}

	this.act = function () {
		this.bulletDelay += 1;
		if (this.numBullets < this.maxBullets && this.bulletDelay > this.bulletDelayRequirement && 
			shouldFire(this.heart.x, this.heart.y, this.head.rotation, 1)) {
			var params = {
				x: this.heart.x,
				y: this.heart.y,
				rot: this.head.rotation,
				numBounces: 1,
				speed: SLOW_BULLET_SPEED
			}
			fire(params, this, true);
			this.bulletDelay = 0;
		}
	}

	this.move = function () {
		var rayToPlayer = new Phaser.Line(this.heart.x, this.heart.y, player.heart.x, player.heart.y);
		var intersect = getWallIntersection(rayToPlayer);
		this.seePlayer = (intersect == null);
		this.heart.body.velocity.x = this.movSpeed * Math.cos(this.direction);
		this.heart.body.velocity.y = this.movSpeed * Math.sin(this.direction);
		var rayForward = new Phaser.Line(this.heart.x, this.heart.y, Math.cos(this.direction) * 500 + x, Math.sin(this.direction) * 500 + y);
		var wallIntersect = getWallIntersection(rayForward);

		var distance = 0;
		if (wallIntersect != null) distance = game.math.distance(this.heart.x, this.heart.y, wallIntersect.x, wallIntersect.y);

		if (distance < 100 || Math.random() < 0.1) {
			// Explore
			this.direction = getRandomRotation();
			this.heart.body.velocity.x = 0;
			this.heart.body.velocity.y = 0;
			if (isMultiplayer) serverUpdateTankVelocity(this.multiplayerIx);

			dualRotateTo(this.body, this.direction, this.rotDelay).onComplete.add(function () {
				this.heart.body.velocity.x = this.movSpeed * Math.cos(this.direction);
				this.heart.body.velocity.y = this.movSpeed * Math.sin(this.direction);
				if (isMultiplayer) serverUpdateTankVelocity(this.multiplayerIx);
			}, this);
		}
	}
	

	this.die = function () { 
		this.head.kill();
      this.body.kill();
      this.heart.kill();
		this.dead = true; 
	}
}

function TealTank (game, x, y) {
	this.heart = game.add.sprite(x, y, 'tankcenter')
	this.body = this.heart.addChild(game.add.sprite(0, 0, 'tealtankbody'));
	this.head = this.heart.addChild(game.add.sprite(0, 0, 'tealtankhead'));
	game.physics.arcade.enable(this.heart);
	this.heart.anchor.setTo(0.5, 0.5);
	this.body.anchor.setTo(0.5, 0.5);
	this.head.anchor.setTo(0.45, 0.5);
	
	this.heart.parentFcn = this;
	this.gameObjType = "TEAL TANK";
	this.state = "PATHFIND";

	this.patrols = true;
	this.goalRot = 0;
	this.numBullets = 0;
	this.maxBullets = 1;
	this.seePlayer = false;
	this.direction = getRandomRotation();
	this.movSpeed = 60;
	this.rotDelay = 800;
	this.bulletDelay = 10;
	this.bulletDelayRequirement = 12;
	this.body.rotation = this.direction;
	this.wayPoints = [];

	this.wayIx = 0;
	this.onTheWay = false;
	this.prevDistance = 10000;

	this.patrol = function () {
		if (this.dead) return;

		if (this.seePlayer) this.goalRot = getRadTo(player.heart.x, player.heart.y, this.heart.x, this.heart.y);
		else this.goalRot = getRandomRotation();

		rotateTo(this.head, this.goalRot, this.rotDelay).onComplete.add(function () {
			this.head.rotation = Phaser.Math.wrapAngle(this.head.rotation, true);
			this.patrol();
		}, this);
	}

	this.act = function () {
		this.bulletDelay += 1;
		if (this.numBullets < this.maxBullets && this.bulletDelay > this.bulletDelayRequirement && shouldFire(this.heart.x, this.heart.y, this.head.rotation, 1)) {
			var params = {
				x: this.heart.x,
				y: this.heart.y,
				rot: this.head.rotation,
				numBounces: 0,
				speed: FAST_BULLET_SPEED
			}
			fire(params, this, true);
			this.bulletDelay = 0;
		}
	}

	this.move = function () {
		if (this.state == "PATHFIND") {
			this.wayPoints = [];
			this.wayIx = 0;
			this.onTheWay = false;
			this.prevDistance = 10000;
			var myCoords = getLayoutPositionFromXY(this.heart.x, this.heart.y);
			var playerCoords = getLayoutPositionFromXY(players[0].heart.x, players[0].heart.y);
			//playerCoords[0] = playerCoords[0] - 1;
			console.log("enemy tank: " + myCoords + " calculated from [" + this.heart.x + ", " + this.heart.y + "]");
			console.log("player: " + playerCoords + " calculated from [" + players[0].heart.x + ", " + players[0].heart.y + "]");
			pathfind.findPath(myCoords[0], myCoords[1], playerCoords[0], playerCoords[1], (function (path) {
				var modW = WALL_WIDTH / 2;
				var modH = WALL_HEIGHT / 2;
				for (var i = 0; i < path.length; i++) {
					//CENTER THESE
					this.wayPoints.push([path[i].x * WALL_WIDTH + modW, path[i].y * WALL_HEIGHT + modH]);
				}
				this.wayIx = 0;
				this.onTheWay = false;
				this.state = "SEEK";
			}).bind(this));
			pathfind.calculate();
			
		}
		else if (this.state == "SEEK") {
			if (!this.onTheWay) {
				this.direction = getRadTo(this.wayPoints[this.wayIx][0], this.wayPoints[this.wayIx][1], this.heart.x, this.heart.y);
				this.heart.body.velocity.x = 0;
				this.heart.body.velocity.y = 0;
				dualRotateTo(this.body, this.direction, this.rotDelay).onComplete.add(function () {
					this.heart.body.velocity.x = this.movSpeed * Math.cos(this.direction);
					this.heart.body.velocity.y = this.movSpeed * Math.sin(this.direction);
				}, this);
				this.onTheWay = true;
			}
			else {
				var rand = Math.random();
				if (Math.random () < 0.1) {
					this.state = "PATHFIND";
				}
				else if (rand < 0.4) {
					var rayToPlayer = new Phaser.Line(this.heart.x, this.heart.y, player.heart.x, player.heart.y);
					var intersect = getWallIntersection(rayToPlayer);
					this.seePlayer = (intersect == null);
				}

				var distance = game.math.distance(this.heart.x, this.heart.y, this.wayPoints[this.wayIx][0], this.wayPoints[this.wayIx][1]);
				if (distance <= 100) {
					this.wayIx++;
					this.prevDistance = 10000;
					this.onTheWay = false;
					if (this.wayIx == this.wayPoints.length) this.state = "PATHFIND";
				}
				else this.prevDistance = distance;
			}
		}
	}
	

	this.die = function () { 
		this.head.kill();
      this.body.kill();
      this.heart.kill();
		this.dead = true; 
	}
}

function CircleTank (game, x, y) {
	this.body = game.add.sprite(x, y, 'circletankbody');
	this.head = this.body.addChild(game.add.sprite(0, 0, 'circletankhead'));
	game.physics.arcade.enable(this.body);
	this.body.anchor.setTo(0.5, 0.5);
	this.head.anchor.setTo(0.45, 0.5);
	
	this.body.parentFcn = this;
	this.gameObjType = "CIRCLE TANK";
	this.state = "PATHFIND";

	this.patrols = true;
	this.numBullets = 0;
	this.maxBullets = 1;
	this.seePlayer = false;
	this.direction = getRandomRotation();
	this.movSpeed = 60;
	this.rotDelay = 800;
	this.bulletDelay = 10;
	this.bulletDelayRequirement = 12;
	this.wayPoints = [];

	this.wayIx = 0;
	this.onTheWay = false;
	this.prevDistance = 10000;

	this.patrol = function () {
		if (this.dead) return;

		if (this.seePlayer) this.goalRot = getRadTo(player.body.x, player.body.y, this.body.x, this.body.y);
		else this.goalRot = getRandomRotation();

		rotateTo(this.head, this.goalRot, this.rotDelay).onComplete.add(function () {
			this.head.rotation = Phaser.Math.wrapAngle(this.head.rotation, true);
			this.patrol();
		}, this);
	}

	this.act = function () {
		this.bulletDelay += 1;
		if (this.numBullets < this.maxBullets && this.bulletDelay > this.bulletDelayRequirement && shouldFire(this.body.x, this.body.y, this.head.rotation, 1)) {
			var params = {
				x: this.body.x,
				y: this.body.y,
				rot: this.head.rotation,
				numBounces: 0,
				speed: FAST_BULLET_SPEED
			}
			fire(params, this, true);
			this.bulletDelay = 0;
		}
	}

	this.move = function () {
		if (this.state == "PATHFIND") {
			this.wayPoints = [];
			this.wayIx = 0;
			this.onTheWay = false;
			this.prevDistance = 10000;
			var myCoords = getLayoutPositionFromXY(this.body.x, this.body.y);
			var playerCoords = getLayoutPositionFromXY(players[0].body.x, players[0].body.y);
			pathfind.findPath(myCoords[0], myCoords[1], playerCoords[0], playerCoords[1], (function (path) {
				var modW = WALL_WIDTH / 2;
				var modH = WALL_HEIGHT / 2;
				for (var i = 0; i < path.length; i++) {
					//CENTER THESE
					this.wayPoints.push([path[i].x * WALL_WIDTH + modW, path[i].y * WALL_HEIGHT + modH]);
				}
				this.wayIx = 0;
				this.onTheWay = false;
				this.state = "SEEK";
			}).bind(this));
			pathfind.calculate();
			
		}
		else if (this.state == "SEEK") {
			if (!this.onTheWay) {
				this.direction = getRadTo(this.wayPoints[this.wayIx][0], this.wayPoints[this.wayIx][1], this.body.x, this.body.y);
				this.body.body.velocity.x = this.movSpeed * Math.cos(this.direction);
				this.body.body.velocity.y = this.movSpeed * Math.sin(this.direction);
				this.onTheWay = true;
			}
			else {
				var rand = Math.random();
				if (Math.random () < 0.1) {
					this.state = "PATHFIND";
				}
				else if (rand < 0.4) {
					var rayToPlayer = new Phaser.Line(this.body.x, this.body.y, player.body.x, player.body.y);
					var intersect = getWallIntersection(rayToPlayer);
					this.seePlayer = (intersect == null);
				}

				var distance = game.math.distance(this.body.x, this.body.y, this.wayPoints[this.wayIx][0], this.wayPoints[this.wayIx][1]);
				if (distance >= this.prevDistance) {
					this.wayIx++;
					this.prevDistance = 10000;
					this.onTheWay = false;
					if (this.wayIx == this.wayPoints.length) this.state = "PATHFIND";
				}
				else this.prevDistance = distance;
			}
		}
	}
	

	this.die = function () { 
		this.head.kill();
      this.body.kill();
		this.dead = true; 
	}
}
function getRadTo (x1, y1, x2, y2) {
	return Math.atan2(y1 - y2, x1 - x2);
}

function shouldFire (x, y, rotation, numBouncesLeft) {
	var ray = new Phaser.Line(x, y, Math.cos(rotation) * 5000 + x, Math.sin(rotation) * 5000 + y);
	var playerIntersect = getPlayerIntersect(ray);

	if (playerIntersect) {
		var rayToPlayer = new Phaser.Line(x, y, playerIntersect.x, playerIntersect.y);
		var intersect = getWallIntersection(rayToPlayer);
		if (intersect == null) return true;
		if (intersect.x == ray.start.x && intersect.y == ray.start.y) return true;
		return false;
	}
	else {
		if (numBouncesLeft > 0) {
			var intersect = getWallIntersection(ray);
			if (!intersect) { return false; }

			var bounceAngle;
			if (intersect.bounceType == 'H') bounceAngle = -rotation;
			else if (rotation < 0) bounceAngle = -Math.PI - rotation;
			else bounceAngle = Math.PI - rotation;
			return shouldFire(intersect.x, intersect.y, bounceAngle, numBouncesLeft - 1);
		}
		else return false;
	}
}

function lerp_dir (cur_dir, tar_dir, inc)
{	
	if ( Math.abs( tar_dir - cur_dir) <= inc || Math.abs( tar_dir - cur_dir) >= (2 * Math.PI - inc)) { return tar_dir; }
	else if ( Math.abs( tar_dir - cur_dir) > Math.PI)
	{
		tar_dir += (tar_dir < cur_dir) ? 2 * Math.PI : -2 * Math.PI;
	}

	if ( tar_dir > cur_dir) return cur_dir + inc;
	else if ( tar_dir < cur_dir) return cur_dir - inc;
	
	return cur_dir;
}

function getPlayerIntersect (ray) {
	var maxDistance = Number.POSITIVE_INFINITY;
	var closestIntersection = null;

	var left = player.body.x - player.body.width * 0.5;
	var right = player.body.x + player.body.width * 0.5;
	var top = player.body.y - player.body.height * 0.5;
	var bottom = player.body.y + player.body.height * 0.5;

	var lines = [
		new Phaser.Line (left, top, left, bottom),
		new Phaser.Line (left, top, right, top),
		new Phaser.Line (right, bottom, left, bottom),
		new Phaser.Line (right, bottom, right, top)
	]

	for (var i = 0; i < lines.length; i++) {
		var intersect = Phaser.Line.intersects(ray, lines[i]);
		if (intersect) { 
			distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
			if (distance < maxDistance)  {
				maxDistance = distance;
				closestIntersection = intersect;
			}
		}
	}

	return closestIntersection;
}



function getWallIntersection (ray) {
	var distanceToWall = Number.POSITIVE_INFINITY;
   var closestIntersection = null;

   this.walls.forEach(function(wall) {
       // Create an array of lines that represent the four edges of each wall
		var lines = [
			new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
			new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
			new Phaser.Line(wall.x + wall.width, wall.y,
			wall.x + wall.width, wall.y + wall.height),
			new Phaser.Line(wall.x, wall.y + wall.height,
			wall.x + wall.width, wall.y + wall.height)
		];
		//console.log(lines[0].start + " and " + lines[0].end);
		// Test each of the edges in this wall against the ray.
		// If the ray intersects any of the edges then the wall must be in the way.
		for(var i = 0; i < lines.length; i++) {
			var intersect = Phaser.Line.intersects(ray, lines[i]);
			if (intersect) {
				// Find the closest intersection
				distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
				if (distance < distanceToWall) {
					distanceToWall = distance;
					closestIntersection = intersect;
					if (i == 0 || i == 3) closestIntersection.bounceType = 'H';
					else closestIntersection.bounceType = 'V';
				}
			}
		}
	}, this);
		
	return closestIntersection;
}
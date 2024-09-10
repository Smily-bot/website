var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");


// Inital starting position
var posX = 20,
posY = canvas.height / 2;

// No longer setting velocites as they will be random
// Set up object to contain particles and set some default values
var particles = {},
particleIndex = 0,
settings = {
  density: 0,
  particleSize: 5,
  startingX: canvas.width / 2,
  startingY: canvas.height / 4,
  gravity: 0.5,
  maxLife: 150,
  groundLevel: canvas.height,
  leftWall: canvas.width * 0.1,
  rightWall: canvas.width
};

// To optimise the previous script, generate some pseudo-random angles
var seedsX = [];
var seedsY = [];
var maxAngles = 100;
var currentAngle = 0;


var left = false;
var right = false;
var up = false;
var down = false;
var space = false;
function sound(src, loop) 
{
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.loop = loop;
    document.body.appendChild(this.sound);
    this.play = function()
	{
		this.sound.play();
    }
    this.stop = function()
	{
        this.sound.pause();
    }
	this.begin = function()
	{
		this.sound.currentTime = 0;
		this.play();
	}
}
function intersectRect(r1l, r1u, r1r, r1d, r2l, r2u, r2r, r2d)
{
	return !(r2l > r1r || r2r < r1l || r2u > r1d || r2d < r1u);
}
window.onload = function()
{
    var fps = 60;
	document.addEventListener("keydown", keydown);
	document.addEventListener("keyup", keyup);
	setInterval( gameloop, 1000 / fps);
}
function keydown(evt)
{
    //console.log(evt.keyCode);
	
	switch(evt.keyCode)
	{
		case 38: space = true; break;
	    case 37: left = true; break;
		case 38: up = true; break;
		case 39: right = true; break;
		case 40: down = true; break;
	}
}

function keyup(evt)
{
    //console.log(evt.keyCode);
	
	switch(evt.keyCode)
	{
		case 38: space = false; break;
	    case 37: left = false; break;
		case 38: up = false; break;
		case 39: right = false; break;
		case 40: down = false; break;
	}
}

function sprite(src){
this.sprite = document.createElement("img");
this.sprite.src = src;
this.x = 0;
this.y = 0;
this.draw = function(sx, sy){

this.x = sx;
this.y = sy;
ctx.drawImage(this.sprite, sx, sy);

//this.sprite.style.transform = "scaleX(1)";
}
}
function asprite(src){
this.asprite = document.createElement("img");
this.asprite.src = src;
this.framedraw = function(sx, sy, sw, sh, frame, anim){

ctx.drawImage(this.asprite, anim[frame-1].cx, anim[frame-1].cy, anim[frame-1].cw, anim[frame-1].ch, sx, sy, sw, sh);
//this.sprite.style.transform = "scaleX(1)";
}
this.framedrawdir = function(sx, sy, sw, sh, frame, anim, dir){

  // scaleX by -1; this "trick" flips horizontally
ctx.save();
ctx.scale(-1, 1);
ctx.drawImage(this.asprite, anim[frame-1].cx, anim[frame-1].cy, anim[frame-1].cw, anim[frame-1].ch, -sx-(sw/2), sy, sw, sh);
ctx.restore();

}
}

// Function to check whether a point is inside a rectangle
function isInside(pos, rect) {
  return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
}

function colide_with_sprite(x,y,o2){
return isInside({x : x, y : y},{x : o2.x, y : o2.y, width : o2.sprite.width, height : o2.sprite.height});
}

function seedAngles() {
  seedsX = [];
  seedsY = [];
  for (var i = 0; i < maxAngles; i++) {
    seedsX.push(Math.random() * 20 - 10);
    seedsY.push(Math.random() * 30 - 10);
   }
  }

// Start off with 100 angles ready to go
seedAngles();

// Set up a function to create multiple particles
function Particle() {
   if (currentAngle !== maxAngles) {
     // Establish starting positions and velocities
     this.x = settings.startingX;
     this.y = settings.startingY;

     this.vx = seedsX[currentAngle];
          this.vy = seedsY[currentAngle];

          currentAngle++;

          // Add new particle to the index
          // Object used as it's simpler to manage that an array
          particleIndex ++;
          particles[particleIndex] = this;
          this.id = particleIndex;
          this.life = 0;
          this.maxLife = settings.maxLife;
        } else {
          console.log('Generating more seed angles');
          seedAngles();
          currentAngle = 0;
        }
      }

      // Some prototype methods for the particle's "draw" function
      Particle.prototype.draw = function() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Give the particle some bounce
        if ((this.y + settings.particleSize) > settings.groundLevel) {
          this.vy *= -0.6;
          this.vx *= 0.75;
          this.y = settings.groundLevel - settings.particleSize;
        }

        // Determine whether to bounce the particle off a wall
        if (this.x - (settings.particleSize) <= settings.leftWall) {
          this.vx *= -1;
          this.x = settings.leftWall + (settings.particleSize);
        }

        if (this.x + (settings.particleSize) >= settings.rightWall) {
          this.vx *= -1;
          this.x = settings.rightWall - settings.particleSize;
        }

        // Adjust for gravity
        this.vy += settings.gravity;

        // Age the particle
        this.life++;

        // If Particle is old, it goes in the chamber for renewal
        if (this.life >= this.maxLife) {
          delete particles[this.id];
        }

        // Create the shapes
        //context.fillStyle = "red";
        //context.fillRect(this.x, this.y, settings.particleSize, settings.particleSize);
        ctx.clearRect(settings.leftWall, settings.groundLevel, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle="#0000ff";
        // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
        ctx.arc(this.x, this.y, settings.particleSize, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
      }
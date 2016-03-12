// Build on top of this example: http://p5js.org/examples/demos/Hello_P5_Drawing.php

var paths = [];
var painting = false;
var current;
var previous;
var next = 0;
var pos_x = -1, pos_y = -1, pos_z = -1;

var VP_WIDTH = -1;
var VP_HEIGHT = -1;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  current = createVector(0,0);
  previous = createVector(0,0);
  // frameRate(100);
};

function draw() {
  background(240);
  
  if (millis() > next && painting) {

    current.x = pos_x;
    current.y = pos_y;

    var force = p5.Vector.sub(current, previous);
    force.mult(0.03);

    paths[paths.length - 1].add(current, force);

    next = millis() + random(30);

    previous.x = current.x;
    previous.y = current.y;
  }

  for (var i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

var flag = false;
Leap.loop(function(frame) {
  frame.hands.forEach(function(hand, index) {
    // console.log(hand.grabStrength)
    pos_x = hand.screenPosition()[0];
    pos_y = hand.screenPosition()[1];
    grabStrength = hand.grabStrength;

    if (!flag && Math.abs(hand.roll()) > 1) {
      flag = true;
      if (!painting) {
        painting = true;
        previous.x = pos_x;
        previous.y = pos_y;
        paths.push(new Path(grabStrength));
      } else {
        next = 0;
        painting = false;
      }
    } 
    if (Math.abs(hand.roll()) <= 1) {
      flag = false;
    }
  });
  
}).use('screenPosition', {scale: 0.35});

function Path(grabStrength) {
  this.particles = [];
}

Path.prototype.add = function(position, force) {
  this.particles.push(new Particle(position, force, hue));
}

Path.prototype.update = function() {  
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].update();
  }
}  

Path.prototype.display = function() {
  for (var i = this.particles.length - 1; i >= 0; i--) {
    if (this.particles[i].lifespan <= 0) {
      this.particles.splice(i, 1);
    } else {
      this.particles[i].display(this.particles[i+1]);
    }
  }
}  

function Particle(position, force, hue) {
  this.position = createVector(position.x, position.y);
  this.velocity = createVector(force.x/1.5, force.y/1.5);
  this.offset = createVector(0, 0);
  this.drag = 0.98;
  this.lifespan = .8;
  this.weight = 2 + random(8);
  this.grabStrength = grabStrength;
}

Particle.prototype.update = function() {
  this.offset.add(this.velocity);
  this.position.add(this.velocity);
  this.velocity.mult(this.drag);
  this.lifespan -= 0.006;
}

Particle.prototype.display = function(other) {
  if (other) {
    noFill();

    colorMode(HSB);

    strokeCap(ROUND);
    strokeWeight(this.weight);
    stroke(this.position.y, (1-this.grabStrength)*70, (1-this.grabStrength)*70, this.lifespan);

    bezier(
      this.position.x, this.position.y,
      this.position.x - this.offset.y, this.position.y - this.offset.x,
      other.position.x + this.offset.y, other.position.y + this.offset.x,
      other.position.x, other.position.y
    );

    bezier(
      VP_WIDTH - this.position.x, this.position.y,
      VP_WIDTH - this.position.x - this.offset.y, this.position.y - this.offset.x,
      VP_WIDTH - other.position.x + this.offset.y, other.position.y + this.offset.x,
      VP_WIDTH - other.position.x, other.position.y
    );

    strokeWeight(this.weight / 3);
    stroke(this.position.y, (1-this.grabStrength)*30, (1-this.grabStrength)*30, this.lifespan/3);

    bezier(
      VP_WIDTH - this.position.x, this.position.y,
      VP_WIDTH - this.position.x - this.offset.y, this.position.y - this.offset.x,
      other.position.x + this.offset.y, other.position.y + this.offset.x,
      other.position.x, other.position.y
    );

    strokeWeight(15 + this.weight * 5);
    stroke(this.position.y, (1-this.grabStrength)*100, 255, this.lifespan/10);
    bezier(
      this.position.x, this.position.y,
      this.position.x - this.offset.y, this.position.y - this.offset.x,
      other.position.x + this.offset.y, other.position.y + this.offset.x,
      other.position.x, other.position.y
    );
  }
}

Leap.loopController.setBackground(true);

$(document).ready(function() { 
  $('#btn-save').click(function() {
    saveCanvas(canvas,'draw','jpg');
  });
  VP_HEIGHT = $(window).height();
  VP_WIDTH = $(window).width();
});

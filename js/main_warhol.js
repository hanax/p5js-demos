var painting = false;
var canvas;
var OFF = 210;
var SIZE = 190;
var mode = 0; // 0: draw line; 1: draw dots;
var COLORS = [
  '#446694', '#627258', '#100043', '#689b02', '#ea0202', '#f1bbaf', '#a16900', '#a6d3bf', '#f0bc8d', '#f0bc10', '#aa2000', '#f4a900'
];
var BG_COLORS = [
  '#eb0049', '#8fd3aa', '#db314c', '#edbab7'
];
var cur_colors = [];

function getRandColor() {
  return COLORS[Math.floor((Math.random() * COLORS.length))];
}

function getRandBgColor() {
  var idx = Math.floor((Math.random() * BG_COLORS.length));
  var c = BG_COLORS[idx];
  BG_COLORS.splice(idx, 1);
  return c;
}

function setup() {
  canvas = createCanvas(430, 430);
  current = createVector(0,0);
  previous = createVector(0,0);
  background(230);
  noStroke();
  fill(getRandBgColor());
  rect(10, 10, 200, 200);
  fill(getRandBgColor());
  rect(10, 220, 200, 200);
  fill(getRandBgColor());
  rect(220, 10, 200, 200);
  fill(getRandBgColor());
  rect(220, 220, 200, 200);

  frameRate(1000);
};

function draw() {

  current.x = mouseX;
  current.y = mouseY;

  var force = p5.Vector.sub(current, previous);
  force.mult(0.5);

  strokeWeight(Math.max(1, 6 - 1.5*Math.sqrt((force.x*force.x) + (force.y*force.y))));

  if (!(previous.x >= 10 && previous.x <= OFF && previous.y >= 10 && previous.y <= OFF)) {
    previous.x = mouseX;
    previous.y = mouseY;
    return;
  }

  if (painting && mouseX >= 10 && mouseX <= OFF && mouseY >= 10 && mouseY <= OFF) {
    if (mode === 0) {
      stroke(cur_colors[0]);
      line(mouseX, mouseY, previous.x, previous.y);
      stroke(cur_colors[1]);
      line(mouseX + OFF, mouseY, previous.x + OFF, previous.y);
      stroke(cur_colors[2]);
      line(mouseX, mouseY + OFF, previous.x, previous.y + OFF);
      stroke(cur_colors[3]);
      line(mouseX + OFF, mouseY + OFF, previous.x + OFF, previous.y + OFF);
      previous.x = mouseX;
      previous.y = mouseY;
    } else if (mode === 1) {
      noStroke();
      fill(getRandColor());
      var size = 1 + Math.random()*10;
      if (Math.random() < 0.05) {
        ellipse(mouseX + Math.random()*15, mouseY + Math.random()*10, size, size);
        ellipse(mouseX + OFF + Math.random()*15, mouseY + Math.random()*10, size, size);
        ellipse(mouseX + Math.random()*15, mouseY + OFF + Math.random()*10, size, size);
        ellipse(mouseX + OFF + Math.random()*15, mouseY + OFF + Math.random()*10, size, size);
      }
      if (Math.random() > 0.95) {
        ellipse(mouseX - Math.random()*10, mouseY - Math.random()*10, size, size);
        ellipse(mouseX + OFF - Math.random()*10, mouseY - Math.random()*10, size, size);
        ellipse(mouseX - Math.random()*10, mouseY + OFF - Math.random()*10, size, size);
        ellipse(mouseX + OFF - Math.random()*10, mouseY + OFF - Math.random()*10, size, size);
      }
    }

  }
}

function mousePressed() {
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  cur_colors = [];
  cur_colors.push(getRandColor());
  cur_colors.push(getRandColor());
  cur_colors.push(getRandColor());
  cur_colors.push(getRandColor());
}

function mouseReleased() {
  painting = false;
}

$(document).ready(function() { 
  $('body').on('touchstart', function(e) {
    console.log($(e.target).hasClass('btn'))
    if (!$(e.target).hasClass('btn') && !$(e.target).parent().hasClass('switch') && !$(e.target).is('#copyright') && !$(e.target).parent().is('#copyright')) {
      e.preventDefault();
    }
  });
  $('.switch').click(function() {
    mode = 1 - mode;
    if (mode === 0) {
      $('.switch').text('line');
      $('.switch').css('background-color', '#fbbf07');
    } else {
      $('.switch').text('dots');
      $('.switch').css('background-color', '#c40a0d');
    }
  });
  $('#btn-save').click(function() {
    saveCanvas(canvas,'warhol-pollock','jpg');
  });
});

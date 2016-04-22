var sound = null;
var amplitude, cnv;
var idx_x, idx_y;
var hue;

function preload(){
  // sound = loadSound('./assets/beautiful_freak.mp3');
}

function setup() {
  idx_x = 0;
  idx_y = 0;
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.drop(gotFile);

  amplitude = new p5.Amplitude();

  cnv.mouseClicked(function() {
    if (sound) {
      if (sound.isPlaying() ){
        sound.pause();
      } else {
        sound.play();
      }
    } else {
      sound = loadSound('./assets/beautiful_freak.mp3', function() {
        background(0);
        idx_x = 0;
        idx_y = Math.max(0, windowHeight / 2 - sound.duration() / 35 * 20);
        hue = 255 * Math.random();
        sound.play();
      });
    }
  });
}

function draw() {
  if (sound && sound.isPlaying()) {
    fill(255);
    var level = amplitude.getLevel();
    var l = map(level, 0, 0.5, 0, 255);

    colorMode(HSB, 255);
    var c = color(hue, l, l);
    // var c = color(l, l, l);

    stroke(c);

    line(idx_x, idx_y, idx_x, idx_y + 20);
    if (idx_x == windowWidth) {
      idx_x = 0;
      idx_y += 21;
      hue = (hue + 10) % 255;
    }
    idx_x ++;
  }
}

function gotFile(file) {
  if (sound) {
    sound.dispose();
  }
  sound = loadSound(file, function() {
    background(0);
    idx_x = 0;
    idx_y = Math.max(0, windowHeight / 2 - sound.duration() / 35 * 20);
    hue = 255 * Math.random();
    sound.play();
  });
}

$(document).ready(function() { 
  $('#btn-save').click(function() {
    saveCanvas(canvas,'viz','jpg');
  });
});

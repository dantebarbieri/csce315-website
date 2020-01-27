let ball_bounce = function(p) {
  let ball_bounce_canvas;
  let ball_bounce_parent;
  let lightColor;
  const r = 60;
  const l = 1800;
  const w = 1800;
  const d = 1800;
  let J = 1;
  let pos;
  let vel;
  let acc;
  let bounding_box;
  let ball;
  let x_ang, y_ang;
  let zoom = (l + w) / 1.5;
  let zoom_delta = 0;

  p.mouseOnCanvas = function() {
    return 0 <= p.mouseX && p.mouseX <= p.width && 0 <= p.mouseY && p.mouseY <= p.height;
  }

  p.setup = function() {
    // window.addEventListener("contextmenu", function (e) {
    //   e.preventDefault();
    // });
    ball_bounce_canvas = p.createCanvas(100, 100, p.WEBGL);
    ball_bounce_canvas.parent('ball-bounce-div');
    ball_bounce_parent = p.select('#ball-bounce-div');
    p.select('#impulse-span').html(J * 100);
    p.resizeCanvas(ball_bounce_parent.width, ball_bounce_parent.height);
    p.noStroke();
    bounding_box = new Box(l, w, d, p)
    pos = p.createVector(p.random(-l / 2, l / 2), p.random(-w / 2, w / 2), p.random(-d / 2, d / 2));
    vel = p.createVector(p.random(10), -p.random(10), p.random(10));
    acc = p.createVector(0, 1, 0);
    ball = new Ball(pos, vel, acc, r, J, bounding_box, p)
  }

  p.windowResized = function() {
    p.resizeCanvas(100, 100); // Allow parent to resize to minimum
    ball_bounce_parent = p.select('#ball-bounce-div');
    p.resizeCanvas(ball_bounce_parent.width, ball_bounce_parent.height);
  }

  p.draw = function() {
    p.background(102, 102, 102);

    zoom += zoom_delta;

    p.translate(0, 0, -zoom);

    if(p.mouseOnCanvas()) {
      x_ang = p.map(p.mouseY, 0, p.height, -p.QUARTER_PI, p.QUARTER_PI);
      y_ang = p.map(p.mouseX, 0, p.width, -p.QUARTER_PI, p.QUARTER_PI);
    }

    p.rotateX(x_ang);
    p.rotateY(y_ang)

    p.push();
    p.pointLight(250, 250, 250, 0, 0, w / 4);

    bounding_box.show();

    p.pop();

    ball.show();

    p.pop();

    ball.update();
  }

  p.mousePressed = function() {
    if (p.mouseButton == p.LEFT && p.mouseOnCanvas()) {
      ball.vel.y = p.abs(ball.vel.y) * 3 * ball.J / 2;
    }
  }

  p.keyTyped = function() {
    if ((p.key == "l" || p.key == "L") && p.mouseOnCanvas()) {
      ball.lines = !ball.lines;
    }
    else if ((p.key == "k" || p.key == "K") && p.mouseOnCanvas()) {
      ball.shadow = !ball.shadow;
    }
    else if ((p.key == "b" || p.key == "B" || p.key == " ") && p.mouseOnCanvas()) {
      ball.vel.y -= ball.r / 6;
    }
    else if ((p.key == "w" || p.key == "W") && p.mouseOnCanvas()) {
      ball.vel.z -= ball.r / 6;
    }
    else if ((p.key == "s" || p.key == "S") && p.mouseOnCanvas()) {
      ball.vel.z += ball.r / 6;
    }
    else if ((p.key == "a" || p.key == "A") && p.mouseOnCanvas()) {
      ball.vel.x -= ball.r / 6;
    }
    else if ((p.key == "d" || p.key == "D") && p.mouseOnCanvas()) {
      ball.vel.x += ball.r / 6;
    }
    else if ((p.key == "[" || p.key == "{") && p.mouseOnCanvas()) {
      ball.J -= 0.05;
      if (ball.J < 0) {
        ball.J = 0;
      }
      p.select('#impulse-span').html(p.round(ball.J * 100));
    }
    else if ((p.key == "]" || p.key == "}") && p.mouseOnCanvas()) {
      ball.J += 0.05;
      p.select('#impulse-span').html(p.round(ball.J * 100));
    }
    else if ((p.key == "-" || p.key == "_") && p.mouseOnCanvas()) {
      zoom_delta = 5;
    }
    else if ((p.key == "=" || p.key == "+") && p.mouseOnCanvas()) {
      zoom_delta = -5;
    }
  }

  p.keyReleased = function() {
    if ((p.key == "-" || p.key == "_") && p.mouseOnCanvas()) {
      if(p.keyIsDown(61)) zoom_delta = -5;
      else zoom_delta = 0;
    }
    else if (p.key == "=" || p.key == "+") {
      if(p.keyIsDown(173)) zoom_delta = 5;
      else zoom_delta = 0;
    }
  }

  sgn = function(n = 0) {
    if (n > 0) {
      return 1;
    }
    if (n < 0) {
      return -1;
    }
    return 0;
  }
}

let travelling_salesman = function (p) {
  const TOTAL_POINTS = 12;
  const SPEED = 10;

  let travelling_salesman_canvas;
  let travelling_salesman_parent;

  let points = [];

  let record_distance;
  let best_ever;
  let d;

  p.setup = function() {
    travelling_salesman_canvas = p.createCanvas(100, 100);
    travelling_salesman_canvas.parent('travelling-salesman-div');
    travelling_salesman_parent = p.select('#travelling-salesman-div');
    p.resizeCanvas(travelling_salesman_parent.width, travelling_salesman_parent.height);
    p.textSize(p.width / 25);
    p.fill(255);
    p.noStroke();
    for (let i = 0; i < TOTAL_POINTS; i++) {
      points.push(p.createVector(p.random(p.width / 10, 9 * p.width / 10), p.random(p.height / 10, 9 * p.height / 10)));
    }
    record_distance = calcPathLength(points);
    best_ever = points.slice();
  }

  p.windowResized = function() {
    p.resizeCanvas(100, 100); // Allow parent to resize to minimum
    travelling_salesman_parent = p.select('#travelling-salesman-div');
    p.resizeCanvas(travelling_salesman_parent.width, travelling_salesman_parent.height);
  }

  p.draw = function() {
    p.background(0);
    p.text("Traveling Salesman Problem", p.width / 7, p.width / 25);
    p.text("Distance: " + p.round(record_distance), 0, p.height);

    for (let i = 0; i < SPEED; i++) {
      let swaps = [];
      let num_swaps = p.random(1, points.length);
      for (let j = 0; j < i; j++) {
        num_swaps = p.random(1, num_swaps);
      }
      for (let j = 0; j < num_swaps; j++) {
        swaps.push(p.floor(p.random(points.length)));
      }
      points = best_ever.slice();
      points = swap(points, swaps);

      d = calcPathLength(points);
      if (d < record_distance) {
        record_distance = d;
        best_ever = points.slice();
      }
    }

    p.noFill();
    p.stroke(255, 255, 255, 102);
    p.strokeWeight(1.5);
    p.beginShape();
    for (let i = 0; i < points.length; i++) {
      p.vertex(points[i].x, points[i].y);
    }
    p.endShape(p.CLOSE);

    p.stroke(32, 255, 0, 204);
    p.strokeWeight(2);
    p.beginShape();
    for (let i = 0; i < best_ever.length; i++) {
      p.vertex(best_ever[i].x, best_ever[i].y);
    }
    p.endShape(p.CLOSE);

    p.fill(255);
    p.noStroke();
    for (let point of points) {
      p.ellipse(point.x, point.y, 12);
    }

    if (d > record_distance) {
      points = best_ever.slice();
    }
  }

  swap = function (arr, indices) {
    let temp = arr[indices[0]];
    for (let i = 0; i < indices.length - 1; i++) {
      arr[indices[i]] = arr[indices[i + 1]];
    }
    arr[indices[indices.length - 1]] = temp;
    return arr;
  }

  calcPathLength = function (path) {
    let sum = 0;
    for (let i = 0; i < path.length - 1; i++) {
      sum += p.dist(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
    }
    return sum;
  }
}

let orbital_art = function(p) {
  let orbital_art_canvas;
  let orbital_art_parent;

  let orbiters = []
  let masses = []
  let draw_masses = false;
  let auto_clear;

  p.mouseOnCanvas = function() {
    return 0 <= p.mouseX && p.mouseX <= p.width && 0 <= p.mouseY && p.mouseY <= p.height;
  }

  p.setup = function() {
    orbital_art_canvas = p.createCanvas(100, 100);
    orbital_art_canvas.parent('orbital-art-div');
    orbital_art_parent = p.select('#orbital-art-div');
    p.resizeCanvas(orbital_art_parent.width, orbital_art_parent.height);
    p.noStroke();
    for (let i = 0; i < 5; i++) {
      masses.push(new Mass(p, p.random(50, 150), p.createVector(p.random(p.width / 4, 3 * p.width / 4), p.random(p.height / 4, 3 * p.height / 4)), p.createVector(p.random(-5, 5), p.random(-5, 5))));
    }
    for (let i = 0; i < 5; i++) {
      let r = p.random(25, 35);
      orbiters.push(new Orbiter(p, r, 2 * r / 3, 4 * r / 3, p.random(5, 25), 1, p.createVector(p.random(p.width / 5, 4 * p.width / 5), p.random(p.height / 5, 4 * p.height / 5))));
    }
    p.background(0);
    p.fill(51);
    p.rect(p.width / 4, p.height / 4, p.width / 2, p.height / 2);
    auto_clear = false;
  }

  p.windowResized = function() {
    p.resizeCanvas(100, 100);
    orbital_art_parent = p.select('#orbital-art-div');
    p.resizeCanvas(orbital_art_parent.width, orbital_art_parent.height);
  }

  p.draw = function () {
    if(auto_clear){
      p.background(0, 0, 0, 127);
    }
    for (let mass of masses) {
      mass.update();
      if(draw_masses)
        mass.draw();
    }
    for (let orbiter of orbiters) {
      orbiter.update(masses);
      orbiter.draw();
    }

  }

  p.mousePressed = function () {
    if (p.mouseButton == p.LEFT && p.mouseOnCanvas()) {
      masses.push(new Mass(p));
    }
  }

  p.keyTyped = function() {
    if ((p.key == "c" || p.key == "C") && p.mouseOnCanvas()) {
      p.background(0);
      p.fill(51);
      p.rect(p.width / 4, p.height / 4, p.width / 2, p.height / 2);
    }
    else if ((p.key == "a" || p.key == "A") && p.mouseOnCanvas()) {
      auto_clear = !auto_clear;
    }
    else if ((p.key == "x" || p.key == "X") && p.mouseOnCanvas()) {
      masses.pop();
    }
    else if ((p.key == "=" || p.key == "+") && p.mouseOnCanvas()) {
      let r = p.random(25, 35);
      orbiters.push(new Orbiter(p, r, 2 * r / 3, 4 * r / 3, p.random(5, 25), 1, p.createVector(p.random(p.width / 5, 4 * p.width / 5), p.random(p.height / 5, 4 * p.height / 5))));
    }
    else if ((p.key == "-" || p.key == "_") && p.mouseOnCanvas()) {
      orbiters.pop();
    }
    else if ((p.key == "[" || p.key == "{") && p.mouseOnCanvas()) {
      for(let orbiter of orbiters) {
        orbiter.lifetime /= 1.5;
        orbiter.killOldRings();
      }
    }
    else if ((p.key == "]" || p.key == "}") && p.mouseOnCanvas()) {
      for(let orbiter of orbiters) {
        orbiter.lifetime *= 1.5;
      }
    }
    else if ((p.key == "m" || p.key == "M") && p.mouseOnCanvas()) {
      draw_masses = !draw_masses;
    }
  }
}

let ball_bounce_sketch = new p5(ball_bounce, 'ball-bounce-div');
let travelling_salesman_sketch = new p5(travelling_salesman, 'travelling-salesman-div');
let orbital_art_sketch = new p5(orbital_art, 'orbital-art-div');
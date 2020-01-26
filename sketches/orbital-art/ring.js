function Ring(x, y, p, rad = 30, lifetime = Infinity, age = 0, colors = [random(1000), random(1000), random(1000)]) {
  this.pos = p.createVector(x, y);
  this.rad = rad;
  this.lt = lifetime;
  this.age = age;
  this.p = p;

  this.draw = function() {
    this.p.push();
    this.p.stroke(this.p.noise(colors[0]) * 255, this.p.noise(colors[1]) * 255, this.p.noise(colors[2]) * 255);
    // stroke(random(255), random(255), random(255));
    this.p.strokeWeight(1.5);
    this.p.noFill();
    this.p.ellipse(this.pos.x, this.pos.y, this.rad);
    colors[0] += 0.05;
    colors[1] += 0.05;
    colors[2] += 0.05;
    this.p.pop();
  }

  this.update = function() {
    if (this.age >= this.lt) {
      return -1;
    }
    let vel = p5.Vector.random2D().mult(this.p.random(5));
    this.pos.add(vel);
    this.age++;
    return age;
  }
}

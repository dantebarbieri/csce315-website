function Mass(p, mass = 100, pos = null, v = null) {
  this.m = mass;
  this.im = mass;
  this.mpos = p.random(1000);
  this.pos = (pos == null) ? p.createVector(p.mouseX, p.mouseY) : pos;
  this.vel = (v == null) ? p.createVector(1, 1) : v;
  this.ivel = this.vel.copy();
  this.p = p;

  this.draw = function() {
    this.p.push();
    this.p.fill(0, 255, 0);
    this.p.ellipse(this.pos.x, this.pos.y, this.m);
    this.p.pop();
  }

  this.update = function() {
    this.m += this.p.map(this.p.noise(this.mpos), 0, 1, -this.im / 40, this.im / 40);
    this.pos.add(this.vel);
    if (this.pos.x < this.p.width / 4 || this.pos.x > 3 * this.p.width / 4) {
      this.vel.x *= -1;
    }
    if (this.pos.y < this.p.height / 4 || this.pos.y > 3 * this.p.height / 4) {
      this.vel.y *= -1;
    }
    this.vel.setMag(this.ivel.mag() * this.p.map(this.m, this.im / 20, 21 * this.im / 20, 1, 0.001));
    if (this.m < this.im / 20) {
      this.m = this.im / 20;
    }
    if (this.m > 21 * this.im / 20) {
      this.m = 21 * this.im / 20;
    }
    this.mpos += 0.25;
  }
}
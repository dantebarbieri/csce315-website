function Orbiter(p, r = 30, lr = 20, ur = 40, lt = 15, vm = 1, pos = createVector(width / 4, height / 4)) {
  this.rad = r;
  this.lrad = lr;
  this.urad = ur;
  this.lifetime = lt;
  this.velMult = vm;
  this.rpos = p.random(1000);
  this.gpos = p.random(1000);
  this.bpos = p.random(1000);
  this.rings = [];
  this.pos = pos;
  this.vel = p.createVector(p.random(-10, 10), p.random(-10, 10));
  this.acc;
  this.p = p;

  this.killOldRings = function() {
    for (let i = this.rings.length - 1; i >=0; --i) {
      if(this.rings[i].age >= this.lifetime) this.rings.splice(i, 1);
    }
  }

  this.update = function(masses) {
    this.acc = this.p.createVector(0,0);
    for(let mass of masses){
      let r = this.p.createVector(mass.pos.x - this.pos.x, mass.pos.y - this.pos.y);
      let rHat = r.copy().normalize();
      this.acc.add(rHat.mult(mass.m / r.magSq()));
    }
    this.acc.normalize();
    this.vel.add(this.acc);
    this.vel.mult(this.velMult);
    this.vel.limit(15);
    this.pos.add(this.vel);
    if(this.pos.x > this.p.width){
      this.pos.x = this.p.width;
    }
    if(this.pos.x < 0){
      this.pos.x = 0;
    }
    if(this.pos.y > this.p.height){
      this.pos.y = this.p.height;
    }
    if(this.pos.y < 0){
      this.pos.y = 0;
    }
    if (this.rings.length < 500) {
      this.rings.push(new Ring(this.pos.x, this.pos.y, this.p, this.p.random(this.lrad, this.urad), this.lifetime, 0, [this.rpos, this.gpos, this.bpos]));
    }
  }

  this.draw = function() {
    this.p.fill(this.p.noise(this.rpos) * 255, this.p.noise(this.gpos) * 255, this.p.noise(this.bpos) * 255);
    // fill(random(255), random(255, random(255)));
    this.p.ellipse(this.pos.x, this.pos.y, this.rad);
    for (let i = this.rings.length - 1; i >= 0; i--) {
      this.rings[i].draw();
      if (this.rings[i].update() == -1) {
        this.rings.splice(i, 1);
      }
    }
    this.rpos += 0.05;
    this.gpos += 0.05;
    this.bpos += 0.05;
  }
}
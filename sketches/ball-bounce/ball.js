class Ball {
  constructor(position, velocity, acceleration, radius, impulse, bounds, p) {
    this.pos = position.copy();
    this.vel = velocity.copy();
    this.acc = acceleration.copy();
    this.r = radius;
    this.J = impulse;
    this.lines = false;
    this.shadow = true;
    this.bounds = bounds;
    this.p = p;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    if (this.pos.x + this.r >= this.bounds.l / 2) {
      this.vel.x *= -this.J;
      this.pos.x = this.bounds.l / 2 - this.r;
    }

    if (this.pos.x - this.r <= -this.bounds.l / 2) {
      this.vel.x *= -this.J;
      this.pos.x = -this.bounds.l / 2 + this.r;
    }

    if (this.pos.y + this.r >= this.bounds.w / 2) {
      this.vel.y *= -this.J;
      this.pos.y = this.bounds.w / 2 - this.r;
    }

    if (this.pos.y - this.r <= -this.bounds.w / 2) {
      this.vel.y *= -this.J;
      this.pos.y = -this.bounds.w / 2 + this.r;
    }

    if (this.pos.z + this.r >= this.bounds.h / 2) {
      this.vel.z *= -this.J;
      this.pos.z = this.bounds.h / 2 - this.r;
    }

    if (this.pos.z - this.r <= -this.bounds.h / 2) {
      this.vel.z *= -this.J;
      this.pos.z = -this.bounds.h / 2 + this.r;
    }
  }

  show() {
    this.p.push();
    this.p.translate(this.pos.x, this.pos.y, this.pos.z);
    this.p.push();
    this.p.ambientMaterial(255);
    this.p.sphere(this.r);
    this.p.pop();
    this.show_lines(this.lines);
    this.show_shadow(this.shadow);
  }

  show_shadow(to_be_shown) {
    if (to_be_shown) {
      this.p.push();
      this.p.translate(0, this.bounds.h / 2 - this.pos.y, 0);
      this.p.rotateX(this.p.HALF_PI);
      this.p.fill(0, 0, 0, 204);
      this.p.noStroke();
      this.p.ellipse(0, 0, this.p.map(this.pos.y, -this.bounds.h, this.bounds.h, 3 * this.r, 0.75 * this.r));
      this.p.pop();
    }
  }

  show_lines(to_be_shown) {
    if (to_be_shown) {
      this.p.push();
      this.p.rotateX(this.p.PI);
      this.p.translate(0, -this.p.floor(this.vel.y * this.r / 8 + sgn(this.vel.y) * 2 * this.r), 0);
      this.p.specularMaterial(0, 255, 0);
      this.p.box(10, this.p.floor(this.p.abs(this.vel.y * this.r / 4)), 10);
      this.p.pop();

      this.p.push();
      this.p.rotateZ(this.p.HALF_PI)
      this.p.translate(0, -this.p.floor(this.vel.x * this.r / 8 + sgn(this.vel.x) * 2 * this.r), 0);
      this.p.ambientMaterial(255, 0, 0);
      this.p.box(10, this.p.floor(this.p.abs(this.vel.x * this.r / 4)), 10);
      this.p.pop();

      this.p.push();
      this.p.rotateX(this.p.HALF_PI);
      this.p.translate(0, this.p.floor(this.vel.z * this.r / 8 + sgn(this.vel.z) * 2 * this.r), 0);
      this.p.ambientMaterial(0, 0, 255);
      this.p.box(10, this.p.floor(this.p.abs(this.vel.z * this.r / 4)), 10);
      this.p.pop();
    }
  }

}

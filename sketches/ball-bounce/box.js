class Box {
  constructor(length, width, height, p) {
    this.l = length;
    this.w = width;
    this.h = height;
    this.p = p;
  }

  show() {
    this.p.push();
    this.p.noFill();
    this.p.stroke(255);
    this.p.strokeWeight(5);
    this.p.box(this.l, this.w, this.h);
    this.p.pop();
  }
}

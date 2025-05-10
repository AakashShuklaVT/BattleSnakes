export class Particles {
    constructor(game) {
      this.game = game;
      this.x = 0;
      this.y = 0;
      this.radius = 0;
      this.speedX = 1;
      this.speedY = 1;
      this.color = '';
      this.angle;
      this.va = Math.random() * 0.2 - 0.1;
      this.free = true;
    }
  
    reset() {
      this.free = true;
      this.angle = 0;
    }
  
    start(x, y, color) {
      this.free = false;
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = Math.random() *  10 + 10;
      this.speedX = Math.random() * 30 - 15;
      this.speedY = Math.random() * 3 - 1;
    }

    update() {
        if (!this.free) {
            this.speedX *= 0.97;
            this.speedY -= 0.03;
            this.angle += this.va;
          this.x += Math.sin(this.speedX);
          this.y += this.speedY;
          if(this.radius > 4) this.radius -= 0.1;
          else this.reset();
        }
    }
    
    draw() {
        if (!this.free) {
            this.game.ctx2.fillStyle = this.color;
          this.game.ctx2.beginPath();
          this.game.ctx2.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          this.game.ctx2.fill();
          this.game.ctx2.stroke();
        }
    }
}
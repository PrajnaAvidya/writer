import Sketch from 'sketch-js';
import random from 'lodash/random';

const particleImage = new Image();
particleImage.src = '/images/book.png';
const particleImage2 = new Image();
particleImage2.src = '/images/pencil.png';
const particleImages = [
  {
    image: particleImage,
    dimensions: {
      x: 37,
      y: 35,
    },
  },
  {
    image: particleImage2,
    dimensions: {
      x: 32,
      y: 49,
    },
  },
];

const particles = [];
const particlePool = [];
const maxParticles = 100;

class Particle {
  constructor(x, y) {
    this.init(x, y);
  }

  init(x = 0.0, y = 0.0) {
    this.alive = true;
    this.life = 1;

    this.x = x;
    this.y = y;

    this.wander = random(0.5, 2.0);
    this.drag = random(0.9, 0.99);

    this.vx = random(-5, 5);
    this.vy = random(-5, -2);

    this.image = particleImages[Math.floor(Math.random() * particleImages.length)];
  }

  move() {
    if (this.alive) {
      this.x += this.vx;
      this.y += this.vy;

      this.vx *= this.drag;
      this.vy += 0.5;

      this.life *= 0.98;
      this.alive = this.life > 0.05;
    }
  }

  draw(ctx) {
    if (this.alive) {
      ctx.drawImage(this.image.image, this.x, this.y, this.image.dimensions.x, this.image.dimensions.y);
    }
  }
}

export default function () {
  return Sketch.create({
    container: document.getElementById('canvas'),
    retina: 'auto',
    click() {
      this.spawnParticle(this.mouse.x, this.mouse.y);
    },

    spawnParticle(x, y) {
      if (particles.length >= maxParticles) {
        particlePool.push(particles.shift());
      }

      const particle = new Particle();
      particle.init(x, y);
      particles.push(particle);
    },

    update() {
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        particles[i].move();
      }
    },

    draw() {
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        particles[i].draw(this);
      }
    },
  });
}

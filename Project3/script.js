const tank = document.getElementById("tank");
const fishWidth = 115;
const fishHeight = 115;
const minX = 0;
const minY = 0;
const maxX = tank.clientWidth - fishWidth;
const maxY = tank.clientHeight - fishHeight;

class Fish {
  constructor() {
    this.img = document.createElement("img");
    this.img.src = this.randomImage();
    this.img.className = "fish";
    this.x = Math.floor(Math.random() * (maxX - minX) + minX);
    this.y = Math.floor(Math.random() * (maxY - minY) + minY);
    this.dx = Math.random() < 0.5 ? -1 : 1;
    this.dy = Math.floor(Math.random() * 3) - 1;
    this.normalSpeed = 2;
    this.speed = this.normalSpeed;
    this.speedTimer = null;
    this.img.addEventListener("click", () => this.speedUp());
    tank.appendChild(this.img);
    this.draw();
    this.scheduleCheck();
  }

  randomImage() {
    let rand = Math.random();
    if (rand < 0.2) {
      return "fish1.png";
    } else if (rand < 0.4) {
      return "fish2.png";
    } else if (rand < 0.6) {
      return "fish3.png";
    } else if (rand < 0.8) {
      return "fish4.png";
    } else {
      return "fish5.png";
    }
  }

  move() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
    if (this.x < minX) {
      this.x = minX;
    }
    if (this.x > maxX) {
      this.x = maxX;
    }
    if (this.y < minY) {
      this.y = minY;
    }
    if (this.y > maxY) {
      this.y = maxY;
    }
    this.draw();
  }

  draw() {
    this.img.style.left = this.x + "px";
    this.img.style.top = this.y + "px";
    if (this.dx > 0) {
      this.img.classList.add("flip");
    } else {
      this.img.classList.remove("flip");
    }
  }

  scheduleCheck() {
    let delay = Math.floor(Math.random() * 6000) + 2000;
    setTimeout(() => {
      if (Math.random() < 0.5) {
        this.changeDirection();
      }
      this.scheduleCheck();
    }, delay);
  }

  changeDirection() {
    this.dx = -this.dx;
    this.dy = Math.floor(Math.random() * 3) - 1;
    this.draw();
  }

  speedUp() {
    this.speed = this.normalSpeed * 3;
    clearTimeout(this.speedTimer);
    this.speedTimer = setTimeout(() => {
      this.speed = this.normalSpeed;
    }, 3000);
  }
}




const fishes = [];
for (let i = 0; i < 7; i++) {
  fishes.push(new Fish());
}

setInterval(() => {
  for (let i = 0; i < fishes.length; i++) {
    fishes[i].move();
  }
}, 20);

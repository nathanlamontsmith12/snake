console.log("linked up: SNAKE")

class Food {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.height = 2;
        this.width = 3;
    }
    draw(){
        game.ctx.fillStyle = "limegreen"
        game.ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

class Snake {
    constructor(startX=5, startY=5, width=10, height=10, speed=5){
      this.x = startX;
      this.y = startY;
      this.height = height;
      this.increment = width;
      this.width = width;
      this.direction = "r";
      this.speed = speed; 
      this.active = false;
      this.hitbox = {
          xmin: startX,
          xmax: startX + width,
          ymin: startY,
          ymax: startY + height
      }
    }
    draw(){
       game.ctx.fillStyle = "limegreen"
       game.ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    move(){
        if (this.direction == "r") {
            if (this.x + this.width >= 500) {
                this.direction = "d"
            } else {
                this.x += this.speed;
            }
        }
        if (this.direction == "l") {
            if (this.x <= 0) {
                this.direction = "u"
            } else {
            this.x -= this.speed;
            }
        }
        if (this.direction == "u") {
            if (this.y <= 0) {
                this.direction = "r"
            } else {
                this.y -= this.speed;
            }
        }
        if (this.direction == "d") {
           if (this.y + this.height >= 500) {
                this.direction = "l"
           } else {
                this.y += this.speed;
           }
        }

        this.updateHitbox();
    }
    updateHitbox(){
        this.hitbox = {
            xmin: this.x,
            xmax: this.x + this.width,
            ymin: this.y,
            ymax: this.y + this.height
        }
    }
    changeDirection(dir){
        if (
            (this.direction == "d" && dir == "u") || 
            (this.direction == "u" && dir == "d") || 
            (this.direction == "r" && dir == "l") || 
            (this.direction == "l" && dir == "r") 
            ) {
                return;
        } else {
            this.direction = dir;
        }
    }
    check(){
        if (this.isDead()){
            game.endGame()
        };
        if(this.isEating()){
            this.eat()
        };
    }
    isDead(){
        
    }
    isEating(){
        const foodRangeX = [game.food.x, game.food.x + game.food.width]
        const foodRangeY = [game.food.y, game.food.y + game.food.height]
        if (
            (this.x < foodRangeX[0] && this.x + this.increment > foodRangeX[1]) &&
            (this.y < foodRangeY[0] && this.y + this.height > foodRangeY[1])
            ) {
                return true;
            } else {
                return false;
            }
    }
    eat(){
        game.food = null;
        this.width += this.increment;
        game.setFood();
    }
}

class Info {
    constructor(){

    }
    draw(){
        console.log("INFO SCREEN DRAW FIRED")
    }
}

const game = {
    player: null,
    animation: null,
    infoscreen: null,
    food: null,
    ctx: document.querySelector("canvas").getContext("2d"),
    start(){
        this.setFood();
        this.player = new Snake();
        this.infoscreen = new Info();
        this.infoscreen.draw();
        startAnimation();
    },
    setFood(){
        const randX = Math.floor(Math.random()*501)
        const randY = Math.floor(Math.random()*501)
        this.food = new Food(randX, randY)
    },
    wipe(){
        this.ctx.clearRect(0, 0, 500, 500)
    },
    updateDisplay(){
        this.wipe();
        if (this.food) {
            this.food.draw()
        }
        this.player.move();
        this.player.draw();
    },
    endGame(){
        this.stopAnimation();
        console.log("DEAD")
    },
    stopAnimation(){
        cancelAnimationFrame(this.animation)
        this.animation = null
    }
}

function startAnimation(){
    game.updateDisplay();
    const checkResult = game.player.check();
    if (checkResult) {
        game.endGame(checkResult)
    }
    game.animation = window.requestAnimationFrame(startAnimation)
}

document.body.addEventListener("keydown", (evt)=>{
    if(evt.key.slice(0, 5) === "Arrow"){
        game.player.changeDirection(evt.key[5].toLowerCase())
    }
})

game.start()
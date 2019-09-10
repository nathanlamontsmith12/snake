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
    constructor(speed=5, height=10){
      this.x = 5;
      this.y = 5;
      this.height = height;
      this.width = 10;
      this.direction = "r";
      this.speed = speed; 
      this.active = false;
    }
    activate(){
        this.active = true;
    }
    deactivate(){
        this.active = false;
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
        // this.checkWall();
        // this.checkFood();
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
        this.food = new Food(25, 25);
        this.player = new Snake();
        this.infoscreen = new Info();
        this.infoscreen.draw();
        startAnimation();
    },
    wipe(){
        this.ctx.clearRect(0, 0, 500, 500)
    },
    updateDisplay(){
        this.wipe();
        this.food.draw();
        this.player.move();
        this.player.draw();
    },
    endGame(condition){
        this.stopAnimation();
        alert(condition);
    },
    stopAnimation(){
        cancelAnimationFrame(this.animation)
        this.animation = null
    }
}

function s () {
    game.stopAnimation();
}

function g () {
    startAnimation();
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
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
    constructor(speed=1, height=5){
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
            this.x+=2;
        }
        if (this.direction == "l") {
            this.x-=2;
        }
        if (this.direction == "u") {
            this.y--;
        }
        if (this.direction == "d") {
            this.y++;
        }
    }
    changeDirection(dir){
        this.direction = dir;
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
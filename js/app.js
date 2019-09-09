console.log("linked up: SNAKE")

class Food {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.height = 10;
        this.length = 10;
    }
    draw(){
        console.log("FOOD DRAW FIRED")
    }
}

class Snake {
    constructor(speed=1, height=10){
      this.x = 0;
      this.y = 0;
      this.height = height;
      this.length = 10;
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
        console.log("SNAKE DRAW FIRED")
    }
    move(){
        console.log("MOVING")
    }
    check(){
        console.log("CHECKING")
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

game.start()
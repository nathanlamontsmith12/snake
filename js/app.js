console.log("linked up: SNAKE")

class Food {
    constructor(x, y, h=5, w=5){
        this.x = x;
        this.y = y;
        this.height = h;
        this.width = w;
        this.point = [x + Math.floor(w/2), y + Math.floor(h/2)]
        this.eaten = false;
    }
    draw(){
        game.ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    getCoordinates(){
        return this.point;
    }
}

class Segment {
    constructor(x, y, w=10, h=10) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    draw(){
        game.ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    getCoordinates(){
        return([this.x, this.y])
    }
}

class Snake {
    constructor(w=10, h=10){
        this.segments = [];
        this.headInd = 0;
        this.direction = "d";
        this.active = false;
        this.hasEaten = false;
        this.width = w;
        this.height = h;
        this.moveCount = 0;
        this.speed = 10 - game.difficulty*3;
    }
    activate(){
        for (let i = 1; i <= 5; i++){
            const newSeg = new Segment(this.width*i, 25, this.width, this.height)
            this.segments.push(newSeg)
        }
        this.active = true;
        if (this.speed <= 0) {
            this.speed = 1;
        }
    }
    draw(){
        this.segments.forEach(seg => seg.draw())
    }
    move(){
        if (this.active){
            this.addSegment()
            if (!this.hasEaten){
                this.removeSegment()
            } else {
                this.hasEaten = false;
            }
        }
    }
    addSegment(){
        let newX = this.segments[this.headInd].x;
        let newY = this.segments[this.headInd].y; 
        if (this.direction == "r"){
            newX += this.width;
        }
        if (this.direction == "l"){
            newX -= this.width;
        }
        if (this.direction == "d"){
            newY += this.width;
        }
        if (this.direction == "u"){
            newY -= this.width;
        }
        const newSeg = new Segment(newX, newY, this.width, this.height)
        if(this.headInd === 0) {
            this.segments.unshift(newSeg)
        } else {
            this.segments.push(newSeg)
        }
    }
    removeSegment(){
        if (this.headInd === 0) {
            this.segments.pop();
        } else {
            this.segments.shift();
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
            if (this.direction == "l"){
                this.headInd = 0;
            }
            if (this.direction == "r"){
                this.headInd = this.segments.length - 1;
            }
        }
    }
    handleNewFrame(){
        this.moveCount++;
        if (this.moveCount >= this.speed) {
            this.moveCount = 0;
            this.move();
            if (this.checkDeath()){
                this.active = false;
            } 
            if (this.checkEating()){
                this.hasEaten = true;
                game.food.eaten = true;
            }
        }
    }
    checkDeath(){
        const headLoc = this.segments[this.headInd].getCoordinates();
       
        // collision w/ walls: 
        if (headLoc[0] > game.ctx.canvas.width || headLoc[0] < 0 || 
            headLoc[1] > game.ctx.canvas.height || headLoc[1] < 0) {
            return true;
        }

        // collision w/ self: 
        for (let i = 0; i < this.segments.length; i++) {
            if (i === this.headInd) {
                continue;
            }
            const segmentLoc = this.segments[i].getCoordinates();
            if (headLoc[0] === segmentLoc[0] && headLoc[1] === segmentLoc[1]){
                return true;
            }
        }

        return false;
    }
    checkEating(){
        const headLoc = this.segments[this.headInd].getCoordinates();
        const foodLoc = game.food.getCoordinates();
        if (headLoc[0] < foodLoc[0] && 
            headLoc[0] + this.width > foodLoc[0] &&
            headLoc[1] < foodLoc[0] && 
            headLoc[1] + this.height > foodLoc[1]) {
                return true;
            } else {
                return false;
            }
    }
}

const game = {
    difficulty: 2,
    // difficulty: int btw. 0 and 3
    player: null,
    animation: null,
    infoscreen: null,
    food: null,
    ctx: document.querySelector("canvas").getContext("2d"),
    start(){
        this.ctx.fillStyle = "limegreen"
        this.setFood();
        this.player = new Snake();
        this.player.activate();
        startAnimation();
    },
    setFood(){
        const randX = Math.floor(Math.random() * (this.ctx.canvas.width - 50)) + 25;
        const randY = Math.floor(Math.random() * (this.ctx.canvas.height - 50)) + 25;
        this.food = new Food(randX, randY)
    },
    clearScreen(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    },
    nextFrame(){
        if (this.food.eaten) {
            this.setFood()
        } 
        this.player.handleNewFrame();
    },
    updateDisplay(){
        this.food.draw();
        this.player.draw();
    },
    endGame(){
        // do some stuff: 
        console.log("DEAD")
    }
}

function startAnimation(){
    game.clearScreen();
    game.nextFrame();
    game.updateDisplay();
    if (!game.player.active){
        stopAnimation();
        game.endGame();
        return;
    }
    game.animation = window.requestAnimationFrame(startAnimation)
}

function stopAnimation(){
    cancelAnimationFrame(game.animation)
    game.animation = null
}

document.body.addEventListener("keydown", (evt)=>{
    if(evt.key.slice(0, 5) === "Arrow"){
        game.player.changeDirection(evt.key[5].toLowerCase())
    }
})

game.start()
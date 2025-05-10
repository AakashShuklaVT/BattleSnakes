/** @type {HTMLCanvasElement} */
/** @type {CanvasRenderingContext2D} */

export class Snake {

    /**
     * 
     * @param {Game} game - game class object to use data
     * @param {number} x - position on x axis
     * @param {number} y - position on y axis
     * @param {number} speedX - horixontal speed 
     * @param {number} speedY - vertical speed 
     * @param {color} color - color of the snake
     * @param {number} score - counts score of player
     * @param {string} name - name of player
     */

    constructor(game, x, y, speedX, speedY, color, name, image) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.name = name;
        this.image = image;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
        this.width = this.game.cellSize; 
        this.height = this.game.cellSize;
        this.moving = true;
        this.score = 0;
        this.segments = [];
        this.length = 2;
        for(let i = 0; i < this.length; i++) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.segments.unshift({x : this.x, y : this.y, frameX : 0, frameY : 0});
        }
        // this.segments.unshift({ x: this.x, y: this.y, frameX : 0, frameY : 0 });
        this.readyToTurn = true;
    }

    /**
    * Updates the object's properties every frame (e.g., position, state).
    */

    update() {
        this.readyToTurn = true;

        // check collision

        if(this.game.checkCollision(this, this.game.food)) {

            
            if(this.game.food.frameY == 1) {
                if(this.score > 0)
                    this.score--;
                
                for(let i = 0; i < 5; i++) {
                    const particle = this.game.getParticle();
                    if(particle) {
                        particle.start(this.game.food.x * this.game.cellSize + this.game.cellSize * 0.5, this.game.food.y * this.game.cellSize + this.game.cellSize * 0.5, 'black');
                    }
                }
                this.game.sound.playSound(badBite);
                
                this.game.food.reset();
                if(this.length > 2) {
                    this.length--;
                    if(this.segments.length > this.length) {
                        this.segments.pop();
                    }
                }
            }
            
            else {
                for(let i = 0; i < 5; i++) {
                    const particle = this.game.getParticle();
                    if(particle) {
                        particle.start(this.game.food.x * this.game.cellSize + this.game.cellSize * 0.5, this.game.food.y * this.game.cellSize + this.game.cellSize * 0.5, 'gold');
                    }
                }
                this.game.sound.playSound(bite1);
                this.game.food.reset();
                this.score++;
                this.length++;
            }
        }

        // boundaries

        if(this.x <= 0 && this.speedX < 0 || this.x >= this.game.columns - 1 && this.speedX > 0) {
            this.moving = false;
        }

        if(this.y <= this.game.topMargin && this.speedY < 0 || this.y >= this.game.rows - 1 && this.speedY > 0) {
            this.moving = false;
        }

        if(this.moving) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.segments.unshift({x : this.x, y : this.y, frameX : 0, frameY : 0});
            // console.log(this.segments);
            
            if(this.segments.length > this.length) {
                this.segments.pop();
            }
        }

        // win condition
        if(this.score >= this.game.winningScore) {
            this.game.sound.playSound(win);
            this.resetScore();
            this.game.gameUi.triggerGameOver(this);
        }
    }

    /**
    * resets the score 
    */

    resetScore() {
        this.score = 0;
    }
    /**
     * Draws the object on the canvas using the rendering context.
    */

    draw() {
       
        this.segments.forEach((segment, i) => {
            if(this.game.debug) {
                if(i == 0) {
                    this.game.ctx.fillStyle = 'black';
                }
                else {
                    this.game.ctx.fillStyle = this.color;
                }
                this.game.ctx.fillRect(segment.x * this.game.cellSize, segment.y * this.game.cellSize, this.width, this.height);
            }
            this.setSpriteFrame(i);
            this.game.ctx.drawImage(this.image, segment.frameX * this.spriteWidth, segment.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, segment.x * this.game.cellSize, segment.y * this.game.cellSize, this.width, this.height);
        })
    }

    /**
     *  function move snake in respective direction
    */

    turnUp() {
        if(this.speedY == 0 && this.y > this.game.topMargin && this.readyToTurn) {
            this.speedX = 0;
            this.speedY = -1;
            this.moving = true;
            this.readyToTurn = false;
        }
    }

    /**
     *  function move snake in respective direction
    */

    turnDown() {
        if(this.speedY == 0 && this.y < this.game.rows - 1 && this.readyToTurn) {
            this.speedX = 0;
            this.speedY = 1;
            this.moving = true;
            this.readyToTurn = false;
        }
    }

    /**
     *  function move snake in respective direction
    */

    turnLeft() {
        if(this.speedX == 0 && this.x > 0 && this.readyToTurn) {
            this.speedX = -1;
            this.speedY = 0;
            this.moving = true;
            this.readyToTurn = false;
        }
    }

    /**
     *  function move snake in respective direction
    */

    turnRight() {
        if(this.speedX == 0 && this.x < this.game.columns - 1 && this.readyToTurn) {
            this.speedX = 1;
            this.speedY = 0;
            this.moving = true;
            this.readyToTurn = false;
        }
    }

    /**
     * Set frames for move animation
     * @param {number} index - index of the segments array
    */

    setSpriteFrame(index) {
        const segment = this.segments[index];
        const prevSegment = this.segments[index - 1];
        const nextSegment = this.segments[index + 1];
 
        if(index == 0){
            // head
            if(segment.y < nextSegment.y) {
                // up
                segment.frameX = 1;
                segment.frameY = 2;
            }
            else if(segment.y > nextSegment.y) {
                //down
                segment.frameX = 0;
                segment.frameY = 4;
            }
            else if(segment.x < nextSegment.x) {
                // left
                segment.frameX = 0;
                segment.frameY = 0;
            }
            else if(segment.x > nextSegment.x) {
                // right
                segment.frameX = 2;
                segment.frameY = 1;
            }
        }
        else if(index == this.segments.length - 1) {
            // tail
            if(prevSegment.y < segment.y) {
                // up
                segment.frameX = 1;
                segment.frameY = 4;
            }
            else if(prevSegment.y > segment.y) {
                // down
                segment.frameX = 0;
                segment.frameY = 2;
            }
            else if(prevSegment.x < segment.x) {
                // left
                segment.frameX = 2;
                segment.frameY = 0;
            }
            else if(prevSegment.x > segment.x) {
                // right
                segment.frameX = 0;
                segment.frameY = 1;
            }
        }
        else {
            // body
            if(nextSegment.x < segment.x && prevSegment.x > segment.x) {
                // horizontal right
                segment.frameX = 5;
                segment.frameY = 3;
 
            }
            else if(prevSegment.x < segment.x && nextSegment.x > segment.x) {
                // horizontal left
                segment.frameX = 5;
                segment.frameY = 2;
            }
            else if( prevSegment.y < segment.y && nextSegment.y > segment.y) {
                // vertical up
                segment.frameX = 1;
                segment.frameY = 3;
            }
            else if( nextSegment.y < segment.y && prevSegment.y > segment.y) {
                // vertical down
                segment.frameX = 0;
                segment.frameY = 3;
            }
            // bend
            else if(prevSegment.x < segment.x && nextSegment.y > segment.y) {
                // horizontal left, vertical up
                segment.frameX = 4;
                segment.frameY = 0;
            }
            else if( prevSegment.y > segment.y && nextSegment.x > segment.x) {
                // horizontal left, vertical down
                segment.frameX = 3;
                segment.frameY = 0;
            }
            else if( prevSegment .x > segment.x && nextSegment.y < segment.y) {
                // horizontal right, vertical down
                segment.frameX = 3;
                segment.frameY = 1;
            }
            else if( prevSegment.y < segment.y && nextSegment.x < segment.x) {
                // horizontal right, vertical up
                segment.frameX = 4;
                segment.frameY = 1;
            }
            // bend clock wise
            else if (nextSegment.x < segment.x && prevSegment.y > segment.y) {
                // right down
                segment.frameX = 3;
                segment.frameY = 2;
            }
            else if (prevSegment.x < segment.x && segment.y > nextSegment.y) {
                // down left
                segment.frameX = 3;
                segment.frameY = 3;
            }
           
            else if (nextSegment.x > segment.x && prevSegment.y < segment.y) {
                // left up
                segment.frameX = 2;
                segment.frameY = 3;
            }
            else if (prevSegment.x > segment.x && segment.y < nextSegment.y) {
                // up right
                segment.frameX = 2;
                segment.frameY = 2;
            }
            else {  
                segment.frameX = 2;
                segment.frameY = 0;
            }
        }
    }
}
    

export class Keyboard1 extends Snake {
     /**
     * 
     * @param {object} game - game class object to use data
     * @param {number} x - position on x axis
     * @param {number} y - position on y axis
     * @param {number} speedX - horixontal speed 
     * @param {number} speedY - vertical speed 
     * @param {color} color - color of the snake
     * @param {string} name - name of player
     */

    constructor(game, x, y, speedX, speedY, color, name, image) {
        super(game, x, y, speedX, speedY, color, name, image);

        window.addEventListener('keydown', (e) => {
            if(e.code == 'ArrowUp') this.turnUp();
            else if(e.code == 'ArrowDown') this.turnDown();
            else if(e.code == 'ArrowLeft') this.turnLeft();
            else if(e.code == 'ArrowRight') this.turnRight();
        })
    }
}

export class Keyboard2 extends Snake {
    /**
    * 
    * @param {object} game - game class object to use data
    * @param {number} x - position on x axis
    * @param {number} y - position on y axis
    * @param {number} speedX - horixontal speed 
    * @param {number} speedY - vertical speed 
    * @param {color} color - color of the snake
    * @param {string} name - name of player
    */

   constructor(game, x, y, speedX, speedY, color, name, image) {
       super(game, x, y, speedX, speedY, color, name, image);

       window.addEventListener('keydown', (e) => {
           if(e.code == 'KeyW') this.turnUp();
           else if(e.code == 'KeyS') this.turnDown();
           else if(e.code == 'KeyA') this.turnLeft();
           else if(e.code == 'KeyD') this.turnRight();
       })
   }
}

export class ComputerAi extends Snake {
     /**
     * 
     * @param {object} game - game class object to use data
     * @param {number} x - position on x axis
     * @param {number} y - position on y axis
     * @param {number} speedX - horixontal speed 
     * @param {number} speedY - vertical speed 
     * @param {color} color - color of the snake
     * @param {string} name - name of the player
     */

    constructor(game, x, y, speedX, speedY, color, name, image) {
        super(game, x, y, speedX, speedY, color, name, image);
        this.turnTimer = 0;
        
        // difficulty
        this.aiDifficulty = document.getElementById('aiDifficulty').value;
        this.turnInterval = Math.floor(Math.random() * this.aiDifficulty);
    }
    
    /**
     * Updates the object's properties every frame (e.g., position, state).
    */
   
   update() {
       super.update();
       if ((this.x === this.game.food.x && this.speedY === 0) || (this.y === this.game.food.y && this.speedX === 0)) {
           this.turn();
        } else {
            if (this.turnTimer < this.turnInterval) {
                this.turnTimer += 1;
            } else {
                this.turnTimer = 0;
                this.turn();
                this.turnInterval = Math.floor(Math.random() * this.aiDifficulty);
          }
        }
    }

    /**
     *  this methods make Ai player turn in random direction
    */

    turn() {
    const food = this.game.food;

    const canTurnUp = this.y > this.game.topMargin;
    const canTurnDown = this.y < this.game.rows - 1;
    const canTurnLeft = this.x > 0;
    const canTurnRight = this.x < this.game.columns - 1;

    if (food.x == this.x && food.y < this.y && this.speedY <= 0 && canTurnUp) {
        this.turnUp();
    } 
    else if (food.x == this.x && food.y > this.y && this.speedY >= 0 && canTurnDown) {
        this.turnDown();
    } 
    else if (food.y == this.y && food.x < this.x && this.speedX <= 0 && canTurnLeft) {
        this.turnLeft();
    } 
    else if (food.y == this.y && food.x > this.x && this.speedX >= 0 && canTurnRight) {
        this.turnRight();
    } 
    else {
        // fallback random movement avoiding walls
        const options = [];
        if (this.speedY === 0) {
            if (canTurnUp) options.push(() => this.turnUp());
            if (canTurnDown) options.push(() => this.turnDown());
        } else {
            if (canTurnLeft) options.push(() => this.turnLeft());
            if (canTurnRight) options.push(() => this.turnRight());
        }
        if (options.length > 0) {
            const randomTurn = options[Math.floor(Math.random() * options.length)];
            randomTurn();
        }
    }
}

}
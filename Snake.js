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

    constructor(game, x, y, speedX, speedY, color, name) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.name = name;
        this.image = document.getElementById('snakeCorgi');
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
            this.game.food.reset();
            this.score++;
            this.length++;
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
            this.game.gameUi.triggerGameOver();
        }
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
                console.log("last case");
                
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

    constructor(game, x, y, speedX, speedY, color, name) {
        super(game, x, y, speedX, speedY, color, name);

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

   constructor(game, x, y, speedX, speedY, color, name) {
       super(game, x, y, speedX, speedY, color, name);

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

    constructor(game, x, y, speedX, speedY, color, name) {
        super(game, x, y, speedX, speedY, color, name);
        this.turnTimer = 0;
        this.turnInterval;
        
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
            this.turnInterval = Math.floor(Math.random() * 8) + 5;
          }
        }
    }

    /**
     *  this methods make Ai player turn in random direction
    */

    turn() {
        this.turnTimer = 0;
        if (this.speedY === 0) {
          this.game.food.y < this.y ? this.turnUp() : this.turnDown();
        } else if (this.speedX === 0) {
          this.game.food.x < this.x ? this.turnLeft() : this.turnRight();
        }
    }
}
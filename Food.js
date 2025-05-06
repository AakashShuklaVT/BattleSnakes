export class Food {

    /**
     * 
     * @param {object} game - game class object to use data
    */

    constructor(game) {
        this.game = game;
        this.x;
        this.y;
        this.image = document.getElementById('mushroomSprite');
        this.frameX = 0;
        this.maxFrame = 8;
        this.spriteWidth = 200;
        this.spriteHeight = 400;
        this.reset();
    }

    /**
     *  method used to reset the position of food item
    */
    reset() {
        this.x = Math.floor(Math.random() * this.game.columns);
        this.y = Math.floor(Math.random() * (this.game.rows - 2)) + 2;
        console.log(this.x, this.y);
        this.frameX = 0;
    }
    
    /**
    * Updates the object's properties every frame (e.g., position, state).
    */
    update() {
        if(this.frameX < this.maxFrame) this.frameX++;
    }

    /**
     * Draws the object on the canvas using the rendering context.
    */

    draw() {
        this.game.ctx.fillStyle = 'white';
        if(this.game.debug)
            this.game.ctx.fillRect(this.x  * this.game.cellSize, this.y * this.game.cellSize, this.game.cellSize, this.game.cellSize);
        this.game.ctx.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.x * this.game.cellSize,
            (this.y - 1) * this.game.cellSize,
            this.game.cellSize,
            this.game.cellSize * 2
        );
    }
}
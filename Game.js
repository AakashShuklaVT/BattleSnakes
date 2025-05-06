/** @type {HTMLCanvasElement} */
/** @type {CanvasRenderingContext2D} */

import { Snake, Keyboard1, Keyboard2, ComputerAi} from "./Snake.js";
import {Food} from "./Food.js"
import { UI } from "./UI.js";
import { Background } from "./Background.js";

export class Game {
    
    /**
     * constructor for game class
     * @param {HTMLCanvasElement} canvas - The HTML canvas element used for rendering.
     * @param {CanvasRenderingContext2D} context - The 2D rendering context for drawing on the canvas.
    */

    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx= context;

        this.gameOver = true;
        this.winningScore = 10;

        this.debug = true;

        this.width;
        this.height;

        this.topMargin = 2;

        this.cellSize = 80;
        
        this.columns;
        this.rows;
        
        this.eventTimer = 0;
        this.eventInterval = 200;
        this.eventUpdate = false;

        window.addEventListener('resize', (e) => {
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
        })
        
        window.addEventListener('keydown', (e) => {
            if(e.key == '+') this.debug = !this.debug;
        })
        // players objects
        this.player1;
        this.player2;
        this.player3;

        // food class object
        this.food;
        // background class
        this.background;
        // ui class object
        this.gameUi = new UI(this);
        
        this.gameObjects;

        this.resize(window.innerWidth, window.innerHeight);
    }

    /**
     * Resets the canvas size to the specified width and height and calls various methods to run on resize of canvas
     * 
     * @param {number} width - The new width of the canvas in pixels.
     * @param {number} height - The new height of the canvas in pixels.
    */

    resize(width, height) {
        this.canvas.width = width - width % this.cellSize;
        this.canvas.height = height - height % this.cellSize;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.columns = Math.floor(this.width / this.cellSize);
        this.rows = Math.floor(this.height / this.cellSize);

        // set text settings
        this.ctx.font = '30px Impact';
        this.ctx.textBaseline = 'top';
    }

    /**
     * initializes player 1 in game
    */

    initPlayer1() {
        const name = this.gameUi.player1Name.value;

        if(this.gameUi.player1Controls.value === 'arrows') {
            this.player1 = new Keyboard1(this, 0, this.topMargin, 0, 0, 'orange', name);
        }
        else {
            this.player1 = new ComputerAi(this, 0, this.topMargin, 0, 0, 'orange', name);
        }
    }

    /**
     * initializes player 2 in game
    */

    initPlayer2() {
        const name = this.gameUi.player2Name.value;

        if(this.gameUi.player2Controls.value === 'wsad') {
            this.player2 = new Keyboard2(this, this.columns - 1, this.topMargin, 0, 0, 'pink', name);
        }
        else {
            this.player2 = new ComputerAi(this, this.columns - 1, this.topMargin, 0, 0, 'pink', name);
        }
    }

    /**
     * initializes player 2 in game
    */

    initPlayer3() {
        const name = this.gameUi.player3Name.value;

        this.player3 = new ComputerAi(this, this.columns - 1, this.rows - 1, 0, 0, 'Magenta', name);
    }

    /**
     * runs when game starts and setup all things
    */

    start() {
        if(!this.gameOver) {
            this.gameUi.triggerGameOver();
        }
        else {
            this.gameOver = false;
            this.gameUi.gamePlayUi();

            // initialize Players

            this.initPlayer1();
            this.initPlayer2();
            this.initPlayer3();
            // gameobjects
     
            this.food = new Food(this);
     
            this.background = new Background(this);
            // array of gameobjects
    
            this.gameObjects = [this.player3, this.player2, this.player1, this.food];
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    /**
     *  this methods draw the grid on canvas
    */
    
    drawGrid() {
        for(let y = 0; y < this.rows; y++) {
            for(let x = 0; x < this.columns; x++) {
                this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }

    /**
     * 
     * @param {deltaTime} deltaTime - time between rendering of two frames
    */

    handlePeriodicEvents(deltaTime) {
        if(this.eventTimer < this.eventInterval) {
            this.eventTimer += deltaTime;
            this.eventUpdate = false;
        } 
        else {
            this.eventTimer = 0;
            this.eventUpdate = true;
        }
    }

    /**
     *  render gameobjects on canvas
    */

    render(deltaTime) {  
        this.handlePeriodicEvents(deltaTime);
        if(this.eventUpdate && !this.gameOver) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if(this.debug) this.drawGrid();
            
            this.gameObjects.forEach((object) => {
                object.draw();
                object.update();
            })

            this.background.draw();
            // update game ui
            this.gameUi.update();
        }
    }

    /**
     * check collision between two objects
     * @param {*} a - object 1 
     * @param {*} b - object 2
     * @returns bool
    */

    checkCollision(a, b) {
       return a.x == b.x && a.y == b.y; 
    }

    toggleFullScreen() {
        if(!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
    }
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(canvas, ctx);

    /**
     * Updates the game frame based on the current time.
     * 
     * @param {DOMHighResTimeStamp} timestamp - The current time in milliseconds since the page started loading, passed by requestAnimationFrame.
    */

    let lastTime = 0;
    function Animate(timestamp) {

        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        game.render(deltaTime);
        requestAnimationFrame(Animate);
    }
    Animate(0);
})
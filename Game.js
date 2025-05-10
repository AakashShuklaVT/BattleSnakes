/** @type {HTMLCanvasElement} */
/** @type {CanvasRenderingContext2D} */

import { Snake, Keyboard1, Keyboard2, ComputerAi} from "./Snake.js";
import {Food} from "./Food.js"
import { UI } from "./UI.js";
import { Background } from "./Background.js";
import { Particles } from "./Particles.js";
import { AudioControl } from "./Audio.js";

export class Game {
    
    /**
     * constructor for game class
     * @param {HTMLCanvasElement} canvas - The HTML canvas element used for rendering.
     * @param {CanvasRenderingContext2D} context - The 2D rendering context for drawing on the canvas.
    */

    constructor(canvas, context, canvas2, context2) {
        this.canvas = canvas;
        this.ctx= context;

        this.canvas2 = canvas2;
        this.ctx2= context2;

        this.gameOver = true;
        this.winningScore = 10;
        this.timer = 0;

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
        // sound
        this.sound = new AudioControl();
        // particles
        this.particles = [];
        this.numberOfParticles = 50;
        this.createParticlePool();

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

        this.canvas2.width = this.canvas.width;
        this.canvas2.height = this.canvas.height;
        this.ctx2.lineWidth = 2;

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
        const image = document.getElementById(this.gameUi.player1Character.value);
        if(this.gameUi.player1Controls.value === 'arrows') {
            this.player1 = new Keyboard1(this, 0, this.topMargin, 0, 0, 'orange', name, image);
        }
        else {
            this.player1 = new ComputerAi(this, 0, this.topMargin, 0, 0, 'orange', name, image);
        }
    }
    
    /**
     * initializes player 2 in game
    */
   
   initPlayer2() {
        const image = document.getElementById(this.gameUi.player2Character.value);
        const name = this.gameUi.player2Name.value;
        
        if(this.gameUi.player2Controls.value === 'WSAD') {
            this.player2 = new Keyboard2(this, this.columns - 1, this.topMargin, 0, 0, 'pink', name, image);
            
        }
        else {
            this.player2 = new ComputerAi(this, this.columns - 1, this.topMargin, 0, 0, 'pink', name, image);
        }
    }
    
    /**
     * initializes player 3 in game
    */
   
   initPlayer3() {
       const name = this.gameUi.player3Name.value;
       const image = document.getElementById(this.gameUi.player3Character.value);

        this.player3 = new ComputerAi(this, this.columns - 1, this.rows - 1, 0, 0, 'Magenta', name, image);
    }

    /**
     * runs when game starts and setup all things
    */

    start() {
        if(!this.gameOver) {
            this.gameUi.triggerGameOver(this);
            this.sound.playSound(this.sound.restart);
        }
        else {
            this.gameOver = false;
            this.timer = 0;
            this.gameUi.gamePlayUi();

            this.sound.playSound(this.sound.start);
            
            // gameobjects intializing methods
            this.initPlayer1();
            this.initPlayer2();
            this.initPlayer3();
     
            this.food = new Food(this);
     
            this.background = new Background(this);
            // array of gameobjects
    
            this.gameObjects = [this.player3, this.player2, this.player1, this.food];
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * method creates particles for use in game
    */
    createParticlePool() {
        for(let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particles(this));
        }
    }
    
    /**
     *  gets free particles from pool of particles
     * @returns particle
     */
   
   getParticle() {
        for(let i = 0; i < this.numberOfParticles; i++) {
            if(this.particles[i].free) return this.particles[i];
        }
    }
    
    handleParticles() {
        this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
        for(let i = 0; i < this.numberOfParticles; i++) {
           this.particles[i].update();
           this.particles[i].draw();
        }
    }

    /**
     *  method returns converted time 
     * @returns number
    */

    formatTimer() {
        return (this.timer * 0.001).toFixed(1);
    }

    /**
     *  this methods draw the grid on canvas
    */
    
    drawGrid() {
        for(let y = 0; y < this.rows; y++) {
            for(let x = 0; x < this.columns; x++) {
                // this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
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
        if(!this.gameOver) {
            this.timer += deltaTime;
        }
        if(this.eventUpdate && !this.gameOver) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // if(this.debug) this.drawGrid();
            
            this.gameObjects.forEach((object) => {
                object.draw();
                object.update();
            })
            // update game ui
            this.gameUi.update();
            this.background.draw();
        }
        this.handleParticles();
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

    const canvas2 = document.getElementById('canvas2');
    const ctx2 = canvas2.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;

    const game = new Game(canvas, ctx, canvas2, ctx2);

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
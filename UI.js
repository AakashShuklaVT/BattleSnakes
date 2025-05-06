export class UI {
    /**
    * 
    * @param {Game} game - game class object to use data
    */
    constructor(game) {
        this.game = game;

        // display score
        this.scoreBoard1 = document.getElementById('scoreBoard1');
        this.scoreBoard2 = document.getElementById('scoreBoard2');
        this.scoreBoard3 = document.getElementById('scoreBoard3');
        this.gameMenu = document.getElementById('gameMenu');
        this.startButton = document.getElementById('startButton');
        this.gameOverScreen = document.getElementById('gameOverScreen');

        // controls
        this.player1Controls = document.getElementById('player1Controls');
        this.player2Controls = document.getElementById('player2Controls');
        this.player3Controls = document.getElementById('player3Controls');
        
        // Names
        this.player1Name = document.getElementById('player1Name');
        this.player2Name = document.getElementById('player2Name');
        this.player3Name = document.getElementById('player3Name');

        // full screen button
        this.fullScreenButton =  document.getElementById('fullScreenButton');

        // button click listeners
        this.fullScreenButton.addEventListener('click', () => {
            this.game.toggleFullScreen();
        })

        this.startButton.addEventListener('click', () => {
            this.game.start();
        })

        // messages
        this.message1 = document.getElementById('message1')
        this.message2 = document.getElementById('message2')
    }

    /**
    * Updates the object's properties every frame (e.g., position, state).
    */

    update() {
        this.scoreBoard1.innerText = `${this.game.player1.name} : ${this.game.player1.score}`;
        this.scoreBoard2.innerText = `${this.game.player2.name} : ${this.game.player2.score}`;
        this.scoreBoard3.innerText = `${this.game.player3.name} : ${this.game.player3.score}`;
    }

    /**
     * triggers game over state
     */
    triggerGameOver(winner) {
        this.gameOverUi();
        if(winner) {
            this.game.gameOver = true;
            this.message1.innerText = 'Game Over ' + winner.name + ' wins';
            this.message2.innerText = 'Winning Score '+ winner.score;
        }
        else {
            this.message1.innerText = 'Welcome to the Battle Arena';
            this.message2.innerText = 'Choose your fighter';
        }
    }

    /**
     * shows ui when game is in play mode
    */

    gamePlayUi() {
        this.gameMenu.style.display = 'none';
        this.startButton.innerText = 'Restart';
        this.gameOverScreen.style.display = 'none';
    }
    
    /**
     * shows ui when game is in over mode
    */
   gameOverUi() {
       this.gameMenu.style.display = 'block'
       this.startButton.innerText = 'Start'
       this.gameOverScreen.style.display = 'block';
    }
}   
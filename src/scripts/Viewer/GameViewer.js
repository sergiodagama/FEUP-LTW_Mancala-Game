const GameState = {  //upper case because it's almost considered a class
    CONFIG: Symbol("CONFIG"),  //configurating the game
    PLAYING: Symbol("PLAYING"),  //player started the game
    TURN_PLAYER1: Symbol("TURN_PLAYER1"),  //player one turn (by convention the main user)
    TURN_PLAYER2: Symbol("TURN_PLAYER2"),  //player two turn
    PAUSE: Symbol("PAUSE"),  //pausing the game, disabled when online
    QUIT: Symbol("QUIT"),  //when player wants to give up
    END: Symbol("END"),  //show winner and ask to play again or back to home
 };

export class GameViewer {
    constructor(){
        this.presenter = null;
    }

    registerWith(presenter){
        this.presenter = presenter;
    }
}

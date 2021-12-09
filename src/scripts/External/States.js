/**
 * Game states
 */
export const GameState = {  //upper case because it's almost considered a class
    CONFIG: Symbol("CONFIG"),  //configurating the game
    TURN_PLAYER1: Symbol("TURN_PLAYER1"),  //player one turn
    TURN_PLAYER2: Symbol("TURN_PLAYER2"),  //player two turn
    QUIT: Symbol("QUIT"),  //when player wants to give up, show winner
 };

 /**
  * Player intern states
  */
 export const PlayerState = {
    NOT_PLAYING: Symbol("NOT_PLAYING"), //player not playing, may be in config, quit or pause game state
    TURN: Symbol("TURN"),  //player as to play
    WAIT: Symbol("WAIT"),  //player has to wait
 };

 const messageType = {
   OPPOSITE: Symbol("WRONG"), //player clicked an opposite player cavity on its turn
   EMPTY: Symbol("EMPTY"),  //player clicked an empty cavity on its turn
   NOT_YOUR_TURN: Symbol("NOT_YOUR_TURN") //player clicked on any cavity when it is not his turn
};
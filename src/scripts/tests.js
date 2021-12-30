/*
let shadowGame = new ShadowGame(gameState.TURN_PLAYER1, 6, 5, true);
let shadowGame2 = new ShadowGame(gameState.TURN_PLAYER1, 3, 2, true);
let shadowGame3 = new ShadowGame(gameState.TURN_PLAYER1, 3, 2, true);

//undoPlay tests with special play
shadowGame2.makePlay(gameState.TURN_PLAYER1, 0);
shadowGame2.printShadowBoard();
shadowGame2.makePlay(gameState.TURN_PLAYER1, 2);
shadowGame2.printShadowBoard();
shadowGame2.undoPlay(gameState.TURN_PLAYER1, 2, 2, [1, 0]);
shadowGame2.printShadowBoard();
shadowGame2.makePlay(gameState.TURN_PLAYER2, 3);
shadowGame2.printShadowBoard();
shadowGame2.undoPlay(gameState.TURN_PLAYER2, 3, 3, [1, 0]);
shadowGame2.printShadowBoard();

console.log("Commands Tests");
//undoPlay Commands test
shadowGame3.printShadowBoard();
shadowGame3.executeCommand(new PlayCommand(shadowGame3, gameState.TURN_PLAYER1, 0));
shadowGame3.printShadowBoard();
shadowGame3.executeCommand(new PlayCommand(shadowGame3, gameState.TURN_PLAYER1, 2));
shadowGame3.printShadowBoard();
shadowGame3.undoCommand();
shadowGame3.printShadowBoard();
shadowGame3.executeCommand(new PlayCommand(shadowGame3, gameState.TURN_PLAYER2, 3));
shadowGame3.printShadowBoard();
shadowGame3.undoCommand();
shadowGame3.printShadowBoard();

//ShadowGame methods test
shadowGame.makePlay(gameState.TURN_PLAYER1, 6);
shadowGame.printShadowBoard();
shadowGame.makePlay(gameState.TURN_PLAYER2, 7);
shadowGame.printShadowBoard();
shadowGame.undoPlay(gameState.TURN_PLAYER2, 7, 6);
shadowGame.printShadowBoard();
shadowGame.undoPlay(gameState.TURN_PLAYER2, 6, 5);
shadowGame.printShadowBoard();
/*
//Commands tests
const play1 = new PlayCommand(shadowGame, gameState.TURN_PLAYER1, 2);
shadowGame.executeCommand(play1);
shadowGame.printShadowBoard();
shadowGame.undoCommand();
shadowGame.printShadowBoard();
shadowGame.executeCommand(new PlayCommand(shadowGame, gameState.TURN_PLAYER1, 0));
shadowGame.printShadowBoard();
shadowGame.executeCommand(new PlayCommand(shadowGame, gameState.TURN_PLAYER2, 6));
shadowGame.printShadowBoard();
shadowGame.undoCommand();
shadowGame.printShadowBoard();
console.log(shadowGame.cavitiesNotEmpty(gameState.TURN_PLAYER2));
*/

//Tree tests
/*
let tree = new TreeNode(-1);
createTree(shadowGame3, gameState.TURN_PLAYER2, tree, 10);
debugger;
printTree(tree);
*/

//Minimax tests
//console.log(shadowGame2.getBestPlay(9));

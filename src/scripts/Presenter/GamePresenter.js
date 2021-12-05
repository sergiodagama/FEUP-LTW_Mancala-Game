import {GameState, PlayerState} from "../External/States";

import {ScoreViewer} from "../Viewer/ScoreViewer.js"
import {ScoreModel} from "../Model/ScoreModel.js"
import {ScorePresenter} from "./ScorePresenter.js"

import {TurnViewer} from "../Viewer/TurnViewer.js"
import {TurnModel} from "../Model/TurnModel.js"
import {TurnPresenter} from "./TurnPresenter.js"

export class GamePresenter {
    constructor(gameModel, gameViewer){
        this.gameState = CONFIG;  //game starts in CONFIG mode
        this.gameModel = gameModel;
        this.gameViewer = gameViewer;

        this.scoreModel = new ScoreModel();
        this.scoreViewer = new ScoreViewer();
        this.scorePresenter = new ScorePresenter();
        this.scoreViewer.registerWith(this.scorePresenter);

        this.turnModel = new TurnModel();
        this.turnViewer = new TurnViewer();
        this.turnPresenter = new TurnPresenter();
        this.turnViewer.registerWith(this.turnPresenter);

        this.clickedCavityId = null;
    }

    cavitiesClickHandler(){
        //update clicked cavity
        let clickedCavityId = event.target.id; //Event.currentTarget.id;

        switch (this.gameState) {
            case GameState.CONFIG:
                console.log('CONFIG');
                //show message game hasn't started
                break;
            case GameState.TURN_PLAYER1:
                console.log('TURN_PLAYER1');
                handlePlayerAction(TURN, this.gameModel.playerModel1);
                handlePlayerAction(WAIT, this.gameModel.playerModel2);
                break;
            case GameState.TURN_PLAYER2:
                console.log('TURN_PLAYER2');
                handlePlayerAction(TURN, this.gameModel.playerModel2);
                handlePlayerAction(WAIT, this.gameModel.playerModel1);
                break;
            case GameState.QUIT:
                //show message the game has ended TODO:
                console.log('QUIT');
                break;
            default:
              console.log('ERROR -> cavitiesClickHandler() <- THAT STATE DOES NOT EXIT!');
        }
        this.scorePresenter.updateScore();  //goes to each storage and calculates players scores TODO:
    }

    handlePlayerAction(playerState, playerModel){
        let oppositePlayerModel = null;
        if(playerModel.id == this.gameModel.playerModel1) {
            oppositePlayerModel = this.gameModel.playerModel2;
        }
        else{
            oppositePlayerModel = this.gameModel.playerModel1;
        }

        switch (playerState) {
            case PlayerState.NOT_PLAYING:
                console.log('NOT_PLAYING');
                break;
            case PlayerState.TURN:
                console.log('TURN');
                if (this.cavityModel.isEmpty()){
                    //show message to the player that cavity is empty
                    turnPresenter.changeToWrongTurnMessage(EMPTY);
                }
                else{
                    if(isCorrectPlay(playerModel)){
                        //make the play if clicked in right cavity (use boardId) TODO:
                        //change turn message
                        play(clickedCavity, playerModel);
                        turnPresenter.changeTurnMessage(oppositePlayerModel.username);
                    }else{
                        //else display wrong cavity
                        turnPresenter.changeToWrongTurnMessage(OPPOSITE);
                    }
                }
                break;
            case PlayerState.WAIT:
                //show message not your turn
                turnPresenter.changeToWrongTurnMessage(NOT_YOUR_TURN);
                console.log('WAIT');
                break;
            default:
              console.log('ERROR -> handlePlayerAction() <- THAT STATE DOES NOT EXIT!');
        }
    }

    startClickHandler(){
        if(this.gameState == CONFIG) this.gameState = TURN_PLAYER1;
        else //show message already playing a game
    }

    quitClickHandler(){
        if(this.gameState == TURN_PLAYER1 || this.gameState == TURN_PLAYER2 || this.gameState == PAUSE){
            //make sure player wants to quit
            this.gameState = QUIT;
        }
        else //show message already you are not playing a game
    }

    isCorrectPlay(playerModel){
        let isCorrect = false;

        for(cavity in this.playerModel.cavities){
            if(cavity.boardId == this.clickedCavity.boardId) isCorrect = True;
        }

        return isCorrect;
    }

    play(playerModel){
        //parse cavity id
        //get corresponding cavity model
        this.playerModel
        this.clickedCavity =
    }
}

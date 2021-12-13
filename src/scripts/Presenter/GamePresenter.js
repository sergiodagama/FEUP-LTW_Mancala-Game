import {GameState, PlayerState} from "../External/States";

import {ScorePresenter} from "./ScorePresenter.js"
import {TurnPresenter} from "./TurnPresenter.js"

import { SeedPresenter } from "./SeedPresenter.js";
import { CavityPresenter } from "./CavityPresenter.js";
import { CavityViewer } from "../Viewer/CavityViewer";
import { SeedViewer } from "../Viewer/SeedViewer";

export class GamePresenter {
    constructor(gameModel, gameViewer){
        this.gameState = CONFIG;  //game starts in CONFIG mode
        this.gameModel = gameModel;
        this.gameViewer = gameViewer;

        /*
        this.clickedCavityId = null;
        */
        this.scorePresenter = new ScorePresenter();
        this.turnPresenter = new TurnPresenter();

        this.player1CavityPresenters = [];
        this.player2CavityPresenters = [];

        this.player1SeedPresenters = [];
        this.player2SeedPresenters = [];
    }

    gameplayAreaConfigs(initialCavities, initialSeeds){
        var quantities = document.getElementsByClassName("input-settings-info--quantities");
        var initialCavities = quantities[0].value;
        var initialSeeds = quantities[1].value;

        clearDisplay();

        //removing and creating players, that themselves create cavities and seeds (creating models)
        this.gameModel.emptyPlayers(initialCavities, initialSeeds);


        //clean presenters
        this.player1CavityPresenters = [];
        this.player2CavityPresenters = [];
        this.player1SeedPresenters = [];
        this.player2SeedPresenters = [];

        //create presenters and viewers
        for(let c = 0; c < initialCavities; c++){
            let cavityViewer = new CavityViewer();
            let cavityPresenter = new CavityPresenter(this.gameModel.playerModel1.cavities[c], cavityViewer);
            this.player1CavityPresenters.push(cavityPresenter);
            this.player1SeedPresenters[c] = [];

            for(let s = 0; s < initialSeeds; s++){
                let seedViewer = new SeedViewer();
                let seedPresenter = new SeedPresenter(this.gameModel.playerModel1.cavities[c].seeds[s], seedViewer);
                this.player1SeedPresenters[c].push(seedPresenter);
            }
        }

        for(let c = 0; c < initialCavities; c++){
            let cavityViewer = new CavityViewer();
            let cavityPresenter = new CavityPresenter(this.gameModel.playerModel2.cavities[c], cavityViewer);
            this.player2CavityPresenters.push(cavityPresenter);
            this.player2SeedPresenters[c] = [];

            for(let s = 0; s < initialSeeds; s++){
                let seedViewer = new SeedViewer();
                let seedPresenter = new SeedPresenter(this.gameModel.playerModel2.cavities[c].seeds[s], seedViewer);
                this.player2SeedPresenters[c].push(seedPresenter);
            }
        }

        displayCavitiesAndSeeds();
    }


    /*
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
    */

    displayCavitiesAndSeeds(){
        for(let c = 0; c < player1Presenters.length; c++){
            this.player1CavityPresenters[c].displayCavity();

            for(let c = 0; c < player1SeedPresenters.length; c++){
                this.player1SeedPresenters[c][s].displaySeed(document.getElementById("cavity-" +this.player1CavityPresenters[c].getModel().id));
            }
        }

        for(let c = 0; c < player2Presenters.length; c++){
            this.player2CavityPresenters[c].displayCavity();

            for(let c = 0; c < player2SeedPresenters.length; c++){
                this.player2SeedPresenters[c][s].displaySeed(document.getElementById("cavity-" +this.player2CavityPresenters[c].getModel().id));
            }
        }

    }

    clearDisplay(){
        var backgroundCavities = document.getElementsByClassName("d-game-background-cavity");
        var gameplayCavities = document.getElementsByClassName("d-gameplay-cavity");

        while(backgroundCavities[0]){
          backgroundCavities[0].remove();
          gameplayCavities[0].remove();
        }
    }
}

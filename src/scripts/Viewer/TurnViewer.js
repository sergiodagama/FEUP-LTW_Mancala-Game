export class TurnViewer{
    constructor(){
        this.turnPresenter = null;
    }

    registerWith(turnPresenter){
        this.turnPresenter = turnPresenter;
    }

    displayTurnMessage(message){
        let turnMessage = document.getElementById("p-game-area-header-messages");
        turnMessage.innerHTML = message;
    }
}
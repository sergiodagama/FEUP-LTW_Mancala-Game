export class TurnPresenter {
    constructor(turnModel, turnViewer){
        this.turnModel = turnModel;
        this.turnViewer = turnViewer;
    }

    changeTurnMessage(player){
        this.turnModel.setTurnMessage(player);
        this.turnViewer.displayTurnMessage(this.turnModel.turnMessage);
    }

    changeToWrongTurnMessage(messageType){
        this.turnModel.setWrongTurnMessage(messageType);
        this.turnViewer.displayTurnMessage(this.turnModel.turnMessage);
    }
}
import { TurnModel } from "../Model/TurnModel";
import { TurnViewer } from "../Viewer/TurnViewer";

export class TurnPresenter {
    constructor(){
        this.turnModel = new TurnModel();
        this.turnViewer = new TurnViewer();
    }

    changeTurnMessage(player){
        this.turnModel.setTurnMessage(player);
        this.turnViewer.display(this.turnModel.turnMessage);
    }

    changeToWrongTurnMessage(messageType){
        this.turnModel.setWrongTurnMessage(messageType);
        this.turnViewer.display(this.turnModel.turnMessage);
    }
}
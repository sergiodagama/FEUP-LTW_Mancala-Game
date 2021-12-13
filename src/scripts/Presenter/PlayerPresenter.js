export class PlayerPresenter {
    constructor(playerModel, playerViewer){
        this.playerModel = playerModel;
        this.playerViewer = playerViewer;
    }

    displayUsername(){
        this.playerViewer.displayUsername(this.playerModel.boardId, this.playerModel.username);
    }
}
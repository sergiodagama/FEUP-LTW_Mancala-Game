export class PlayerViewer{
    constructor(){
        this.playerPresenter = null;
    }

    registerWith(playerPresenter){
        this.playerPresenter = playerPresenter;
    }

    displayUsername(boardId, username){
        let usernameElem = document.getElementById("p-game-area-header-p" + boardId + "-name");
        usernameElem.innerHTML = username;
    }
}
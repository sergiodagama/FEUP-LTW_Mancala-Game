export class TurnViewer{
    constructor(){} //no need for presenter, same as score

    display(message){
        let turnMessage = document.getElementById("p-game-area-header-messages");
        turnMessage.innerHTML = message;
    }
}
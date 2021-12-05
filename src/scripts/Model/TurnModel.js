export class TurnModel{
    constructor(){
        this.turnMessage = "";
    }

    setTurnMessage(player){
        this.turnMessage = "It is " + player + " turn";
    }

    setWrongTurnMessage(messageType){
        switch(messageType){
            case OPPOSITE:
                this.turnMessage = "Please, choose one of your cavities";
                break;
            case EMPTY:
                this.turnMessage = "Please, don't choose an empty cavity";
                break;
            case NOT_YOUR_TURN:
                this.turnMessage = "Please, wait for your turn";
                break;
            default:
                console.log('Error -> setWrongTurnMessage() <- not valid messageType');
        }

    }
}
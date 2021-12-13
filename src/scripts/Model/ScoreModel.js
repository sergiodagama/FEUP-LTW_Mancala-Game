export class ScoreModel{
    constructor(){
        this.player1Score = 0;
        this.player2Score = 0;
    }

    addToScore(player, score){
        switch(player){
            case 1:
                this.player1Score += score;
                break;
            case 2:
                this.player2Score += score;
                break;
            default:
                console.log("ERROR -> addToScore() <- not corret player number");
        }
    }

    cleanScores(){
        this.player1Score = 0;
        this.player2Score = 0;
    }
}
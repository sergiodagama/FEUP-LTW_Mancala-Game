import { ScoreModel } from "../Model/ScoreModel";
import { ScoreViewer } from "../Viewer/ScoreViewer";

export class ScorePresenter {
    constructor(){
        this.scoreModel = new ScoreModel;
        this.scoreViewer = new ScoreViewer;
    }

    addToScore1(plus){
        this.scoreModel.addToScore(1, plus);
        this.scoreViewer.display(this.scoreModel.player1Score, this.scoreModel.player2Score);
    }

    addToScore2(plus){
        this.scoreModel.addToScore(2, plus);
        this.scoreViewer.display(this.scoreModel.player1Score, this.scoreModel.player2Score);
    }

    addToScores(plus1, plus2){
        this.scoreModel.addToScore(1, plus1);
        this.scoreModel.addToScore(2, plus2);
        this.scoreViewer.display(this.scoreModel.player1Score, this.scoreModel.player2Score);
    }
}
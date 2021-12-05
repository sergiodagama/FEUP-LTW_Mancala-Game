export class ScoreViewer{
    constructor(){
        this.scorePresenter = null;
    }

    registerWith(scorePresenter){
        this.scorePresenter = scorePresenter;
    }
}
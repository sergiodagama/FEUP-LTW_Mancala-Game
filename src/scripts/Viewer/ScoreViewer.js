export class ScoreViewer{
    constructor(){ //no need for presenter as no comunication between presenter and viewer is going to happen
    }

    display(score1, score2){
        let scoreElem1 = document.getElementById("p-game-area-header-score--1");
        scoreElem1.innerHTML = score1;

        let scoreElem2 = document.getElementById("p-game-area-header-score--2");
        scoreElem2.innerHTML = score2;
    }
}
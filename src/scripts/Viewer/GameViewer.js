export class GameViewer {
    constructor(){
        this.gamePresenter = null;
    }

    registerWith(gamePresenter){
        this.gamePresenter = gamePresenter;
        listenCavityClicks();
    }

    //listeners
    listenCavityClicks(){
        var cavities = document.getElementsByClassName("d-gameplay-cavity");
        var storages = document.getElementsByClassName("d-gameplay-storage");

        for (i = 0; i < cavities.length; i++) {
            cavities[i].addEventListener('click', this.cavityPresenter.cavitiesClickHandler);
        }

        for (i = 0; i < storages.length; i++) {
            storages[i].addEventListener('click', this.cavityPresenter.cavitiesClickHandler);
        }
    }

    listenCommands(){
        var startButton = document.getElementById("button-command-start");
        startButton.addEventListener("click", this.cavityPresenter.startClickHandler);

        var quitButton = document.getElementById("button-command-quit");
        quitButton.addEventListener("click", this.cavityPresenter.quitClickHandler);
    }

    listenConfigurations(){
    }

    //
}

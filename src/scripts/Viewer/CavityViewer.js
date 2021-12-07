export class CavityViewer{
    constructor(){
        this.cavityPresenter = null;
    }

    registerWith(cavityPresenter){
        this.cavityPresenter = cavityPresenter;
    }

    displayBackground(boardId){ //1 or 2
        var cavity = document.createElement("div");
        cavity.classList.add("d-game-background-cavity");
        document.getElementById("d-game-background-cavities-p" + boardId).appendChild(cavitie);
    }

    display(id, boardId){
        var cavitieTop = document.createElement("div");
        cavitieTop.setAttribute('id', cavityId(id));
        cavitieTop.classList.add("d-gameplay-cavity");
        document.getElementById("d-gameplay-cavities-p" + boardId).appendChild(cavitieTop);
    }

    cavityId(id){
        return "cavity-" + id;
    }
}
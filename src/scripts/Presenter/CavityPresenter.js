export class CavityPresenter {
    constructor(cavityModel, cavityViewer){
        this.cavityModel = cavityModel;
        this.cavityViewer = cavityViewer;
    }

    displayCavity(){
        this.cavityViewer.displayBackground(this.cavityModel.boardId);
        this.cavityViewer.display(this.cavityModel.id, this.cavityModel.boardId);
    }

    getModel(){
        return this.cavityModel;
    }
}
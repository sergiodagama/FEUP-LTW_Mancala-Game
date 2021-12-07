export class SeedPresenter {
    constructor(seedModel, seedViewer){
        this.seedModel = seedModel;
        this.seedViewer = seedViewer;
    }

    displaySeed(cavityElement){
        this.seedViewer.display(this.seedModel.getId(), cavityElement);
    }
}
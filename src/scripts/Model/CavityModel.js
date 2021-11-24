import "SeedModel.js";

class CavityModel {
    constructor(nSeeds = 5){
        this.seeds = [];
        init(nSeeds);
    }

    init(nSeeds){
        emptyCavity();
        for(i = 0; i < nSeeds; i++){
            seed = new SeedModel();
            seed.randAll();
            this.seeds.push(seed);
        }
    }

    emptyCavity(){
        this.seeds = [];
    }

    addSeed(seed){
        this.seeds.push(seed)
    }
}
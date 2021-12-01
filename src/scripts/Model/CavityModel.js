import {SeedModel} from "./SeedModel.js"

export class CavityModel {
    constructor(nSeeds){
        this.seeds = [];
        init(nSeeds);
    }

    init(nSeeds){
        empty();
        for(i = 0; i < nSeeds; i++){
            seed = new SeedModel();
            seed.randAll();
            this.seeds.push(seed);
        }
    }

    empty(){
        this.seeds = [];
    }

    addSeed(seed){
        this.seeds.push(seed);
    }

    removeSeed(seedToRemove){
        this.seeds = seeds.filter(seed => seed.getId() != seedToRemove.getId());
    }
}
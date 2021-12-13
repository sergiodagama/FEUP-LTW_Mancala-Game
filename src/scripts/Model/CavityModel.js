import {SeedModel} from "./SeedModel.js"

let nextSeedId = 0;

export class CavityModel {
    constructor(nSeeds, boardId){
        this.id = nextSeedId++;
        this.boardId = boardId;
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

    isEmpty(){
        return this.seeds.isEmpty();
    }

    addSeed(seed){
        this.seeds.push(seed);
    }

    removeSeed(seedToRemove){
        this.seeds = seeds.filter(seed => seed.getId() != seedToRemove.getId());
    }
}
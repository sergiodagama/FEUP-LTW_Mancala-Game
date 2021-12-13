import {CavityModel} from "./CavityModel.js"
import {StorageModel} from "./StorageModel.js"

let nextPlayerId = 0;

export class PlayerModel{  //guests by default
    constructor(boardId, initialCavities = 6, initialSeeds = 5){
        this.id = nextPlayerId++;
        this.username = "Guest" + this.id;
        this.boardId = boardId; //1 or 2: indicates the player side of cavities (1 are the top cavites and left storage, 2 are the rest)
        this.initialCavities = initialCavities;
        this.initialSeeds = initialSeeds;
        this.cavities = [];
        this.storage = null;

        init(this.initialCavities, this.initialSeeds);
    }

    init(initialCavities, initialSeeds){
        emptyStorage();
        emptyCavities();
        for(let i = 0; i < initialCavities; i++){
            cavity = new CavityModel(initialSeeds, this.boardId);
            this.cavities.push(cavity);
        }
    }

    emptyStorage(){
        this.storage = new StorageModel(0);
    }

    emptyCavities(){
        this.cavities = [];
    }
}

class Registered extends PlayerModel{
    constructor(username, country) {
        super();
        this.username = username;
        this.country = country;
    }
}

class Computer extends PlayerModel{
    constructor(aiLevel) {
        super();
        this.aiLevel = aiLevel;
    }
}

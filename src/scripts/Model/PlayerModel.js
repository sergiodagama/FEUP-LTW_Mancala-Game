import {CavityModel} from "./CavityModel.js"
import {StorageModel} from "./StorageModel.js"

let nextPlayerId = 0;

class PlayerModel{  //guests
    constructor(boardId){
        this.id = nextPlayerId++;
        this.username = "Guest" + this.id;
        this.boardId = boardId; //1 or 2: indicates the player side of cavities (1 are the top cavites and left storage, 2 are the rest)
        this.defaultCavities = 6;
        this.defaultSeeds = 5;
        this.cavities = [];
        this.storages = [new StorageModel(0), new StorageModel(0)];

        init(this.defaultCavities, this.defaultSeeds);
    }

    init(initialCavities, initialSeeds){
        emptyStorages();
        emptyCavities();
        for(let i = 0; i < initialCavities; i++){
            cavity = new CavityModel(initialSeeds, this.boardId);
            this.cavities.push(cavity);
        }
    }

    emptyStorages(){
        for(storage in this.storages){
            storage.empty();
        }
    }

    emptyCavities(){
        for(cavity in this.cavities){
            cavity.empty();
        }
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

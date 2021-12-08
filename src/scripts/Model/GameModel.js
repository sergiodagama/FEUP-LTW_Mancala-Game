import { TurnModel } from "./TurnModel.js";
import { ScoreModel } from "./ScoreModel.js";
import { PlayerModel } from "./PlayerModel.js";

export class GameModel {
    constructor(){
        this.playerModel1 = new PlayerModel(1);
        this.playerModel2 = new PlayerModel(2);
    }

    moveSeedFromTo(seedId, fromCavity, toCavity){
    }

    renewPlayers(initialCavities, initialSeeds){
        this.playerModel1 = new PlayerModel(1, initialCavities, initialSeeds);
        this.playerModel2 = new PlayerModel(2, initialCavities, initialSeeds);
    }
}
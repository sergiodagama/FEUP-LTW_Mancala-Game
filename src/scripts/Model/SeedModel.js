const seedRes = ["../res/seeds/seed_red.png", "../res/seeds/seed_green.png", "../res/seeds/seed_yellow.png", "../res/seeds/seed_blue.png"];
const seedResAlt = ["../res/seeds/seed_red_alt.png", "../res/seeds/seed_green_alt.png", "../res/seeds/seed_yellow_alt.png", "../res/seeds/seed_blue_alt.png"];

import "../External/Position.js";

class SeedModel{
    constructor(x = 0, y = 0, res){
        this.position = new Position(x, y);
        this.res = res;
    }

    randSeedResource(){
        //returns a random integer from 0 to 3 ->  4 colors available
        const randColor = Math.ceil(Math.random()*4) - 1;

        //returns a random integer from 0 to 1 -> 50/50 chances of being round shape or alt shape
        const altShape = Math.ceil(Math.random()*2) - 1;

        if(altShape){
            this.res = seedResAlt[randColor];
        }else{
            this.res = seedRes[randColor];
        }
    }
      
    randSeedPositionTop(){
        const randPos = Math.random()*65 + 10;
        return randPos + "%";
    }
      
    randSeedPositionLeft(){
        const randPos = Math.random()*55 + 10;
        return randPos + "%";
    }

    randSeedPosition(){
        this.position.x = this.randSeedPositionLeft();
        this.position.y = this.randSeedPositionTop();
    }

    randAll(){
        randSeedResource();
        randSeedPosition();
    }
}
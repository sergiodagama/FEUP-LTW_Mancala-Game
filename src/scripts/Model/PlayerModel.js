
class PlayerModel{
    constructor(id, initialCavities, initialSeeds){
        this.id = id;
        this.initialCavities = initialCavities;
        this.initialSeeds = initialSeeds;
    }
}

class Guest extends PlayerModel{
    constructor(id, initialCavities, initialSeeds) {
        super(id, initialCavities, initialSeeds); 
    }
}

class Registered extends PlayerModel{
    constructor(id, initialCavities, initialSeeds, username, country) {
        super(id, initialCavities, initialSeeds); 
        this.username = username;
        this.country = country;
    }  
}

class Computer extends PlayerModel{
    constructor(id, initialCavities, initialSeeds, aiLevel) {
        super(id, initialCavities, initialSeeds); 
        this.aiLevel = aiLevel;
    }
}

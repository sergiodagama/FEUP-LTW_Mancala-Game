/**
 * Constants
 */
//Seed Resources
//const seedRes = ["../res/seeds/seed_red.png", "../res/seeds/seed_green.png", "../res/seeds/seed_yellow.png", "../res/seeds/seed_blue.png"];
//const seedResAlt = ["../res/seeds/seed_red_alt.png", "../res/seeds/seed_green_alt.png", "../res/seeds/seed_yellow_alt.png", "../res/seeds/seed_blue_alt.png"];

//Country Resources
const countryRes = ["../res/flags/guest.png", "../res/flags/online.png", "../res/flags/computer.png", "../res/flags/al.png", "../res/flags/br.png", "../res/flags/computer.png", "../res/flags/es.png", "../res/flags/fr.png", "../res/flags/pt.png"];

//Default values for game configuration
const configDefaultValues = {
    N_SEEDS: 5,
    N_CAVITIES: 6,
 };

/**
 * Models
 */
class Position{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    //Getters
    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    //Setters
    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }
}

class Player{
    constructor(id){
        this.id = 0;  //1 or 2  (identifies if it his left player or right player)
        this.username = "Guest" + id;  //players are by default guests
        this.countryRes = countryRes[0];
    }

    //Getters
    getId(){
        return this.id;
    }

    getUsername(){
        return this.username;
    }

    getCountryRes(){
        return this.countryRes;
    }

    //Setters
    setId(id){
        this.id = id;
    }

    setUsername(username){
        this.username = username;
    }

    setCountryRes(path){
        this.countryRes = path;
    }
}

let nextSeedId = 0;  //used to autoincrement seeds ids, useful when needed to identify each seed

class Seed{
    constructor(){
        this.id = nextSeedId++;
        this.position = null;
        this.seedRes = seedRes[0];
        randAll();
    }

    //Getters
    getId(){
        return this.id;
    }

    getPosition(){
        return this.position;
    }

    getResource(){
        return this.seedRes;
    }

    //Setters
    setPosition(position){
        this.position = position;
    }

    setSeedRes(path){
        this.seedRes = path;
    }

    //Seed Main Methods
    randSeedResource(){
        //returns a random integer from 0 to 3 ->  4 colors available
        const randColor = Math.ceil(Math.random()*4) - 1;

        //returns a random integer from 0 to 1 -> 50/50 chances of being round shape or alt shape
        const altShape = Math.ceil(Math.random()*2) - 1;

        if(altShape){
            this.seedRes = seedResAlt[randColor];
        }else{
            this.seedRes = seedRes[randColor];
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

class GameModel{
    constructor(){
        this.players = [];  //fixed to 2
        this.storages = [];  //fixed to 2 nº storages [nº storages][nº Seeds] stores seeds objects
        this.cavities = [];  //array of arrays [nº Cavities][nº Seeds] stores seeds objects
        this.turnMessage = "Default turn Message";
        this.systemMessage = "Default system Message";
        this.score = []; //fixed to 2
    }

    //Getters
    getPlayers(){
        return this.players;
    }

    getStorages(){
        return this.storages;
    }

    getCavities(){
        return this.cavities;
    }

    getTurnMessage(){
        return this.turnMessage;
    }

    getSysMessage(){
        return this.systemMessage;
    }

    getScore(){
        return this.score;
    }

    //GameModel Main Methods
    deletePlayers(){
        this.players = [];
    }

    deleteCavities(){
        this.cavities = [];
    }

    emptyCavities(){
        for(let i = 0; i < this.cavities.length; i++){
            this.cavities[i] = [];
        }
    }

    emptyStorages(){
        this.storages[0] = [];
        this.storages[1] = [];
    }

    zeroScore(){
        this.score[0] = 0;
        this.score[1] = 0;
    }

    config(nCavities, nSeeds){
        //delete existing seeds and cavities
        this.deleteCavities();

        //add cavites and create seeds
        for(let i = 0; i < nCavities; i++){
            let seeds = [];
            for(let k = 0; k < nSeeds; k++){
                seeds.push(new Seed());
            }
            this.cavities.push(seeds);
        }
    }

    resetConfig(){
        this.config(configDefaultValues.N_CAVITIES, configDefaultValues.N_SEEDS);
    }
}

/**
 * Viewer
 */
class GameViewer{
    constructor(){
        this.presenter = null;
    }

    registerWith(presenter){
        this.presenter = presenter;
    }

    getPresenter(){
        return this.presenter
    }

    //Create and delete DOM Components
    createCavity(){}

    createSeed(){}

    deleteCavity(){}

    deleteSeed(){}

    //Update DOM Component
    updateCavity(){}

    updateStorage(){}

    updateTurnMessage(){}

    updateSysMessage(){}

    //Listeners
    listenConfigs(){}

    listenCommands(){}

    listenCavities(){}
}

/**
 * Presenter
 */
class GamePresenter{
    constructor(model, viewer){
        this.model = model;
        this.viewer = viewer;
    }

    //Getters
    getModel(){
        return this.model;
    }

    getViewer(){
        return this.viewer;
    }

    handleConfigs(){}

    handleCommands(){}

    handleCavities(){}
}

/**
 * Game Configuration
 */

/**
 * Game Loop
 */

/**
 * Authentication
 */

/**
 * Chat
 */

/**
 * Score
 */



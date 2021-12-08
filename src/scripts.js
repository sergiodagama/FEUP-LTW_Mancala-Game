/**
 * Constants
 */
//Seed Resources
const seedRes = ["../res/seeds/seed_red.png", "../res/seeds/seed_green.png", "../res/seeds/seed_yellow.png", "../res/seeds/seed_blue.png"];
const seedResAlt = ["../res/seeds/seed_red_alt.png", "../res/seeds/seed_green_alt.png", "../res/seeds/seed_yellow_alt.png", "../res/seeds/seed_blue_alt.png"];

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
    constructor(x = 0, y = 0){
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
        this.position = new Position();
        this.seedRes = seedRes[0];
        this.randAll();
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
        this.position.setX(this.randSeedPositionLeft());
        this.position.setY(this.randSeedPositionTop());
    }

    randAll(){
        this.randSeedResource();
        this.randSeedPosition();
    }
}

class GameModel{
    constructor(){
        this.players = [];  //fixed to 2
        this.storages = [];  //fixed to 2 nº storages [nº storages][nº Seeds] stores seeds objects
        /*
        player1 -> [1][2][3][4][5]
        player2 -> [6][7][8][9][10]
        */
        this.cavities = [];  //array of arrays [nº Cavities * 2][nº Seeds] stores seeds objects
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
        for(let i = 0; i < nCavities * 2; i++){
            let seeds = [];
            for(let k = 0; k < nSeeds; k++){
                seeds.push(new Seed());
            }
            this.cavities.push(seeds);
        }
    }

    resetConfigs(){
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
        console.log(this.getPresenter());
    }

    getPresenter(){
        return this.presenter
    }

    //Create and delete DOM Components
    createCavity(){
        //Game Background
        var cavitie = document.createElement("div");
        cavitie.classList.add("d-game-background-cavity");
        document.getElementById("d-game-background-cavities-p1").appendChild(cavitie);

        var cavitie2 = document.createElement("div");
        cavitie2.classList.add("d-game-background-cavity");
        document.getElementById("d-game-background-cavities-p2").appendChild(cavitie2);

        //Gameplay Area (Top of background)
        var cavitieTop = document.createElement("div");
        cavitieTop.classList.add("d-gameplay-cavity");
        document.getElementById("d-gameplay-cavities-p1").appendChild(cavitieTop);

        var cavitieTop2 = document.createElement("div");
        cavitieTop2.classList.add("d-gameplay-cavity");
        document.getElementById("d-gameplay-cavities-p2").appendChild(cavitieTop2);
    }

    createSeed(id, cavityElement, randSeedPositionTop, randSeedPositionLeft, randomSeedResource){
        let seed = document.createElement("img");
        seed.setAttribute('id', this.seedId(id));
        seed.classList.add("img-seed");
        seed.style.top =  randSeedPositionTop;
        seed.style.left = randSeedPositionLeft;
        seed.src = randomSeedResource;
        cavityElement.appendChild(seed);
    }

    createHoverQuantity(cavityOrStorageElement){
        var seedQuan = document.createElement("p");
        seedQuan.classList.add("p-seed-quantitie");
        seedQuan.innerHTML += cavityOrStorageElement.childElementCount;
        cavityOrStorageElement.appendChild(seedQuan);
    }

    deleteHoverQuantities(){
        const seedQuantities = document.getElementsByClassName("p-seed-quantitie");

        //removing all seed quantities
        while(seedQuantities[0]){
            seedQuantities[0].remove();
        }
    }

    updateHoverQuantities(){

    }


    seedId(id){
        return 'seed-' + id;
    }

    deleteCavities(){
        const backgroundCavities = document.getElementsByClassName("d-game-background-cavity");
        const gameplayCavities = document.getElementsByClassName("d-gameplay-cavity");

        while(backgroundCavities[0]){
          backgroundCavities[0].remove();
          gameplayCavities[0].remove();
        }
    }

    deleteSeed(){}

    //Update DOM Component

    emptyStorages(){
        const gameplayCavities = document.getElementsByClassName("d-gameplay-storage");

        while (gameplayCavities[0].firstChild) {
            gameplayCavities[0].removeChild(gameplayCavities[0].firstChild);
        }

        while (gameplayCavities[1].firstChild) {
            gameplayCavities[1].removeChild(gameplayCavities[1].firstChild);
        }
    }

    updateTurnMessage(){}

    updateSysMessage(){}

    //Listeners
    listenConfigs(){
        const configsButton = document.getElementById("button-settings-info--config");
        //console.log(this.presenter);
        configsButton.addEventListener("click", this.presenter.handleConfigs.bind(this.presenter));

    }

    listenResetConfigs(){
        var resetElement = document.getElementById("button-settings-info--reset");
        resetElement.addEventListener("click", this.presenter.resetConfigs.bind(this.presenter));
    }

    listenCommands(){}

    listenCavities(){}

    listenAll(){
        this.listenConfigs();
        this.listenResetConfigs();
    }
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

    handleConfigs(){
        //get current quantities
        const quantities = document.getElementsByClassName("input-settings-info--quantities");
        const nCavs = quantities[0].value;
        const nSeeds = quantities[1].value;

        this.config(nCavs, nSeeds);
    }

    config(nCavs, nSeeds){
        //deleting cavities and empty storages in Model
        this.model.deleteCavities();
        this.model.emptyStorages();

        //deleting cavities and empty storages in Viewer
        this.viewer.deleteCavities();  //TODO:
        this.viewer.emptyStorages(); //update to zero seeds

        //create cavities and seeds in Model
        this.model.config(nCavs, nSeeds);

        //create cavities and seeds in Viewer
        this.createCavitiesAndSeeds(nCavs, nSeeds);
    }

    resetConfigs(){
        this.model.resetConfigs();
        this.config(configDefaultValues.N_CAVITIES, configDefaultValues.N_SEEDS);
    }

    createCavitiesAndSeeds(nCavs, nSeeds){  //also create seed quantities in cavities and storages
        for(let i = 0; i < nCavs; i++){
            this.viewer.createCavity();
        }

        let cavs = document.getElementsByClassName("d-gameplay-cavity");

        for(let j = 0; j < nCavs * 2; j++){
            for(let k = 0; k < nSeeds; k++){
                this.viewer.createSeed(this.model.cavities[j][k].getId(), cavs[j], this.model.cavities[j][k].position.getY(), this.model.cavities[j][k].position.getX(), this.model.cavities[j][k].seedRes);
            }
        }

        for(let i = 0; i < nCavs * 2; i++){
            this.viewer.createHoverQuantity(cavs[i]);
        }

        const storages = document.getElementsByClassName("d-gameplay-storage");

        for(let i = 0; i < 2; i++){
            this.viewer.createHoverQuantity(storages[i]);
        }
    }

    handleCommands(){
        //TODO:
    }

    handleCavities(){}
}

/**
 * Game Configuration
 */

//temporary
document.getElementById("d-game-area-background").style.display = "grid";

const gameModel = new GameModel();
const gameViewer = new GameViewer();
const gamePresenter = new GamePresenter(gameModel, gameViewer);
gameViewer.registerWith(gamePresenter);
gameViewer.listenAll();


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



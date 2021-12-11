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
    N_SEEDS: 5,     //seeds per cavity
    N_CAVITIES: 6,  //cavities per side
    MAX_SEEDS: 10,
    MIN_SEEDS: 1,
    MAX_CAVITIES: 8,
    MIN_CAVITIES: 2,
 };

 //Game states
const gameState = {
    CONFIG: Symbol("CONFIG"),  //configurating the game
    TURN_PLAYER1: Symbol("TURN_PLAYER1"),  //player one turn
    TURN_PLAYER2: Symbol("TURN_PLAYER2"),  //player two turn
    QUIT: Symbol("QUIT"),  //when player wants to give up, show winner
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

let testId = 0;

class Player{
    constructor(username = "Guest"){
        this.testId = testId++;  //1 or 2  (identifies if it his left player or right player)
        this.username = username;  //players are by default guests
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
        this.players = [new Player(), new Player("Local")];  //fixed to 2
        this.storages = [];  //fixed to 2 nº storages [nº storages][nº Seeds] stores seeds objects
        /*
        player1 -> [1 (5)]  [2 (4)]  [3 (3)]  [4 (2)]  [5 (1)]       [real index (virtual index)]
        player2 -> [6 (1)]  [7 (2)]  [8 (3)]  [9 (4)]  [10 (5)]
        */
        this.cavities = [];  //array of arrays [nº Cavities * 2][nº Seeds] stores seeds objects
        this.turnMessage = "Default turn Message";
        this.sysMessage = "Default system Message";
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
        return this.sysMessage;
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
        this.sysMessage = document.getElementById("p-system-messages-message");
        this.turnMessage = document.getElementById("p-game-area-header-messages");
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
        let cavitie = document.createElement("div");
        cavitie.classList.add("d-game-background-cavity");
        document.getElementById("d-game-background-cavities-p1").appendChild(cavitie);

        let cavitie2 = document.createElement("div");
        cavitie2.classList.add("d-game-background-cavity");
        document.getElementById("d-game-background-cavities-p2").appendChild(cavitie2);

        //Gameplay Area (Top of background)
        let cavitieTop = document.createElement("div");
        cavitieTop.classList.add("d-gameplay-cavity");
        document.getElementById("d-gameplay-cavities-p1").appendChild(cavitieTop);

        let cavitieTop2 = document.createElement("div");
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

    updateTurnMessage(text){
        this.turnMessage.innerHTML = text;
    }

    updateSysMessage(text){
        this.sysMessage.innerHTML = text;
    }

    updateScore(score1, score2){
        let scoreElem1 = document.getElementById("p-game-area-header-score--1");
        scoreElem1.innerHTML = score1;

        let scoreElem2 = document.getElementById("p-game-area-header-score--2");
        scoreElem2.innerHTML = score2;
    }

    //Listeners
    listenConfigs(){
        const configsButton = document.getElementById("button-settings-info--config");
        configsButton.addEventListener("click", this.presenter.handleConfigs.bind(this.presenter));
    }

    listenResetConfigs(){
        const resetElement = document.getElementById("button-settings-info--reset");
        resetElement.addEventListener("click", this.presenter.resetConfigs.bind(this.presenter));
    }

    listenCommands(){
        const startCommand = document.getElementById("button-command-start");
        startCommand.addEventListener("click", this.presenter.handleStartCommand.bind(this.presenter));

        const quitCommand = document.getElementById("button-command-quit");
        quitCommand.addEventListener("click", this.presenter.handleQuitCommand.bind(this.presenter));
    }

    listenCavity(cavityElement, index){
        cavityElement.addEventListener("click", this.presenter.handleCavities.bind(this.presenter, index));
    }

    listenAll(){
        this.listenConfigs();
        this.listenResetConfigs();
        this.listenCommands();
    }
}

/**
 * Presenter
 */
class GamePresenter{
    constructor(model, viewer){
        this.model = model;
        this.viewer = viewer;
        this.state = gameState.CONFIG;  //game starts in CONFIG mode
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

        if(nCavs > configDefaultValues.MAX_CAVITIES || nCavs < configDefaultValues.MIN_CAVITIES){
            console.log("Warning: -> handleConfigs() <- Tried to input value of cavities not accepted in configurations");
            return;
        }

        if(nSeeds > configDefaultValues.MAX_SEEDS || nSeeds < configDefaultValues.MIN_SEEDS){
            console.log("Warning: -> handleConfigs() <- Tried to input value of seeds not accepted in configurations");
            return;
        }

        this.config(nCavs, nSeeds);
    }

    config(nCavs, nSeeds){
        if(this.state == gameState.CONFIG || this.state == gameState.QUIT){
            //deleting cavities and empty storages in Model
            this.model.deleteCavities();
            this.model.emptyStorages();

            //deleting cavities and empty storages in Viewer
            this.viewer.deleteCavities();
            this.viewer.emptyStorages();

            //create cavities and seeds in Model
            this.model.config(nCavs, nSeeds);

            //create cavities and seeds in Viewer
            this.createCavitiesAndSeeds(nCavs);
        }
        else{
            this.updateSysMessage("You can't configure the game after it started!");
        }
    }

    resetConfigs(){
        this.model.resetConfigs();
        this.config(configDefaultValues.N_CAVITIES, configDefaultValues.N_SEEDS);
    }

    createCavitiesAndSeeds(nCavs){  //also creates seeds quantities in cavities and storages
        for(let i = 0; i < nCavs; i++){
            this.viewer.createCavity();
        }

        const cavityElements = document.getElementsByClassName("d-gameplay-cavity");

        for(let j = 0; j < nCavs * 2; j++){
            for(let k = 0; k < this.model.cavities[j].length; k++){
                this.viewer.createSeed(this.model.cavities[j][k].getId(), cavityElements[j], this.model.cavities[j][k].position.getY(), this.model.cavities[j][k].position.getX(), this.model.cavities[j][k].seedRes);
            }
            this.viewer.listenCavity(cavityElements[j], j);
        }

        for(let i = 0; i < nCavs * 2; i++){
            this.viewer.createHoverQuantity(cavityElements[i]);
        }

        const storageElements = document.getElementsByClassName("d-gameplay-storage");

        for(let j = 0; j < 2; j++){
            for(let k = 0; k < this.model.storages[j].length; k++){
                this.viewer.createSeed(this.model.storages[j][k].getId(), storageElements[j], this.model.storages[j][k].position.getY(), this.model.storages[j][k].position.getX(), this.model.storages[j][k].seedRes);
            }
        }

        for(let i = 0; i < 2; i++){
            this.viewer.createHoverQuantity(storageElements[i]);
        }
    }

    updateSysMessage(text){
        this.model.sysMessage = text;
        this.viewer.updateSysMessage(this.model.sysMessage);
    }

    updateTurnMessage(text){
        this.model.turnMessage = text;
        this.viewer.updateTurnMessage(this.model.turnMessage);
    }

    updateCavitiesAndStorages(){
        this.viewer.emptyStorages();
        this.viewer.deleteCavities();
        this.createCavitiesAndSeeds(this.model.cavities.length / 2);
    }

    handleCavities(cavityRealIndex){
        const nCavs = this.model.cavities.length / 2;

        switch(this.state){
            case gameState.CONFIG:
            case gameState.QUIT:
                this.viewer.updateSysMessage("You haven't started a game yet!");
                break;
            case gameState.TURN_PLAYER1:
                if(cavityRealIndex >= nCavs){
                    this.viewer.updateTurnMessage("That cavitity belongs to " + this.model.players[1].getUsername());
                    var that = this;
                    setTimeout(function () {
                        that.updateTurnMessage("It's " + that.model.players[0].getUsername() + " turn");
                    }, 2000);
                }
                else{
                    if(!this.makePlay(this.state, cavityRealIndex)) this.switchTurns();
                }
                break;
            case gameState.TURN_PLAYER2:
                if(cavityRealIndex < nCavs){
                    this.viewer.updateTurnMessage("That cavitites belongs to " + this.model.players[0].getUsername());
                    var that = this;
                    setTimeout(function () {
                        that.updateTurnMessage("It's " + that.model.players[1].getUsername() + " turn");
                    }, 2000);
                }
                else{
                    if(!this.makePlay(this.state, cavityRealIndex)) this.switchTurns();
                }
                break;
            default:
                console.log("Error -> handleCavities() <- state not recognized");
        }
    }

    switchTurns(){
        if(this.state == gameState.TURN_PLAYER1){
            this.updateTurnMessage("It's " + this.model.players[1].getUsername() + " turn");
            this.state = gameState.TURN_PLAYER2;
        }
        else{
            this.updateTurnMessage("It's " + this.model.players[0].getUsername() + " turn");
            this.state = gameState.TURN_PLAYER1;
        }
    }

    makePlay(state, cavityRealIndex){
        if(this.model.cavities[cavityRealIndex].lenght == 0){
            console.log("Error -> makePlay() <- no seeds in this cavity");
            return;
        }

        const nCavs = this.model.cavities.length / 2;

        let dest = cavityRealIndex;

        let i = 0; //to skip the first iteration

        while(this.model.cavities[cavityRealIndex].length > 0){
            if(dest == (nCavs * 2)){
                if(i > 0 && state == gameState.TURN_PLAYER2) this.moveSeedToStorage(cavityRealIndex, 1);
                dest = nCavs - 1;
            }
            else if(dest >= nCavs){
                if(i > 0) this.moveSeedToCavity(cavityRealIndex, dest);
                dest++;
            }
            else if(dest < 0){
                if(i > 0 && state == gameState.TURN_PLAYER1) this.moveSeedToStorage(cavityRealIndex, 0);
                dest = nCavs;
            }
            else{  // < nCavs
                if(i > 0) this.moveSeedToCavity(cavityRealIndex, dest);
                dest--;
            }
            i++;
        }

        this.updateCavitiesAndStorages();
        this.updateScore();

        if((state == gameState.TURN_PLAYER1 && dest == nCavs) ||
           (state == gameState.TURN_PLAYER2 && dest == (nCavs - 1))){  //if true play again
            return true;
        }else{
            return false;
        }
    }

    updateScore(){
        const score1 = this.model.storages[0].length;
        const score2 = this.model.storages[1].length;
        this.viewer.updateScore(score1, score2);
    }

    generateInitPlayer(){
        //returns a random integer from 0 to 1 ->  2 players available
        const randPlayer = Math.ceil(Math.random()*2) - 1;

        switch(randPlayer){
            case 0:
                this.state = gameState.TURN_PLAYER1;
                this.updateTurnMessage("It's " + this.model.players[0].getUsername() + " turn");
                break;
            case 1:
                this.state = gameState.TURN_PLAYER2;
                this.updateTurnMessage("It's " + this.model.players[1].getUsername() + " turn");
                break;
            default:
                console.log("Error -> generateInitPlayer() <- invalid randPlayer number!");

        }
    }

    handleStartCommand(){
        if(this.state == gameState.QUIT || this.state == gameState.CONFIG){
            this.updateSysMessage("You started a game :)");

            this.generateInitPlayer();
        }
        else{
            this.updateSysMessage("You are already playing a game!");
        }
    }

    handleQuitCommand(){
        if(this.state == gameState.TURN_PLAYER1 || this.state == gameState.TURN_PLAYER2){
            this.state = gameState.QUIT;
            //TODO: save results
            this.resetConfigs();
            this.updateScore();
            this.updateSysMessage("You quitted this game :(");
            //display winner TODO:
        }
        else{
            this.updateSysMessage("You are not playing a game yet!");
        }
    }

    //moves the first seed in cavity
    moveSeedToCavity(origCavityRealIndex, destCavityRealIndex){
        const seed = this.model.cavities[origCavityRealIndex].shift();  //removes and retrieves first array element

        if(seed == undefined){
            console.log("Error -> moveSeedToCavity() <- no seeds in array.");
            return;
        }

        this.model.cavities[destCavityRealIndex].push(seed);
    }

    //moves the first seed in storage
    moveSeedToStorage(origCavityRealIndex, destStorage){
        const seed = this.model.cavities[origCavityRealIndex].shift();  //removes and retrieves first array element

        if(seed == undefined){
            console.log("Error -> moveSeedToStorage() <- no seeds in array.");
            return;
        }

        this.model.storages[destStorage].push(seed);
    }
}

/**
 * Game Configuration
 */

//temporary
document.getElementById("d-game-area-background").style.display = "grid";

class GameMain{
    constructor(){
        this.gameModel = new GameModel();
        this.gameViewer = new GameViewer();
        this.gamePresenter = new GamePresenter(this.gameModel, this.gameViewer);
        this.gameViewer.registerWith(this.gamePresenter);
    }

    run(){
        this.gameViewer.listenAll();
        this.gamePresenter.resetConfigs();
    }
}

const game = new GameMain();

game.run();

/**
 * Authentication
 */

/**
 * Chat
 */


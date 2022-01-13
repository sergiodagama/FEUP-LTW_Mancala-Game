/**
 * Constants
 */

//----------------- RESOURCES -----------------

//Seeds
const seedRes = ["../res/seeds/seed_red.png", "../res/seeds/seed_green.png", "../res/seeds/seed_yellow.png", "../res/seeds/seed_blue.png"];
const seedResAlt = ["../res/seeds/seed_red_alt.png", "../res/seeds/seed_green_alt.png", "../res/seeds/seed_yellow_alt.png", "../res/seeds/seed_blue_alt.png"];

//Countries flags and Modes icons
const countryRes = ["../res/flags/guest.png", "../res/flags/online.png", "../res/flags/computer.png", "../res/flags/al.png", "../res/flags/br.png", "../res/flags/computer.png", "../res/flags/es.png", "../res/flags/fr.png", "../res/flags/pt.png"];

//Audios
const fireworkAudios = ["../res/audio/fireworks/soft.mp3", "../res/audio/fireworks/hard.mp3", "../res/audio/fireworks/splash.mp3"];
//const backgroundAudio = "../res/audio/background/background.mp3";

//------------ GAME CONFIGURATIONS -------------

//Default values for game configuration
const configDefaultValues = {
    N_SEEDS: 5,     //seeds per cavity
    N_CAVITIES: 6,  //cavities per side
    MAX_SEEDS: 10,
    MIN_SEEDS: 1,
    MAX_CAVITIES: 8,
    MIN_CAVITIES: 2,
 };

 //------------------- STATES -------------------

 //Game states
const gameState = {
    CONFIG: Symbol("CONFIG"),  //configurating the game
    TURN_PLAYER1: Symbol("TURN_PLAYER1"),  //player one turn
    TURN_PLAYER2: Symbol("TURN_PLAYER2"),  //player two turn
    QUIT: Symbol("QUIT"),  //when player wants to give up, show winner
 };

//Winning states
const winningState = {
    TIE: Symbol("TIE"),
    PLAYER1_WON: Symbol("PLAYER1_WON"),
    PLAYER2_WON: Symbol("PLAYER2_WON"),
 };

 //Game modes
const gameMode = {
    LOCAL: Symbol("LOCAL"),
    PC: Symbol("PC"),
    ONLINE: Symbol("ONLINE"),
 };

 //Computer Mode dificulty levels
 const computerDificulty = {
    EASY: Symbol("EASY"),
    MEDIUM: Symbol("MEDIUM"),
    HARD: Symbol("HARD"),
 };

 //Development Macros
const DEBUGGING = false;

const dificultyDepth = {
    EASY: 2,
    MEDIUM: 5,
    HARD: 7,
}

const colors  = {
    turnHighlight: "#F0851B"
}

const timeouts = {
    turnHighlights: 700,
    turnWarnings: 1500,
    startBigMessage: 2500,
    pcModeDelay: 2000
}

/**
 * Utils
 */
 const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

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

    createGameBasedOnArrays(cavs, stores){
        //delete existing seeds and cavities
        this.deleteCavities();
        this.emptyStorages();

        //add cavites and create seeds
        for(let i = (cavs.length/2)-1; i >= 0; i--){
            let seeds = [];
            for(let k = 0; k < cavs[i]; k++){
                seeds.push(new Seed());
            }
            this.cavities.push(seeds);
        }

        for(let i = cavs.length/2; i < cavs.length; i++){
            let seeds = [];
            for(let k = 0; k < cavs[i]; k++){
                seeds.push(new Seed());
            }
            this.cavities.push(seeds);
        }

        for(let i = 0; i < 2; i++){
            let seeds = [];
            for(let k = 0; k < stores[i]; k++){
                seeds.push(new Seed());
            }
            this.storages[i] = seeds;
        }
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
        this.emptyStorages();

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

    updatePlayer1(player){
        this.players[0] = player;
    }

    updatePlayer2(player){
        this.players[1] = player;
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
        this.player1Name = document.getElementById("p-game-area-header-p1-name");
        this.player2Name = document.getElementById("p-game-area-header-p2-name");
        this.fireworks = null;
    }

    registerWith(presenter){
        this.presenter = presenter;
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

    emptyStorages(){
        const gameplayCavities = document.getElementsByClassName("d-gameplay-storage");

        while (gameplayCavities[0].firstChild) {
            gameplayCavities[0].removeChild(gameplayCavities[0].firstChild);
        }

        while (gameplayCavities[1].firstChild) {
            gameplayCavities[1].removeChild(gameplayCavities[1].firstChild);
        }
    }

    updateTurnMessage(text, highlight){
        this.turnMessage.innerHTML = text;

        if(highlight){
            const prevColor = this.turnMessage.style.color;

            this.turnMessage.style.color = colors.turnHighlight;

            const that = this;

            setTimeout(function () {
                that.turnMessage.style.color = prevColor;
            }, timeouts.turnHighlights);
        }
    }

    updateSysMessage(text){
        this.sysMessage.innerHTML = text;
    }

    updatePlayer1Name(name){
        this.player1Name.innerHTML = name;
    }

    updatePlayer2Name(name){
        this.player2Name.innerHTML = name;
    }

    updateScore(score1, score2){
        let scoreElem1 = document.getElementById("p-game-area-header-score--1");
        scoreElem1.innerHTML = score1;

        let scoreElem2 = document.getElementById("p-game-area-header-score--2");
        scoreElem2.innerHTML = score2;
    }

    displayWinner(won, player1Name, player2Name){
        const winnerBanner = document.getElementById("d-game-area-winner-banner");
        const primPhrase = document.getElementById("p-winner-banner-primary");
        const secunPhrase = document.getElementById("p-winner-banner-secundary");

        if(won != winningState.TIE){
            this.fireworks = new FireworksScene("c-game-area-fireworks", 800, 600);
            this.fireworks.start();

            document.getElementById("c-game-area-fireworks").style.display = "block";
        }

        winnerBanner.style.display = "grid";
        let primaryWinPhrase = "WINS", secundaryWinPhrase;

        switch(won){
            case winningState.TIE:
                primaryWinPhrase = "TIE";
                secundaryWinPhrase = "The game ended in a";
                break;
            case winningState.PLAYER1_WON:
                secundaryWinPhrase = player1Name;
                break;
            case winningState.PLAYER2_WON:
                secundaryWinPhrase = player2Name;
                break;
            default:
                console.log("Error -> displayWinner() <- no such winning state available");
        }

        primPhrase.innerHTML = primaryWinPhrase;
        secunPhrase.innerHTML = secundaryWinPhrase;
    }

    displayStartBigMessage(){
        const bigMessage = document.getElementById("p-game-area-big-messages");

        bigMessage.style.display = "block";
        setTimeout(function () {
            bigMessage.style.display = "none";
        }, timeouts.startBigMessage);
    }

    disableModesCheckboxes(){
        document.getElementById("input-settings-info--local").disabled = true;
        document.getElementById("input-settings-info--online").disabled = true;
        document.getElementById("input-settings-info--computer").disabled = true;

        document.getElementById("input-settings-info--easy").disabled = true;
        document.getElementById("input-settings-info--medium").disabled = true;
        document.getElementById("input-settings-info--hard").disabled = true;

        document.getElementById("input-settings-info--ncavities").disabled = true;
        document.getElementById("input-settings-info--nseeds").disabled = true;
    }

    enableModesCheckboxes(){
        document.getElementById("input-settings-info--local").disabled = false;
        document.getElementById("input-settings-info--online").disabled = false;
        document.getElementById("input-settings-info--computer").disabled = false;

        document.getElementById("input-settings-info--easy").disabled = false;
        document.getElementById("input-settings-info--medium").disabled = false;
        document.getElementById("input-settings-info--hard").disabled = false;

        document.getElementById("input-settings-info--ncavities").disabled = false;
        document.getElementById("input-settings-info--nseeds").disabled = false;
    }

    removeWinner(){
        const winnerBanner = document.getElementById("d-game-area-winner-banner");
        winnerBanner.style.display = "none";
        if(this.fireworks != null) this.fireworks.stop();
        document.getElementById("c-game-area-fireworks").style.display = "none";
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

        //game states
        this.state = gameState.CONFIG;  //game starts in CONFIG mode
        this.mode = gameMode.LOCAL;
        this.computerDificulty = undefined;
        this.onlineMode = null;
    }

    //Getters
    getModel(){
        return this.model;
    }

    getViewer(){
        return this.viewer;
    }

    setOnlineMode(onlineMode){
        this.onlineMode = onlineMode;
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
        this.viewer.removeWinner();

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

    updateTurnMessage(text, highlight){
        this.model.turnMessage = text;
        this.viewer.updateTurnMessage(this.model.turnMessage, highlight);
    }

    updatePlayer1Name(){
        this.viewer.updatePlayer1Name(this.model.players[0].getUsername());
    }

    updatePlayer2Name(){
        this.viewer.updatePlayer2Name(this.model.players[1].getUsername());
    }

    updateCavitiesAndStorages(){
        this.viewer.emptyStorages();
        this.viewer.deleteCavities();
        this.createCavitiesAndSeeds(this.model.cavities.length / 2);
    }

    handleCavities(cavityRealIndex){
        const nCavs = this.model.cavities.length / 2;

        const that = this;  //used for timeout function
        if(this.mode != gameMode.ONLINE){
            switch(this.state){
                case gameState.CONFIG:
                case gameState.QUIT:
                    this.viewer.updateSysMessage("You haven't started a game yet!");
                    break;
                case gameState.TURN_PLAYER1:
                    if(cavityRealIndex >= nCavs){
                        this.viewer.updateTurnMessage("That cavitity belongs to " + this.model.players[1].getUsername(), true);
                        setTimeout(function () {
                            that.updateTurnMessage("It's " + that.model.players[0].getUsername() + " turn");
                        }, timeouts.turnWarnings);

                        return;
                    }
                    if(this.model.cavities[cavityRealIndex].length == 0){
                        this.viewer.updateTurnMessage("That cavitity is empty, choose another one", true);

                        setTimeout(function () {
                            that.updateTurnMessage("It's " + that.model.players[0].getUsername() + " turn");
                        }, timeouts.turnWarnings);

                        return;
                    }
                    if(this.mode == gameMode.LOCAL){
                        if(!this.makePlay(this.state, cavityRealIndex)) this.switchTurns();
                    }
                    else{
                        //make player one play
                        if(this.makePlay(this.state, cavityRealIndex)) break;

                        if(this.state == gameState.CONFIG) break;  //when guest wins prevents from making computer play

                        this.switchTurns();

                        sleep(timeouts.pcModeDelay).then(() => {
                            let pcPlayAgain = true;

                            while(pcPlayAgain){

                                //create shadow game equal to current game
                                let shadowGame = new ShadowGame(gameState.TURN_PLAYER2, 0, 0);
                                shadowGame.configWithArrays(this.model.cavities, this.model.storages);
                                let depth;

                                //changing depth of minimax, based on dificulty
                                switch(this.computerDificulty){
                                    case computerDificulty.EASY:
                                        depth = dificultyDepth.EASY;
                                        break;
                                    case computerDificulty.MEDIUM:
                                        depth = dificultyDepth.MEDIUM;
                                        break;
                                    case computerDificulty.HARD:
                                        depth = dificultyDepth.HARD;
                                        break;
                                    default:
                                        console.log("Error -> makePlay() <- no such dificulty exists");
                                }

                                //get the best play using shadow game
                                const bestPlay = shadowGame.getBestPlay(depth);

                                //making the best play
                                pcPlayAgain = this.makePlay(this.state, bestPlay.index);
                            }
                            this.switchTurns();
                        })
                    }
                    break;
                case gameState.TURN_PLAYER2:
                    if(this.mode == gameMode.PC){
                        return;
                    }
                    if(cavityRealIndex < nCavs){
                        this.viewer.updateTurnMessage("That cavitites belongs to " + this.model.players[0].getUsername(), true);
                        setTimeout(function () {
                            that.updateTurnMessage("It's " + that.model.players[1].getUsername() + " turn");
                        }, timeouts.turnWarnings);

                        return;
                    }
                    if(this.model.cavities[cavityRealIndex].length == 0){
                        this.viewer.updateTurnMessage("That cavitity is empty, choose another one", true);

                        setTimeout(function () {
                            that.updateTurnMessage("It's " + that.model.players[1].getUsername() + " turn");
                        }, timeouts.turnWarnings);

                        return;
                    }
                    if(!this.makePlay(this.state, cavityRealIndex)) this.switchTurns();
                    break;
                default:
                    console.log("Error -> handleCavities() <- state not recognized");
            }
        }
        //in the case of online mode
        else{
            //in case this player is the second one convert index to range 0-nCavs
            if(!this.onlineMode.secondPlayer){
                const index = (nCavs-1) - cavityRealIndex
                this.onlineMode.notify(index);
            }
            else{
                const index = cavityRealIndex - nCavs;
                this.onlineMode.notify(index);
            }
        }
    }

    switchTurns(){
        if(this.state == gameState.CONFIG) return;
        if(this.state == gameState.TURN_PLAYER1){
            this.updateTurnMessage("It's " + this.model.players[1].getUsername() + " turn", true);
            this.state = gameState.TURN_PLAYER2;
        }
        else{
            this.updateTurnMessage("It's " + this.model.players[0].getUsername() + " turn", true);
            this.state = gameState.TURN_PLAYER1;
        }
    }

    makePlay(state, cavityRealIndex){
        if(this.model.cavities[cavityRealIndex].length == 0){
            console.log("Error -> makePlay() <- no seeds in this cavity");
            return;
        }

        const nCavs = this.model.cavities.length / 2;

        let dest = cavityRealIndex;
        let prevDest = dest;  //only used to check if final cavity is empty

        let i = 0; //to skip the first iteration

        while(this.model.cavities[cavityRealIndex].length > 0){
            prevDest = dest;
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

        //when last seed ends in player empty cavity
        if(prevDest != -1 && prevDest != (nCavs * 2)){
            if(state == gameState.TURN_PLAYER1 && prevDest < nCavs){
                if(this.model.cavities[prevDest].length == 1){
                    //removes seeds from opposite side and from prevDest and add to storage 1
                    const opposite = this.getOppositeIndex(prevDest, nCavs);

                    while(this.model.cavities[opposite].length > 0){
                        this.moveSeedToStorage(opposite, 0);
                    }
                    this.moveSeedToStorage(prevDest, 0);
                }
            }
            else if(state == gameState.TURN_PLAYER2 && prevDest >= nCavs){
                if(this.model.cavities[prevDest].length == 1){
                    //removes seeds from opposite side and from prevDest and add to storage 2
                    const opposite = this.getOppositeIndex(prevDest, nCavs);

                    while(this.model.cavities[opposite].length > 0){
                        this.moveSeedToStorage(opposite, 1);
                    }
                    this.moveSeedToStorage(prevDest, 1);
                }
            }
        }

        //update cavities, storages and score
        this.updateCavitiesAndStorages();
        this.updateScore();

        //checkers for end of game
        if(this.checkNoPlays(0, nCavs)){
            this.gameEnd(0);
            return;
        }
        else if(this.checkNoPlays(1, nCavs)){
            this.gameEnd(1);
            return;
        }

        //set play again flag
        if((state == gameState.TURN_PLAYER1 && dest == nCavs) ||
           (state == gameState.TURN_PLAYER2 && dest == (nCavs - 1))){  //if true play again
            return true;
        }else{
            return false;
        }
    }

    getOppositeIndex(index, nCavs){
        if(index >= nCavs) return index - nCavs;
        else return index + nCavs;
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
                this.updateTurnMessage("It's " + this.model.players[0].getUsername() + " turn", true);
                break;
            case 1:
                this.state = gameState.TURN_PLAYER2;
                this.updateTurnMessage("It's " + this.model.players[1].getUsername() + " turn", true);
                break;
            default:
                console.log("Error -> generateInitPlayer() <- invalid randPlayer number!");
        }
    }

    checkNoPlays(playerNumb, nCavs){  //player 0 or 1
        let end = true;

        for(let i = playerNumb * nCavs; i < nCavs + (nCavs * playerNumb); i++){
            if(this.model.cavities[i].length > 0){
                end = false;
            }
        }
        return end;
    }

    gameEnd(playerNumb){ //the playerNumb refers to the player with no plays

        //retrieving all opponent seeds to his own storage
        if(playerNumb == 0){
            for(let i = this.model.cavities.length / 2; i < this.model.cavities.length; i++){
                while(this.model.cavities[i].length > 0){
                    this.moveSeedToStorage(i, 1);
                }
            }
        }
        else if(playerNumb == 1){
            for(let i = 0; i < this.model.cavities.length / 2; i++){
                while(this.model.cavities[i].length > 0){
                    this.moveSeedToStorage(i, 0);
                }
            }
        }
        else{
            console.log("Error -> gameEnd() <- wrong player number given.");
        }

        //show winner
        this.winner(false);
    }

    winner(quitted){
        let won;

        if(!quitted){
            if(this.model.storages[0].length == this.model.storages[1].length){
                //tie
                won = winningState.TIE;
            }
            else if(this.model.storages[0].length > this.model.storages[1].length){
                //player 1 won
                won = winningState.PLAYER1_WON;
            }
            else{
                //player 2 won
                won = winningState.PLAYER2_WON;
            }
        }
        else{
            won = winningState.PLAYER2_WON;
        }

        //show winner
        this.updateScore();
        this.updateSysMessage("The game has finished!");
        this.viewer.displayWinner(won, this.model.players[0].getUsername(), this.model.players[1].getUsername());
        this.model.resetConfigs();
        this.viewer.enableModesCheckboxes();
        this.state = gameState.CONFIG;
    }

    configComputerDificulty(){
        if(document.getElementById("input-settings-info--easy").checked){
            this.computerDificulty = computerDificulty.EASY;
        }
        else if(document.getElementById("input-settings-info--medium").checked){
            this.computerDificulty = computerDificulty.MEDIUM;
        }
        else{
            this.computerDificulty = computerDificulty.HARD;
        }
    }

    handleStartCommand(){
        if(document.getElementById("input-settings-info--online").checked){
            this.updateSysMessage("You can't start the game yourself in this mode!");
        }
        else{
            if(this.state == gameState.QUIT || this.state == gameState.CONFIG){
                if(document.getElementById("input-settings-info--computer").checked){
                    this.mode = gameMode.PC;
                    this.model.players[1].setUsername("Computer");
                    this.state = gameState.TURN_PLAYER1;  //when it is against the computer the player one always starts first
                    this.updateTurnMessage("It's " + this.model.players[0].getUsername() + " turn", true);
                    this.configComputerDificulty();
                }
                else if(document.getElementById("input-settings-info--local").checked){
                    this.mode = gameMode.LOCAL;
                    this.model.players[1].setUsername("Local");
                    this.generateInitPlayer();
                }

                this.viewer.displayStartBigMessage();
                this.updateCavitiesAndStorages();
                this.updateScore();
                this.updateSysMessage("You started a game :)");
                this.viewer.removeWinner();
                this.viewer.disableModesCheckboxes();
            }
            else{
                this.updateSysMessage("You are already playing a game!");
            }
        }
    }

    startGameOnlineMode(data){
        this.mode = gameMode.ONLINE;

        //to check if player stays with bottom cavs or not
        if(this.model.players[0].username == Object.keys(data.sides)[0]) this.onlineMode.secondPlayer = false;
        else this.onlineMode.secondPlayer = true;

        //updating online player names
        this.model.players[0].setUsername(Object.keys(data.sides)[0]);
        this.model.players[1].setUsername(Object.keys(data.sides)[1]);

        this.viewer.updatePlayer1Name(this.model.players[0].username);
        this.viewer.updatePlayer2Name(this.model.players[1].username);

        //getting initial number of cavities and seeds
        const nCavs = data.sides[Object.keys(data.sides)[0]].pits.length;
        const nSeeds = data.sides[Object.keys(data.sides)[0]].pits[0];

        //update turn message
        this.updateTurnMessage("It's " + data.turn + " turn", true);

        this.viewer.displayStartBigMessage();
        this.config(nCavs, nSeeds);
        this.updateScore();
        this.viewer.removeWinner();
        this.viewer.disableModesCheckboxes();
    }

    updateBoardOnlineMode(data){
        console.log(data);
        //update cavities and storage models with updated data
        let newCavs = data.sides[Object.keys(data.sides)[0]].pits;
        newCavs = newCavs.concat(data.sides[Object.keys(data.sides)[1]].pits);

        let newStores = [
            data.sides[Object.keys(data.sides)[0]].store,
            data.sides[Object.keys(data.sides)[1]].store
        ];

        //console.log("NEW: ", newCavs, " AND ", newStores);

        this.model.createGameBasedOnArrays(newCavs, newStores);

        this.updateCavitiesAndStorages();

        //update turn message
        this.updateTurnMessage("It's " + data.turn + " turn", false);

        //update scores
        this.updateScore(this.model.storages[0].length, this.model.storages[1].length);
    }

    handleQuitCommand(){
        if(this.state == gameState.TURN_PLAYER1 || this.state == gameState.TURN_PLAYER2){
            this.state = gameState.QUIT;
            this.winner(true);
            this.updateSysMessage("You quitted this game :(");
            //TODO: save results
        }
        else{
            //in the online mode the quit is handled in the fecth request in OnlineMode class
            if(this.mode != gameMode.ONLINE) this.updateSysMessage("You are not playing a game yet!");
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

    getCurrentConfigs(){
        const cavities = document.getElementById("input-settings-info--ncavities").value;
        const seeds = document.getElementById("input-settings-info--nseeds").value;

        return [cavities, seeds];
    }
}

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

    registerWith(onlineMode){
        this.gamePresenter.setOnlineMode(onlineMode);
    }
}

const game = new GameMain();
game.run();

/**
 * Server Requests (Online mode support)
 */

class OnlineMode {
    constructor(){
        this.game = null;
        this.formLogin = document.getElementById("form-authentication-login");
        this.formRegister = document.getElementById("form-authentication-signup");
        this.userTab = document.getElementById("d-authentication-userTab");
        this.serverName = 'http://twserver.alunos.dcc.fc.up.pt:8008';
        this.eventSource = null;

        //logged user (more pratical than getting it from model)
        this.nick = '';
        this.password = '';

        this.gameId = '';
        this.started = false;

        this.secondPlayer = false;  //to check if it is going to have the bottom cavs
    }

    registerWith(game){
        this.game = game;
    }

    showUserTab(username){
        console.log("HERE: ", username);
        this.game.gameModel.updatePlayer1(new Player(username));
        this.game.gamePresenter.updatePlayer1Name();

        this.formLogin.style.display = "none";
        this.formRegister.style.display = "none";
        this.userTab.style.display = "grid";

        const userInfo = document.getElementsByClassName("d-userTab-info");

        userInfo[0].innerHTML = username;

        document.getElementById("h2-authentication-title").innerHTML = "Account";
    }

    hideUserTab(){
        this.formLogin.style.display = "block";
        this.formRegister.style.display = "none";
        this.userTab.style.display = "none";

        const userInfo = document.getElementsByClassName("d-userTab-info");

        userInfo[0].innerHTML = "Username";
        this.nick = '';
        this.password = '';

        document.getElementById("h2-authentication-title").innerHTML = "Authentication";
        document.getElementById("section-main-commands").style.display = "flex";
        document.getElementById("p-game-area-header-p1-name").innerHTML = "Guest";
    }

    //listeners and handlers
    listenFormLogin(){
        const that = this;

        this.formLogin.addEventListener("submit", function (e){
            e.preventDefault();

            this.formLogin = document.getElementById("form-authentication-login");

            const nick = this.formLogin.elements["nick"].value;
            const password = this.formLogin.elements["password"].value;

            const requestData = JSON.stringify({
                'nick': nick,
                'password': password
            })

            fetch(that.serverName + '/register',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    method: 'post',
                    body: requestData
                }
            )
            .then(
                function(response) {
                    // See server response data
                    response.json().then(function(data) {
                        if (response.status == 400) {
                            that.game.gamePresenter.updateSysMessage(data.error);
                        }
                        else if(response.status == 200){
                            that.game.gamePresenter.updateSysMessage("Logged in with success!");

                            that.nick = nick;
                            that.password = password;

                            //show user tab and hide login section
                            that.showUserTab(nick);
                        }
                        console.log(data);
                    });
                }
            )  // in case of fetch error
            .catch(function(error) {
                console.log('Fetch Error in Login: ', error);
            });
        });
    }

    listenFormRegister(){
        const that = this;

        this.formRegister.addEventListener("submit", function (e){
            e.preventDefault();

            this.formRegister = document.getElementById("form-authentication-signup");

            const nick = this.formRegister.elements["nick"].value;
            const password = this.formRegister.elements["password"].value;

            const requestData = JSON.stringify({
                'nick': nick,
                'password': password,
            })

            fetch(that.serverName + '/register',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    method: 'post',
                    body: requestData
                }
            )
            .then(
                function(response) {
                    response.json().then(function(data) {
                        if(response.status == 400){
                            that.game.gamePresenter.updateSysMessage(data.error);
                        }
                        // See server response data
                        else if(response.status == 200){
                            that.game.gamePresenter.updateSysMessage("Registered with success!");

                            that.nick = nick;
                            that.password = password;

                            //show user tab and hide login section
                            that.showUserTab(nick);
                        }
                        console.log(data);
                    });

                }
            )  // in case of fetch error
            .catch(function(error) {
                console.log('Fetch Error in Register: ', error);
            });
        });
    }

    listenLogout(){
        const that = this;

        document.getElementById("a-authentication-logout").addEventListener('click', function() {
            that.hideUserTab();
            that.game.gamePresenter.updateSysMessage("Logged out with success!");
            that.gameId = '';
        });
    }

    listenJoin(){
        const that = this;

        document.getElementById("img-search-bar-add-icon").addEventListener('click', function() {

            const configs = that.game.gamePresenter.getCurrentConfigs();

            const requestData = JSON.stringify({
                'group': 0,
                'nick': that.nick,
                'password' : that.password,
                'size': configs[0],
                'initial': configs[1],
            })

            if(that.nick != ''){
                fetch(that.serverName + '/join',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        method: 'post',
                        body: requestData
                    }
                )
                .then(
                    function(response) {
                        response.json().then(function(data) {
                            if(response.status == 400){
                                that.game.gamePresenter.updateSysMessage(data.error);

                            }
                            // See server response data
                            else if(response.status == 200){
                                that.game.gamePresenter.updateSysMessage("You successfully joined a game!");

                                that.gameId = data.game;

                                that.listenUpdate();
                            }
                            console.log(data);
                        });

                    }
                )  // in case of fetch error
                .catch(function(error) {
                    console.log('Fetch Error in Join: ', error);
                });
            }
            else{
                that.game.gamePresenter.updateSysMessage("You have to be signed in!")
            }
        });
    }

    listenLeave(){
        const that = this;

        document.getElementById("button-command-quit").addEventListener('click', function() {

            const requestData = JSON.stringify({
                'game': that.gameId,
                'nick': that.nick,
                'password' : that.password,
            })

            if(that.gameId != ''){
                fetch(that.serverName + '/leave',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        method: 'post',
                        body: requestData
                    }
                )
                .then(
                    function(response) {
                        response.json().then(function(data) {
                            if(response.status == 400){
                                that.game.gamePresenter.updateSysMessage(data.error);
                            }
                            // See server response data
                            else if(response.status == 200){
                                that.game.gamePresenter.updateSysMessage("You successfully leaved the game!");
                                that.gameId = '';
                                that.started = false;
                                //that.eventSource.close();
                                //that.eventSource = null;
                            }
                            console.log(data);
                        });

                    }
                )  // in case of fetch error
                .catch(function(error) {
                    console.log('Fetch Error in Leave: ', error);
                });
            }
            else{
                that.game.gamePresenter.updateSysMessage("You are not in a game yet!")
            }
        });
    }

    listenUpdate(){
        const that = this;

        let updateURL = new URL(this.serverName + '/update');

        if(this.nick != '' && this.gameId != ''){
            updateURL.search = new URLSearchParams({
                'game': this.gameId,
                'nick': this.nick,
            });
        }

        this.eventSource = new EventSource(updateURL);

        this.eventSource.onmessage = function(event) {

            const data = JSON.parse(event.data);

            console.log("DATA: ", event.data);

            if(event.data == {}){
                that.game.gamePresenter.updateSysMessage("Waiting for other player to join");
            }
            else if(!that.started){
                that.game.gamePresenter.updateSysMessage("The game has started");
                that.started = true;
                that.game.gamePresenter.startGameOnlineMode(data.board)
            }
            else{
                //check for win
                if(data.hasOwnProperty('winner')){
                    that.game.gamePresenter.winner(false);
                    that.eventSource.close();
                    that.eventSource = null;
                }
                else{
                    //updating board
                    that.game.gamePresenter.updateBoardOnlineMode(data.board);
                }
            }
        };
        this.eventSource.onerror = function(event) {
            that.game.gamePresenter.updateSysMessage(event.data.error);

        };
    }

    //returns false if move is not done and true if successfull
    notify(move){
        const that = this;

        const requestData = JSON.stringify({
            'game': this.gameId,
            'nick': this.nick,
            'password' : this.password,
            'move': move,
        })

        if(this.gameId != ''){
            fetch(that.serverName + '/notify',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    method: 'post',
                    body: requestData
                }
            )
            .then(
                function(response) {
                    response.json().then(function(data) {
                        if(response.status == 400){
                            that.game.gamePresenter.updateSysMessage(data.error);
                            return false;
                        }
                        // See server response data
                        else if(response.status == 200){
                            console.log("Play on " + move + " done with success!");
                            return true;
                        }
                        console.log(data);
                    });

                }
            )  // in case of fetch error
            .catch(function(error) {
                console.log('Fetch Error in Leave: ', error);
            });
        }
        else{
            this.game.gamePresenter.updateSysMessage("You are not in a game yet!");
            return false;
        }
    }

    listenAll(){
        this.listenFormLogin();
        this.listenFormRegister();
        this.listenLogout();
        this.listenJoin();
        this.listenLeave();
    }
}

const onlineMode = new OnlineMode();
onlineMode.registerWith(game);
onlineMode.listenAll();

game.registerWith(onlineMode);

/**
 * Minimax
 */
class PlayCommand {
    constructor(game, state, cavityRealIndex) {
        this.state = state;  //may be redundant
        this.index = cavityRealIndex;
        this.cavs = JSON.parse(JSON.stringify(game.cavities));
        this.scores = JSON.parse(JSON.stringify(game.storages));
        this.game = game;
    }

    execute(){ this.game.makePlay(this.state, this.index);}

    undo() { this.game.undoPlay(this.cavs, this.scores);}
}

class ShadowGame {
    constructor(state, nCavs, nSeeds, init){
        this.cavities = [];
        this.storages = [];
        this.commandsStack = []; //stack of commands done
        this.state = state;
        if(init) this.configCavitiesAndStorages(nCavs, nSeeds);
    }

    executeCommand(command){
        command.execute();
        this.commandsStack.push(command);
    }

    undoCommand(){
        let poppedCommand = this.commandsStack.pop();
        if(poppedCommand == undefined) console.log("Error -> shadow - undoCommand() <- no commands left in the stack");
        else poppedCommand.undo();
    }

    setCommandsStack(stack){
        this.commandsStack = stack;
    }

    configWithArrays(cavities, storages){
        for(let i = 0; i < cavities.length; i++){
            this.cavities[i] = 0;
            for(let k = 0; k < cavities[i].length; k++){
                this.cavities[i]++;
            }
        }

        for(let i = 0; i < 2; i++){
            this.storages[i] = 0;
            for(let k = 0; k < storages[i].length; k++){
                this.storages[i]++;
            }
        }
    }

    configCavitiesAndStorages(nCavs, nSeeds){
        //delete existing seeds and cavities
        this.emptyCavitiesAndStorages();

        //add cavites and create seeds
        for(let i = 0; i < nCavs * 2; i++){
            this.cavities[i] = 0;
            for(let k = 0; k < nSeeds; k++){
                this.cavities[i]++;
            }
        }
        this.storages[0] = 0;
        this.storages[1] = 0;
    }

    emptyCavitiesAndStorages(){
        this.cavities = [];
        this.storages = [];
    }

    printShadowBoard(){
        const nCavs = this.cavities.length / 2;

        console.log(this.storages[0] + " " + this.cavities.slice(0, nCavs));
        console.log("  " + this.cavities.slice(nCavs, nCavs * 2) + " " +  this.storages[1] + "\n");
        console.log("---------------");
    }

    getPlayerScore(state){
        switch (state) {
            case gameState.TURN_PLAYER1:
                return this.storages[0];
            case gameState.TURN_PLAYER2:
                return this.storages[1];
            default:
                console.log("Error -> shadow - getPlayerScore() <- no such state accepted");
                return;
        }
    }

    moveSeedToCavity(origCavityRealIndex, destCavityRealIndex){
        if(this.cavities[origCavityRealIndex] == 0) console.log("Error -> shadow - moveSeedToCavity() <- orig cavity has no seeds");
        else this.cavities[origCavityRealIndex]--;

        this.cavities[destCavityRealIndex]++;
    }

    moveSeedToStorage(origCavityRealIndex, destStorage){
        if(this.cavities[origCavityRealIndex] == 0) console.log("Error -> shadow - moveSeedToStorage() <- cavity has no seeds");
        else this.cavities[origCavityRealIndex]--;

        this.storages[destStorage]++;
    }

    moveSeedFromStorage(origStorage, destCavityRealIndex){  //0 or 1
        if(this.storages[origStorage] == 0) console.log("Error -> shadow - moveSeedFromStorage() <- storage has no seeds");
        else this.storages[origStorage]--;

        this.cavities[destCavityRealIndex]++;
    }

    fillCavity(cavityRealIndex, seeds){
        for(let i = 0; i < seeds; i++){
            this.cavities[cavityRealIndex]++;
        }
    }

    removeSeedsFromCavity(cavityRealIndex, seeds){
        if(this.cavities[cavityRealIndex] < seeds) console.log("Error -> shadow - removeSeedsFromCavity() <- cavity has not that much seeds");
        for(let i = 0; i < seeds; i++){
            this.cavities[cavityRealIndex]--;
        }
    }

    makePlay(state, cavityRealIndex){
        if(this.cavities[cavityRealIndex] == 0){
            console.log("Error -> shadow - makePlay() <- no seeds in this cavity");
            return;
        }

        const nCavs = this.cavities.length / 2;

        let dest = cavityRealIndex;
        let prevDest = dest;  //only used to check if final cavity is empty

        let i = 0; //to skip the first iteration

        while(this.cavities[cavityRealIndex] > 0){
            prevDest = dest;
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

        //when last seed ends in player empty cavity
        if(prevDest != -1 && prevDest != (nCavs * 2)){
            if(state == gameState.TURN_PLAYER1 && prevDest < nCavs){
                if(this.cavities[prevDest] == 1){
                    //removes seeds from opposite side and from prevDest and add to storage 1
                    const opposite = this.getOppositeIndex(prevDest, nCavs);

                    while(this.cavities[opposite] > 0){
                        this.moveSeedToStorage(opposite, 0);
                    }
                    this.moveSeedToStorage(prevDest, 0);
                }
            }
            else if(state == gameState.TURN_PLAYER2 && prevDest >= nCavs){
                if(this.cavities[prevDest] == 1){
                    //removes seeds from opposite side and from prevDest and add to storage 2
                    const opposite = this.getOppositeIndex(prevDest, nCavs);

                    while(this.cavities[opposite] > 0){
                        this.moveSeedToStorage(opposite, 1);
                    }
                    this.moveSeedToStorage(prevDest, 1);
                }
            }
        }
    }

    getOppositeIndex(index, nCavs){
        if(index >= nCavs) return index - nCavs;
        else return index + nCavs;
    }

    undoPlay(cavs, scores){
        this.cavities = cavs;
        this.storages = scores;
    }

    cavitiesNotEmpty(state){
        let notEmpty = [];  //indexes of empty cavities

        const nCavs = this.cavities.length / 2;

        if(state == gameState.TURN_PLAYER1){
            for(let i = 0; i < nCavs; i++){
                if(this.cavities[i] != 0){
                    notEmpty.push(i);
                }
            }
        }
        else if(state == gameState.TURN_PLAYER2){
            for(let i = nCavs; i < nCavs * 2; i++){
                if(this.cavities[i] != 0){
                    notEmpty.push(i);
                }
            }
        }
        return notEmpty;
    }

    getBestPlay(depth){
        //build the commands tree
        let tree = new TreeNode(-1);

        createTree(this, gameState.TURN_PLAYER2, tree, depth);  //assuming the computer will be always the second player

        //apply minimax hover the tree
        const optimalScore = this.minimax(tree, depth, true);

        console.log("OPTIMAL VALUE: ", optimalScore);

        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!PRINTING TREE AFTER MINIMAX!!!!!!!!!!!!!!!!!!!!!!!!");

        //printTree(tree);

        //retrieve the best command based on minimax
        //(loop edges in depth = 1 and retrieve first command that gives the optimal score)
        let bestPlay = null;
        let i = 1;

        tree.edges.forEach(edge => {
            if(edge.destNode.value == optimalScore){
                console.log("I: " + i + " edge.destNode.value " + edge.destNode.value);
                bestPlay = edge.playCommand;
                i++;
            }
        });
        return bestPlay;
    }

    minimax(tree, depth, maximizingPlayer){
        if(depth == 0 || tree.value != -1) return tree.value;  //if value is different than -1, the game has ended

        if(maximizingPlayer){
            let maxEval = -Infinity

            if(tree.edges == undefined) return -1;

            tree.edges.forEach(edge => {
                let val = this.minimax(edge.destNode, depth - 1, false);
                maxEval = Math.max(maxEval, val);
            });
            tree.setValue(maxEval);

            return maxEval;
        }
        else{
            let minEval = Infinity

            if(tree.edges == undefined) return -1;

            tree.edges.forEach(edge => {
                let val = this.minimax(edge.destNode, depth - 1, true);
                minEval = Math.min(minEval, val);
            });
            tree.setValue(minEval);

            return minEval;
        }
    }
}

/**
 * Canvas Graphics
 */

//Fireworks
class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(vector){
        this.x += vector.x;
        this.y += vector.y;
    }

    mul(vector){
        this.x *= vector.x;
        this.y *= vector.y;
    }
}

class Particle{
    constructor(x, y, color, thickness){
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acel = new Vector(0, 0);
        this.color = color;
        this.thickness = thickness;
    }

    applyForce(forceVector){
        this.acel.add(forceVector);
    }

    update(){
        this.pos.add(this.vel);
        this.vel.add(this.acel);
        this.acel.mul(new Vector(0, 0));
    }

    show(ctx){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.thickness, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

class Firework{
    constructor(x, y){
        this.thickness = Math.random() * 4 + 2
        this.color = "#" + Math.floor(Math.random()*16777215).toString(16);
        this.initParticle = new Particle(x, y, this.color, this.thickness);
        this.initParticle.vel.y = Math.floor(Math.random() * - 5) - 9;
        this.gravity = new Vector(0, 0.2);
        this.exploded = false;
        this.particles = [];
        this.createParticles();
        this.end = false;
        this.audio = new Audio(this.randAudio());
        this.audioControler = true;
    }

    randAudio(){
        //returns a random integer from 0 to 2 ->  3 available
        const randAudio = Math.ceil(Math.random()*3) - 1;
        return fireworkAudios[randAudio];
    }

    createParticles(){
        for(let i = 0; i < 100; i++){
            this.particles.push(new Particle(0, 0, this.color, this.thickness));
            const phi = 2*Math.PI*Math.random();
            const speed = 3;
            this.particles[i].vel = new Vector(Math.cos(phi) * speed, Math.sin(phi) * speed);
            this.particles[i].vel.mul(new Vector(Math.random(), Math.random()));
        }
    }

    draw(ctx){
        if(this.exploded){
            this.particles.forEach(particle => {
                particle.show(ctx);
            });
        }
        else this.initParticle.show(ctx);
    }

    update(){
        if(this.initParticle.vel.y < 0){
            for(let i = 0; i < 100; i++){
                this.particles[i].pos.x = this.initParticle.pos.x;
                this.particles[i].pos.y = this.initParticle.pos.y;
            }
        }
        if(this.initParticle.vel.y >= 0) this.exploded = true;

        if(this.exploded){
            this.particles.forEach(particle => {
                particle.applyForce(this.gravity);
                particle.update();
            });

            if( this.particles[0].pos.y > 2000){
                console.log("PASSE");
                this.end = true;
            }

            if(this.audioControler){
                this.audio.play();
                this.audioControler = false;
            }
        }
        else{
            this.initParticle.applyForce(this.gravity);
            this.initParticle.update();
        }
    }
}

function createTree(shadowGame, state, root, depth){
    //loop the not empty cavities and create edges from prev node to a new node
    const notEmpty = shadowGame.cavitiesNotEmpty(state);

    if(DEBUGGING){
        console.log("DEPTH: " + depth + " Turn: " + state.toString() + "    notEmpty[]: " + notEmpty);
        console.log("#############################################");
        //debugger;
    }

    for(let i = 0; i < notEmpty.length; i++){
        //execute possible move on shadowGame
        if(i != 0){
            shadowGame.undoCommand();
        }

        if(DEBUGGING) console.log("DEPTH: " + depth + "    i: " + i);

        const cavityRealIndex = notEmpty[i];
        const move = new PlayCommand(shadowGame, state, cavityRealIndex);

        let node = new TreeNode(-1);
        let edge = new TreeEdge(move, node);
        root.addEdge(edge);

        if(DEBUGGING){
            //debugger;
            console.log("i: " + i + " Board BEFORE command in cavityIndex: " + notEmpty[i]);
            shadowGame.printShadowBoard();
        }

        shadowGame.executeCommand(move);

        if(DEBUGGING){
            console.log("I: " + i + " Board AFTER command in cavityIndex: " + notEmpty[i]);
            shadowGame.printShadowBoard();
        }

        //recursively call createTree with each new node created
        if((depth-1) != 0){
            //debugger;
            createTree(shadowGame, switchTurnState(state), node, depth-1);
        }
        else{
            //only set game score on tree terminal values
            node.setValue(shadowGame.getPlayerScore(gameState.TURN_PLAYER2));
        }
        //debugger;
    }
    if(notEmpty.length != 0 ) shadowGame.undoCommand();
    else{
        root.setValue(shadowGame.getPlayerScore(gameState.TURN_PLAYER2));  //CHECK/TEST THIS LINE
    }
    if(DEBUGGING) console.log("=============================================");
}

function switchTurnState(state){
    switch (state) {
        case gameState.TURN_PLAYER1:
            return gameState.TURN_PLAYER2;
        case gameState.TURN_PLAYER2:
            return gameState.TURN_PLAYER1;
        default:
            console.log("Error -> switchTurnState() <- no such state accepted");
            return;
    }
}

function printTree(tree) {
    let i = 1;

    function innerPrint(tree, i) {
        console.log(Array(i).join('■■■■■■■'), tree.value);

        tree.edges.forEach(function(edge) {
            let j = i + 1;
            innerPrint(edge.destNode, j);
        })
    }
    innerPrint(tree, i);
  }

class TreeNode{
    constructor(value){
        this.value = value;
        this.edges = [];
    }

    getValue(){
        return this.value;
    }

    setValue(value){
        this.value = value;
    }

    addEdge(edge){
        this.edges.push(edge);
    }
}

class TreeEdge{
    constructor(playCommand, destNode){
        this.playCommand = playCommand;
        this.destNode = destNode;
    }

    getPlayCommand(){
        return this.playCommand;
    }

    getDestNode(){
        return this.destNode;
    }
}

/**
 * TESTS FOR DEBUGGING
 */
//paste tests here

class FireworksScene{
    constructor(canvasId, width, height){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.animFrame = undefined;
        this.fireworks = [];
        this.width = width;
        this.height = height;
    }

    drawFireworks(){
        if(Math.random() < 0.05){
            //this.fireworks.push(new Firework(Math.random() * this.width, this.height - (0.1 * this.hegiht) - ((0.1 * this.hegiht) * Math.random())));
            this.fireworks.push(new Firework(Math.random() * this.width, this.height - (this.height * 0.1)));
        }
        for(let i = 0; i < this.fireworks.length; i++){
            this.fireworks[i].draw(this.ctx);
            this.fireworks[i].update();
        }
        for(let i = 0; i < this.fireworks.length; i++){
            if(this.fireworks[i].end) this.fireworks.shift();
        }
    }

    animationLoop(){
        this.animFrame = requestAnimationFrame(this.animationLoop.bind(this));

        this.ctx.clearRect(0, 0, this.width, this.height);
        /*
        this.ctx.globalCompositeOperation = 'source-over';
        //decrease the alpha property to create more prominent trails
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        this.ctx.fillRect( 0, 0, this.width, this.height);
         */
        this.ctx.globalCompositeOperation = 'lighter';
        this.drawFireworks(this.ctx);
    }

    start(){
        console.log("STARTING FIREWORKS");
        this.animationLoop();
    }

    stop(){
        console.log("STOPING FIREWORKS");
        for(let i = 0; i < this.fireworks.length; i++){
            this.fireworks[i].audio.pause();
        }
        this.fireworks = [];
        this.ctx.clearRect(0, 0, this.width, this.height);
        cancelAnimationFrame(this.animFrame);
    }
}

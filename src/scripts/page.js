class Page{
    constructor(){
        //Navbar icons
        this.chat = document.getElementById("img-header-navbar-chat-icon");
        this.rules = document.getElementById("img-header-navbar-rules-icon");
        this.score = document.getElementById("img-header-navbar-score-icon");
        this.isSectionOpen = [false, false, false, true, false];  //[chat | rules | score | menu | chat(if user is logged)]

        //Responsive Menu for mobile size
        this.menu = document.getElementById("img-header-navbar-menu-icon");
        this.dMain = document.getElementById("d-main");

        //Sections for menu display
        this.authSection = document.getElementById("section-main-authentication");
        this.gameSection = document.getElementById("section-main-game");
        this.commandsSection = document.getElementById("section-main-commands");
        this.configsSection = document.getElementById("section-main-configurations");
        this.chatSection = document.getElementById("section-main-chat");
        this.rulesSection = document.getElementById("section-main-rules");
        this.scoreSection = document.getElementById("section-main-score");

        this.sections = [
            this.gameSection,
            this.authSection,
            this.configsSection,
            this.chatSection,
            this.rulesSection,
            this.scoreSection,
            this.commandsSection
                        ];

        console.log(this.sections);

        this.menuButtons = document.getElementsByClassName("p-menu");

        //Responsive selection for tablet size
        this.tabletSelection = document.getElementById("sel-header-menu");

        //Authentication
        this.signUp = document.getElementById("h3-login-titles-signup--in"); //in section sign in change to signUn
        this.signIn = document.getElementById("h3-login-titles-signin--up"); //in section sign up change to signIn
        this.recoverPass =document.getElementById("a-login-forgotpass");
        this.goBackPass = document.getElementById("a-forgot-goback");

        //Update Game names based on Mode in configurations
        this.modeLocal = document.getElementById("input-settings-info--local");
        this.modeOnline = document.getElementById("input-settings-info--online");
        this.modeComputer = document.getElementById("input-settings-info--computer");
        this.p2Icon = document.getElementById("img-game-area-header-p2-country");
        this.p2Name = document.getElementById("p-game-area-header-p2-name");

        //Change Modes in configurations
        this.local = document.getElementById("d-settings-mode--local");
        this.online = document.getElementById("d-settings-mode--online");
        this.computer = document.getElementById("d-settings-mode--computer");
    }

    /**
     * Listeners
     */

    //Navigation bar sections
    listenChat(){
        this.chat.addEventListener("click", this.toggleChat.bind(this));
    }

    listenRules(){
        this.rules.addEventListener("click", this.toggleRules.bind(this));
    }

    listenScore(){
        this.score.addEventListener("click", this.toggleScore.bind(this));
    }

    //Authentication section
    listenSignUp(){
        this.signUp.addEventListener("click", this.toggleSignUp.bind(this));
    }

    listenSigIn(){
        this.signIn.addEventListener("click", this.toggleSignIn.bind(this));
    }

    listenRecoverPass(){
        this.recoverPass.addEventListener("click", this.toggleRecoverPass.bind(this));
    }

    listenGoBackPass(){
        this.goBackPass.addEventListener("click", this.toggleGoBackPass.bind(this));
    }

    listenChangingModes(){
        this.modeLocal.addEventListener("click", this.displayModeLocal.bind(this));
        this.modeOnline.addEventListener("click", this.displayModeOnline.bind(this));
        this.modeComputer.addEventListener("click", this.displayModeComputer.bind(this));
    }

    listenMobileMenu(){
        this.menu.addEventListener("click", this.toggleMenu.bind(this));
    }

    listenMobileMenuButtons(){
        for(let i = 0; i < this.menuButtons.length; i++){
            this.menuButtons[i].addEventListener("click", this.displaySections.bind(this, i));
        }
    }

    listenTabletSelection(){
        this.tabletSelection.addEventListener("click", this.toggleTabletSelection.bind(this));
    }

    //Calls all listeners
    listenAll(){
        this.listenChat();
        this.listenRules();
        this.listenScore();
        this.listenSignUp();
        this.listenSigIn();
        this.listenRecoverPass();
        this.listenGoBackPass();
        this.listenChangingModes();
        this.listenMobileMenu();
        this.listenMobileMenuButtons();
        this.listenTabletSelection();
    }

    /**
     * Togglers (listener's handlers)
     */

    //Toggler prototype functions
    toggleVisibility(isOpen, primaryId, secondaryId, display1, display2) {
        var primaryElement = document.getElementById(primaryId);
        var secundayElement = document.getElementById(secondaryId);

        if(isOpen) {
            primaryElement.classList.add("hidden");
            secundayElement.classList.remove("hidden");

        }
        else {
            primaryElement.classList.remove("hidden");
            secundayElement.classList.add("hidden");

        }
    }

    toggleIcon(index, imageElement, icon1, icon2) {
        if(this.isSectionOpen[index]) {
            imageElement.src = icon1;
            this.isSectionOpen[index] = false;
        }
        else{
            imageElement.src = icon2;
            this.isSectionOpen[index] = true;
        }
    }

    toggleChat(){
        if(document.getElementById("d-userTab-info--username").innerHTML == "Username"){
            this.toggleIcon(0, this.chat, "../res/icons/chat_icon.png", "../res/icons/chat_icon_active.png");
            this.toggleVisibility(this.isSectionOpen[0], "section-main-authentication", "section-main-chat");
            this.toggleSignIn();  //this two lines prevents from having multiple sections open in Authentication area
            this.toggleGoBackPass();
        }
        else{
            this.toggleIcon(4, this.chat, "../res/icons/chat_icon.png", "../res/icons/chat_icon_active.png");
            this.toggleVisibility(this.isSectionOpen[4], "d-authentication-userTab", "section-main-chat");
        }
    }

    toggleRules() {
        this.toggleIcon(1, this.rules, "../res/icons/rules_icon.png", "../res/icons/rules_icon_active.png");
        this.toggleVisibility(this.isSectionOpen[1], "section-main-game", "section-main-rules");
    }

    toggleScore() {
        this.toggleIcon(2, this.score, "../res/icons/score_icon.png", "../res/icons/score_icon_active.png");
        this.toggleVisibility(this.isSectionOpen[2], "section-main-configurations", "section-main-score");
    }

    toggleSignUp(){
        this.toggleVisibility(true, "form-authentication-login", "form-authentication-signup");
        document.getElementById("section-main-commands").classList.add("hidden");
    }

    toggleSignIn(){
        this.toggleVisibility(false, "form-authentication-login", "form-authentication-signup");
        document.getElementById("section-main-commands").classList.remove("hidden");
    }

    toggleRecoverPass(){
        this.toggleVisibility(true, "form-authentication-login", "form-authentication-forgot");
    }

    toggleGoBackPass(){
        this.toggleVisibility(false, "form-authentication-login", "form-authentication-forgot");
    }

    toggleMenu(){
        this.toggleVisibility(this.isSectionOpen[3], "mobile-main-turn-off", "s-menu");
        this.isSectionOpen[3] = !(this.isSectionOpen[3]);
    }

    toggleTabletSelection(){
        switch(this.tabletSelection.value){
            case "Game":
                this.gameSection.classList.remove("hidden");
                this.rulesSection.classList.add("hidden");
                this.scoreSection.classList.add("hidden");
                this.configsSection.classList.add("hidden");
                break;
            case "Configurations":
                this.gameSection.classList.add("hidden");
                this.rulesSection.classList.add("hidden");
                this.scoreSection.classList.add("hidden");
                this.configsSection.classList.remove("hidden");
                break;
            case "Leaderboard":
                this.gameSection.classList.add("hidden");
                this.rulesSection.classList.add("hidden");
                this.scoreSection.classList.remove("hidden");
                this.configsSection.classList.add("hidden");
                break;
            case "Rules":
                this.gameSection.classList.add("hidden");
                this.rulesSection.classList.remove("hidden");
                this.scoreSection.classList.add("hidden");
                this.configsSection.classList.add("hidden");
                break;
            default:
                console.log("Error -> toggleTabletSelection() <- no such value in selection");
        }
    }

    displayModeLocal(){
        this.p2Icon.src = "../res/default_players_icons/local.png";
        this.p2Name.innerHTML = "Local";

        this.local.classList.remove("hidden");
        this.online.classList.add("hidden");
        this.computer.classList.add("hidden");
    }

    displayModeOnline(){
        this.p2Icon.src = "../res/default_players_icons/online.png";
        this.p2Name.innerHTML = "Online";

        this.local.classList.add("hidden");
        this.online.classList.remove("hidden");
        this.computer.classList.add("hidden");
    }

    displayModeComputer(){
        this.p2Icon.src = "../res/default_players_icons/computer.png";
        this.p2Name.innerHTML = "Computer";

        this.local.classList.add("hidden");
        this.online.classList.add("hidden");
        this.computer.classList.remove("hidden");
    }

    displaySections(index){
        for(let i = 0; i < this.sections.length; i++){
            this.sections[i].classList.add("hidden");
        }
        this.sections[index].classList.remove("hidden");

        if(index == 0){
            this.sections[6].classList.remove("hidden");
        }

        this.toggleMenu();
    }

    hideAll(){
        for(let i = 0; i < this.sections.length; i++){
            this.sections[i].classList.add("hidden");
        }
    }

    loadingScreen(){
        document.getElementById("d-game-area-load-banner").style.display = "grid";
        document.getElementById("d-game-area-background").style.display = "none";
        document.getElementById("d-game-area-gameplay").style.display = "none";

        setTimeout(function(){
            document.getElementById("d-game-area-load-banner").style.display = "none";
            document.getElementById("d-game-area-background").style.display = "grid";
            document.getElementById("d-game-area-gameplay").style.display = "grid";
            },2000);
    }

    jsMediaQueries(){
        //mobile
        if(window.matchMedia('(max-width: 850px)').matches) {
            this.hideAll();
            this.gameSection.classList.remove('hidden');
            this.commandsSection.classList.remove('hidden');
        }
        //tablet
        if(window.matchMedia('(max-width: 1200px)').matches) {
            this.hideAll();
            this.gameSection.classList.remove('hidden');
            this.commandsSection.classList.remove('hidden');
            this.authSection.classList.remove('hidden');
        }
        //pc (greater than 1200px)
        else{
            this.hideAll();
            this.gameSection.classList.remove('hidden');
            this.commandsSection.classList.remove('hidden');
            this.authSection.classList.remove('hidden');
            this.configsSection.classList.remove('hidden');
        }
    }
}

const page = new Page();
page.listenAll();
//page.loadingScreen();
//page.jsMediaQueries();

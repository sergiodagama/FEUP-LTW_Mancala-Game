class Page{
    constructor(){
        this.chat = document.getElementById("img-header-navbar-chat-icon");
        this.rules = document.getElementById("img-header-navbar-rules-icon");
        this.score = document.getElementById("img-header-navbar-score-icon");
        this.isSectionOpen = [false, false, false];  //[chat | rules | score]

        this.signUp = document.getElementById("h3-login-titles-signup--in"); //in section sign in change to signUn
        this.signIn = document.getElementById("h3-login-titles-signin--up"); //in section sign up change to signIn
        this.recoverPass =document.getElementById("a-login-forgotpass");
        this.goBackPass = document.getElementById("a-forgot-goback");
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

    //Calls all listeners
    listenAll(){
        this.listenChat();
        this.listenRules();
        this.listenScore();
        this.listenSignUp();
        this.listenSigIn();
        this.listenRecoverPass();
        this.listenGoBackPass();
    }

    /**
     * Togglers (listener's handlers)
     */

    //Toggler prototype functions
    toggleVisibility(isOpen, primaryId, secondaryId, display1, display2) {
        var primaryElement = document.getElementById(primaryId);
        var secundayElement = document.getElementById(secondaryId);

        if(isOpen) {
            primaryElement.style.display = "none";
            secundayElement.style.display = display2;
        }
        else {
            primaryElement.style.display = display1;
            secundayElement.style.display = "none";
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
        this.toggleIcon(0, this.chat, "../res/icons/chat_icon.png", "../res/icons/chat_icon_active.png");
        this.toggleVisibility(this.isSectionOpen[0], "section-main-authentication", "section-main-chat", "block", "block");
        this.toggleSignIn();  //this two lines prevents from having multiple sections open in Authentication area
        this.toggleGoBackPass();
    }

    toggleRules() {
        this.toggleIcon(1, this.rules, "../res/icons/rules_icon.png", "../res/icons/rules_icon_active.png");
        this.toggleVisibility(this.isSectionOpen[1], "section-main-game", "section-main-rules", "block", "block");
    }

    toggleScore() {
        this.toggleIcon(2, this.score, "../res/icons/score_icon.png", "../res/icons/score_icon_active.png");
        this.toggleVisibility(this.isSectionOpen[2], "section-main-configurations", "section-main-score", "block", "block");
    }

    toggleSignUp(){
        this.toggleVisibility(true, "form-authentication-login", "form-authentication-signup", "block", "block");
        document.getElementById("section-main-commands").style.display = "none";
    }

    toggleSignIn(){
        this.toggleVisibility(false, "form-authentication-login", "form-authentication-signup", "block", "block");
        document.getElementById("section-main-commands").style.display = "flex";
    }

    toggleRecoverPass(){
        this.toggleVisibility(true, "form-authentication-login", "form-authentication-forgot", "block","block");
    }

    toggleGoBackPass(){
        this.toggleVisibility(false, "form-authentication-login", "form-authentication-forgot", "block","block");
    }
}

const page = new Page();
page.listenAll();
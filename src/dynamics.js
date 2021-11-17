//main section, chat, rules and score dynamics

var c = document.getElementById("img-header-navbar-chat-icon");
c.addEventListener("click", chat);
				  
var r = document.getElementById("img-header-navbar-rules-icon");
r.addEventListener("click", rules);
				  
var s = document.getElementById("img-header-navbar-score-icon");
s.addEventListener("click", score);

var flag = [false, false, false];

function toggleIcon(i, image_element, icon1, icon2) {
	if(flag[i]){ 
		image_element.src = icon1;
		flag[i] = false;
	}
	else{ 
		image_element.src = icon2;
		flag[i] = true;
	}
}

function toggleVisibility(flag, primary, secondary, display1, display2){
  var p = document.getElementById(primary);
  var s = document.getElementById(secondary);

  if (flag) {
    p.style.display = "none";
    s.style.display = display2;
  } else {
    p.style.display = display1;
    s.style.display = "none";
  }
}

function chat(){
  toggleIcon(0, c, "../res/chat_icon.png", "../res/chat_icon_active.png");
  toggleVisibility(flag[0], "section-main-authentication", "section-main-chat", "block", "block");
  signIn();
}
				  
function rules() {
  toggleIcon(1, r, "../res/rules_icon.png", "../res/rules_icon_active.png");
  toggleVisibility(flag[1], "section-main-game", "section-main-rules", "block", "block");
}

function score() {
  toggleIcon(2, s, "../res/score_icon.png", "../res/score_icon_active.png");
  toggleVisibility(flag[2], "section-main-configurations", "section-main-score", "block", "block");
}

//signin and signup section

var sign_up = document.getElementById("h3-login-titles-signup--in");
sign_up.addEventListener("click", signUp);

var sign_in = document.getElementById("h3-login-titles-signin--up");
sign_in.addEventListener("click", signIn);

function signUp(){
  toggleVisibility(true, "form-authentication-login", "form-authentication-signup", "block", "block");
  document.getElementById("section-main-commands").style.display = "none";
}

function signIn(){
  toggleVisibility(false, "form-authentication-login", "form-authentication-signup", "block", "block");
  document.getElementById("section-main-commands").style.display = "flex";
}

//radio buttons configs section
var modes = document.getElementsByClassName("radio-settings-info--mode");

modes[0].addEventListener("click", localConfigs);
modes[1].addEventListener("click", onlineConfigs);
modes[2].addEventListener("click", computerConfigs);

function localConfigs(){
  document.getElementById("d-settings-mode--local").style.display = "block";
  document.getElementById("d-settings-mode--online").style.display = "none";
  document.getElementById("d-settings-mode--computer").style.display = "none";
}

function onlineConfigs(){
  document.getElementById("d-settings-mode--local").style.display = "none";
  document.getElementById("d-settings-mode--online").style.display = "block";
  document.getElementById("d-settings-mode--computer").style.display = "none";
}

function computerConfigs(){
  document.getElementById("d-settings-mode--local").style.display = "none";
  document.getElementById("d-settings-mode--online").style.display = "none";
  document.getElementById("d-settings-mode--computer").style.display = "block";
}

//loading screen /*UNCOMMENT*/
document.getElementById("d-game-area-gameplay").style.display = "grid";  /* COMMENT HERE */
/*
setTimeout(function(){
  document.getElementById("d-load-game-area").style.display = "none";
  document.getElementById("d-game-area-gameplay-top").style.display = "grid";
  document.getElementById("d-game-area-gameplay").style.display = "grid";
},2900);
*/


//connect cavities number in configs to html
var configs = document.getElementById("button-settings-info--config");
configs.addEventListener("click", cavitiesConfig);

function cavitiesConfig(){
  var cavities = document.getElementsByClassName("d-area-cavity");
  var cavitiesTop = document.getElementsByClassName("d-area-cavity--top");

  var seeds = document.getElementsByClassName("img-seed");

  while(seeds[0]){
    seeds[0].remove();
  }

  while(cavities[0]){
    cavities[0].remove();
    cavitiesTop[0].remove();
  }

  var quantities = document.getElementsByClassName("input-settings-info--quantities");

  for(i = 0; i < quantities[0].value; i++){
    var cavitie = document.createElement("div");
    cavitie.classList.add("d-area-cavity");
    document.getElementById("d-area-cavity--p1").appendChild(cavitie);

    var cavitie2 = document.createElement("div");
    cavitie2.classList.add("d-area-cavity");
    document.getElementById("d-area-cavity--p2").appendChild(cavitie2);

    //Top layer
    var cavitieTop = document.createElement("div");
    cavitieTop.classList.add("d-area-cavity--top");
    document.getElementById("d-area-cavity--p1--top").appendChild(cavitieTop);

    var cavitieTop2 = document.createElement("div");
    cavitieTop2.classList.add("d-area-cavity--top");
    document.getElementById("d-area-cavity--p2--top").appendChild(cavitieTop2);
  }

  seedsConfig();
}

//connect seeds number with configs

function seedsConfig(){
  var quantities = document.getElementsByClassName("input-settings-info--quantities");
  var cavs = document.getElementsByClassName("d-area-cavity--top");


  for(i = 0; i < quantities[0].value * 2;i++){
    for(j = 0; j < quantities[1].value; j++){
      var seed = document.createElement("img");
      seed.classList.add("img-seed");
      seed.src = "../res/seeds/seed.png";
      cavs[i].appendChild(seed);
    }
  }
}


//reset configs

var resetElement = document.getElementById("button-settings-info--reset");
resetElement.addEventListener("click", reset);

function reset(){
  var quantities = document.getElementsByClassName("input-settings-info--quantities");

  quantities[0].value = 6;
  quantities[1].value = 5;

  cavitiesConfig();
}


/*
class Cavity {
  constructor() {}
}

class Storage{
  constructor() {}
}

class Seed{
  constructor() {}
}

class Player{
  constructor() {}
}

class Guest extends Player{
}

class Auth extends Player{
}

*/
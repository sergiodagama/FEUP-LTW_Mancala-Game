var c = document.getElementById("img-navbar--chat");
c.addEventListener("click", chat);
				  
var r = document.getElementById("img-navbar--rules");
r.addEventListener("click", rules);
				  
var s = document.getElementById("img-navbar--score");
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

setTimeout(function(){
  document.getElementById("d-load-game-area").style.display = "none";
  document.getElementById("d-game-area-gameplay").style.display = "grid";
},2900);

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
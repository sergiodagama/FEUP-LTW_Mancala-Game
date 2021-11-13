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
}
				  
function rules() {
  toggleIcon(1, r, "../res/rules_icon.png", "../res/rules_icon_active.png");
  toggleVisibility(flag[1], "section-main-game", "section-main-rules", "block", "block");

}

function score() {
  toggleIcon(2, s, "../res/score_icon.png", "../res/score_icon_active.png");
  toggleVisibility(flag[2], "section-main-configurations", "section-main-score", "block", "block");
}

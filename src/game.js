ctx = document.querySelector("canvas").getContext("2d");
ctx.canvas.height = height;
ctx.canvas.width = width;

loop = function() {
    //Game dynamics here
window.requestAnimationFrame(loop);
};

window.addEventListener("click", getCoords);
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

window.requestAnimationFrame(loop);
const robot = require("robotjs");

// Function to jiggle the mouse
function jiggleMouse() {
  const mousePos = robot.getMousePos();
  const newX =
    mousePos.x +
    (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10);
  const newY =
    mousePos.y +
    (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10);
  robot.moveMouse(newX, newY);
}

// Set the interval for how often the mouse should jiggle (in milliseconds)
const interval = 10000; // 10 seconds

// Start jiggling the mouse
setInterval(jiggleMouse, interval);

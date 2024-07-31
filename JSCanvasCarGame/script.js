const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Car Image
const carImage = new Image();
carImage.src = "car.png"; // Replace with your car image path

let car = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 50,
  height: 80,
  speed: 20, // Initial speed in km/h
};

// Obstacles (Other Vehicles)
let obstacles = [];
let obstacleSpeed = 5; // Initial obstacle speed

// Velocity Display
let velocityDisplay = document.getElementById("velocity");
velocityDisplay.textContent = `Velocity: ${car.speed} km/h`;

// Event Listeners
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      car.x -= 30;
      break;
    case "ArrowRight":
      car.x += 30;
      break;
    case "ArrowUp":
      car.speed = Math.min(car.speed + 5, 100); // Increase speed up to 100 km/h
      velocityDisplay.textContent = `Velocity: ${car.speed} km/h`;
      break;
  }
});

// Game Loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move the car
  // (No vertical movement for the player's car in this version)

  // Keep car within canvas bounds
  car.x = Math.max(0, Math.min(car.x, canvas.width - car.width));

  // Draw the car
  ctx.drawImage(carImage, car.x, car.y, car.width, car.height);

  // Create new obstacles
  if (Math.random() < 0.01) {
    // Adjust probability to control obstacle frequency
    obstacles.push({
      x: Math.random() * (canvas.width - 30),
      y: -50, // Start offscreen
      width: 30,
      height: 60,
    });
  }

  // Move and draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y += obstacleSpeed;
    ctx.fillRect(
      obstacles[i].x,
      obstacles[i].y,
      obstacles[i].width,
      obstacles[i].height
    );

    // Check for collision
    if (rectIntersect(car, obstacles[i])) {
      alert("Game Over!");
      resetGame(); // Reset the game after collision
      return; // Stop the game loop
    }

    // Remove obstacles that go offscreen
    if (obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1);
      i--;
    }
  }

  // Request the next frame for animation
  requestAnimationFrame(gameLoop);
}

// Collision Detection Function
function rectIntersect(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Game Reset Function
function resetGame() {
  car.x = canvas.width / 2;
  car.speed = 20;
  obstacles = [];
  velocityDisplay.textContent = `Velocity: ${car.speed} km/h`;
}

// Start the game loop
carImage.onload = () => {
  console.log("loaded");
  gameLoop();
};

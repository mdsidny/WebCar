// Set up the canvas element and append it to the game-screen div
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');
document.getElementById('game-screen').appendChild(canvas);

// Set up car properties
const carWidth = 75;
const carHeight = 150;
const carImage = new Image();
carImage.src = 'CarAi3.jpg';

let carX = (canvas.width - carWidth) / 2;
let carY = canvas.height - carHeight - 9;
let carSpeed = 14; // Increased car speed
let points = 10;
let rectangles = [];

// Rectangle class to create obstacles
class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hit = false;
    }

    // Update function to move the rectangle downward
    update() {
        this.y += 7;
        if (this.y > canvas.height) {
            if (this.hit) {
                points -= 1;
                this.hit = false;
            }
            this.y = -this.height;
            this.x = Math.random() * (canvas.width - this.width);
        }
    }

    // Draw the rectangle on the canvas
    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Function to check if the car collided with a rectangle
function checkCollision(rect, carX, carY, carWidth, carHeight) {
    return (
        rect.x < carX + carWidth &&
        rect.x + rect.width > carX &&
        rect.y < carY + carHeight &&
        rect.y + rect.height > carY
    );
}

// Function to draw the car
function drawCar() {
    ctx.drawImage(carImage, carX, carY, carWidth, carHeight);
}

// Function to display the current points
function drawPoints() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText(`Points: ${points}`, 10, 30);
}

// Function to draw the game borders
function drawBorders() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

let isPaused = false;
let rafId; // To store the requestAnimationFrame ID

// Function to pause the game
function pauseGame() {
    isPaused = true;
    cancelAnimationFrame(rafId);
}

// Function to resume the game
function resumeGame() {
    isPaused = false;
    updateGame();
}

// Function to restart the game
function restartGame() {
    document.location.reload();
}

// Function to end the game and redirect to the game intro page
function endGame() {
    alert("Thank you for playing!");
    window.location.href = "index.html";
}

// Add event listeners for the pause, restart, and end game buttons
document.getElementById('pause-game').addEventListener('click', function () {
    if (isPaused) {
        resumeGame();
        this.textContent = "Pause";
    } else {
        pauseGame();
        this.textContent = "Resume";
    }
});

document.getElementById('restart-game').addEventListener('click', restartGame);
document.getElementById('end-game').addEventListener('click', endGame);

document.getElementById('multiplayer').addEventListener('click', function () {
    window.location.href = "multiplayer.html"; // Redirect to the multiplayer page
});

document.getElementById('start-game-button').addEventListener('click', function () {
    window.location.href = "game.html"; // Redirect to the game page
});


// Main game loop function
function updateGame() {
    if (isPaused) {
        return;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw each rectangle
    for (const rect of rectangles) {
        rect.update();
        rect.draw();
        if (checkCollision(rect, carX, carY, carWidth, carHeight)) {
            rect.hit = true;
        }
    }

    // Draw the car, points, and borders
    drawCar();
    drawPoints();
    drawBorders();

    // Check for game over condition
    if (points <= 0) {
        alert('You Crashed');
        document.location.reload();
    }

    rafId = requestAnimationFrame(updateGame);
}

// Function to start the game
function startGame() {
    rectangles.push(new Rectangle(Math.random() * (canvas.width - 100), -100, 100, 100));
    updateGame();
}
// Event listener for arrow keys to move the car
document.addEventListener('keydown', (event) => {
    if (!isPaused) {
        switch (event.key) {
            case 'ArrowLeft':
                carX -= carSpeed;
                break;
            case 'ArrowRight':
                carX += carSpeed;
                break;
        }
    }
});

// Start the game automatically when the page loads
window.onload = startGame;

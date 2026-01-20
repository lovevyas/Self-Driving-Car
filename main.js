const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// Global Variables
const N = 1;
let cars = [];
let bestCar;
let traffic = [];
let gameStarted = false;
let currentMode = "BACKGROUND";
 // Points for passing cars
let highScore = localStorage.getItem("bestScore") || 0;
let startY = 100; // The starting Y position of the car
let score =0;
let currentDistance = 0;
let highDistance = localStorage.getItem("bestDistance") || 0;
const trafficBlueprint = [
    { lane: 1, y: -100 },
    { lane: 0, y: -300 },
    { lane: 2, y: -300 },
    { lane: 0, y: -500 },
    { lane: 1, y: -500 },
    { lane: 1, y: -700 },
    { lane: 2, y: -700 },
];

// --- INITIALIZATION ---
function init(mode = "BACKGROUND") {
    currentMode = mode;
    traffic = [];
    spawnTrafficAt(-100);

    if (mode === "BACKGROUND") {
        // Just one dummy AI that can't die
        cars = [new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3)];
        bestCar = cars[0];
        bestCar.brain = defaultBrain;
        
        return; // Stop here
    }
    if (mode === "KEYS") {
        cars = [new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS", 3)];
        bestCar = cars[0];
        
    }

    if (mode === "AUTO") {
        cars = [new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3)];
        bestCar = cars[0];
        
        // Load brain directly without mutation
        if (localStorage.getItem("bestBrain")) {
            bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
        } else if (typeof defaultBrain !== "undefined") {
            bestCar.brain = defaultBrain;
        }
    }


    if (mode === "AI_TRAINER") {
        cars = generateCars(100);
        bestCar = cars[0];
        
        if (localStorage.getItem("bestBrain")) {
            for (let i = 0; i < cars.length; i++) {
                cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
                if (i != 0) {
                    NeuralNetwork.mutate(cars[i].brain, 0.1);
                }
            }
        } else if (typeof defaultBrain !== "undefined") {
            for (let i = 0; i < cars.length; i++) {
                cars[i].brain = JSON.parse(JSON.stringify(defaultBrain));
                if (i != 0) {
                    NeuralNetwork.mutate(cars[i].brain, 0.1);
                }
            }
        }
    }
}

// Start immediately (background mode)
init("BACKGROUND");
animate();

// --- GAME LOOP ---

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    if (bestCar.damaged && typeof currentMode !== 'undefined' && currentMode === "KEYS") {
        const popup = document.getElementById("restartPopup");
        if(popup) popup.style.display = "block";
        
        const controls = document.getElementById("mobileControls");
        if(controls) controls.style.display = "none"; 
    }  
    bestCar = cars.find(
        c => c.y == Math.min(...cars.map(c => c.y))
    );

    const mostDistantTraffic = Math.min(...traffic.map(t => t.y));
    if (bestCar.y < mostDistantTraffic + 900) {        
        spawnTrafficAt(mostDistantTraffic - 300);
    }
    traffic = traffic.filter(c => c.y < bestCar.y + 1000);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);    
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }
    
    if (gameStarted) {
        
        carCtx.globalAlpha = 0.2;
        for (let i = 0; i < cars.length; i++) {
            cars[i].draw(carCtx);
        }
        carCtx.globalAlpha = 1;
        bestCar.draw(carCtx, true);
    }
    
    carCtx.restore();

    if (gameStarted) {
        // 1. DISTANCE LOGIC
        currentDistance = Math.floor(Math.max(0, startY - bestCar.y) / 30);
        
        // Check High Distance
        if (currentDistance > highDistance) {
            highDistance = currentDistance;
            localStorage.setItem("bestDistance", highDistance);
        }

        // 2. POINTS LOGIC (Passing Cars)
        for (let i = 0; i < traffic.length; i++) {
            const t = traffic[i];
            if (bestCar.y < t.y && !t.passed) {
                score += 5;
                t.passed = true;
            }
        }

        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("bestScore", highScore);
        }
    }
    
    
    // Update High Score if beaten
    
    carCtx.shadowColor = "black";
    carCtx.shadowBlur = 0;
    // --- 1. LEFT PANEL: POINTS (Next to Gear Icon) ---
    // Assuming Gear is at x=15, width~50. We start at x=80.
    drawPanel(0, 20, 100, 75, "POINTS", score, "BEST", highScore, "left");

    // --- 2. RIGHT PANEL: DISTANCE (Top Right) ---
    // Canvas Width - Box Width - Padding
    drawPanel(carCanvas.width - 100, 20, 100, 75, "DISTANCE", currentDistance + "m", "BEST", highDistance + "m", "right");

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    
    requestAnimationFrame(animate);
}

// --- HELPER FUNCTIONS ---

function spawnTrafficAt(yPosition) {
    for (let i = 0; i < trafficBlueprint.length; i++) {
        const t = trafficBlueprint[i];
        traffic.push(new Car(
            road.getLaneCenter(t.lane),
            yPosition + t.y + 100,
            30,
            50,
            "DUMMY",
            2, 
            getRandomColor()
        ));
    }
}

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
    alert("Brain saved!");
}

function discard() {
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("bestDistance");
    localStorage.removeItem("bestScore");
    highDistance=0;
    highScore =0;
    alert("Brain discarded!");
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3));
    }
    return cars;
}

function toggleOptions() {
    const sidebar = document.getElementById("sideBar");
    sidebar.classList.toggle("active");
}
function drawPanel(x, y, width, height, title, value, subLabel, subValue, align) {
        carCtx.save();
        
        // Background Box
        carCtx.fillStyle = "rgba(10, 10, 10, 0.7)"; // Darker, more premium
        carCtx.beginPath();
        if (carCtx.roundRect) {
            carCtx.roundRect(x, y, width, height, 10);
        } else {
            carCtx.rect(x, y, width, height); // Fallback for old browsers
        }
        carCtx.fill();
        
        // Border (Subtle)
        carCtx.lineWidth = 1;
        carCtx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        carCtx.stroke();

        carCtx.textAlign = align;
        const textX = align === "left" ? x + 15 : x + width - 15;

        // Title (Small Grey)
        carCtx.fillStyle = "#aaa"; 
        carCtx.font = "bold 10px 'Segoe UI', Arial";
        carCtx.fillText(title, textX, y + 20);

        // Main Value (Big White)
        carCtx.fillStyle = "#fff"; 
        carCtx.font = "bold 22px 'Segoe UI', Arial";
        carCtx.fillText(value, textX, y + 45);

        // Sub Value (Colored Accent)
        carCtx.fillStyle = title.includes("DIST") ? "#3498db" : "#e74c3c"; // Blue for Dist, Red for Pts
        carCtx.font = "bold 10px 'Segoe UI', Arial";
        carCtx.fillText(subLabel + ": " + subValue, textX, y + 62);

        carCtx.restore();
    }

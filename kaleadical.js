// kaleadical.js

// Define the initial set of tasks, each with a unique shape and color
let tasks = [
    { name: "Exercise", shape: "hexagon", color: "#FF6F61" },    // Coral pink
    { name: "Read", shape: "triangle", color: "#6B5B95" },       // Rich lavender
    { name: "Meditate", shape: "square", color: "#88B04B" },     // Soft green
    { name: "Hydrate", shape: "pentagon", color: "#FFD700" },    // Bright yellow
    { name: "Sleep", shape: "octagon", color: "#FFB347" },       // Soft orange
    { name: "Stretch", shape: "diamond", color: "#6EC6FF" },     // Sky blue
    { name: "Journal", shape: "parallelogram", color: "#C70039" }, // Red
    { name: "Yoga", shape: "star", color: "#9B59B6" },           // Purple
    { name: "Cook", shape: "trapezoid", color: "#2ECC71" },      // Green
    { name: "Walk", shape: "cross", color: "#FF5733" },          // Bright red-orange
];

let placedShapes = []; // Store placed shapes in tessellation
let taskLayers = {}; // Track each task's progress and dedicated layer
let continuousMode = false; // Track whether continuous mode for adding shapes is enabled
let globalNextLayer = 0; // Global tracker for the next available layer

// Canvas center and shape size
let centerX, centerY;
let shapeRadius = 15; // Reduced size for smaller shapes

// p5.js setup function
function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent("canvas-container");
    centerX = width / 2;
    centerY = height / 2;
    frameRate(30); // Set frame rate to a slower 30 FPS
    drawTessellation(); // Initial drawing

    // Attach event listeners for control buttons and input fields
    document.getElementById('addShapeButton').addEventListener('click', addRandomTask);
    document.getElementById('continuousMode').addEventListener('change', (event) => {
        continuousMode = event.target.checked;
        console.log(`Continuous mode: ${continuousMode ? "Enabled" : "Disabled"}`);
    });

    document.getElementById('setFpsButton').addEventListener('click', () => {
        const fps = parseInt(document.getElementById('fpsInput').value);
        if (fps >= 1 && fps <= 60) { // Limit FPS between 1 and 60 for slower animations
            frameRate(fps);
            console.log(`FPS set to ${fps}`);
        } else {
            alert("FPS value must be between 1 and 60");
        }
    });

    // Adding and removing task types
    document.getElementById('addTaskTypeButton').addEventListener('click', () => {
        const taskName = document.getElementById('taskNameInput').value.trim();
        if (taskName && !tasks.find(t => t.name === taskName)) {
            tasks.push({ name: taskName, shape: "triangle", color: "#FFFFFF" }); // Default to a triangle shape and white color
            console.log(`Added new task: ${taskName}`);
        } else {
            alert("Task name cannot be empty or already exist.");
        }
    });

    document.getElementById('removeTaskTypeButton').addEventListener('click', () => {
        const taskName = document.getElementById('taskNameInput').value.trim();
        const taskIndex = tasks.findIndex(t => t.name === taskName);
        if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            console.log(`Removed task: ${taskName}`);
        } else {
            alert("Task not found.");
        }
    });
}

// p5.js draw function
function draw() {
    // Always animate layers
    animateLayers(); // Keep applying the pulsing and rotation effect

    // Only add a shape if continuousMode is enabled
    if (continuousMode) {
        addRandomTask();
    }

    drawTessellation(); // Draw the tessellation with the rotating shapes and layers
}

// Draw the entire tessellation based on the placed shapes
function drawTessellation() {
    background("#1A1A1A"); // Dark background for contrast
    // Draw each placed shape
    for (let shapeData of placedShapes) {
        drawShape(shapeData); // Using draw functions from drawShapes.js
    }
}

// Function to add a task's shape to the tessellation
function addTask(taskName) {
    const task = tasks.find(t => t.name === taskName);
    if (task) {
        // Initialize task's layer progress if it hasn't started yet
        if (!taskLayers[task.name]) {
            taskLayers[task.name] = { index: 0, layer: globalNextLayer }; // Start from the global next available layer
            globalNextLayer++; // Increment the global next available layer
        }

        console.log(`Adding task: ${task.name} | Current layer: ${taskLayers[task.name].layer}`);
        addShapeToTaskLayer(task);
        redraw(); // Ensure canvas redraws after adding a task
    }
}

// Function to place a shape for a given task in its dedicated layer
function addShapeToTaskLayer(task) {
    const taskData = taskLayers[task.name];
    const currentLayer = taskData.layer; // This task's current layer index
    const radius = shapeRadius * (currentLayer + 1) * 2; // Calculate radius for this layer
    const numShapes = 6 + currentLayer * 6; // Number of shapes that fit in this layer
    const angleIncrement = TWO_PI / numShapes; // Angle between shapes

    // If the layer is fully filled, move to the next global layer
    if (taskData.index >= numShapes) {
        taskData.layer = globalNextLayer; // Move to the next global available layer
        globalNextLayer++; // Increment the global layer counter
        taskData.index = 0; // Reset index to start filling the new layer
        console.log(`Task "${task.name}" has moved to a new dedicated layer: ${taskData.layer}`);
        return addShapeToTaskLayer(task); // Recursively add the shape to the new layer
    }

    // Calculate the position for the shape
    const angle = angleIncrement * taskData.index;

    // Calculate the initial x, y based on the angle and radius
    const x = centerX + cos(angle) * radius;
    const y = centerY + sin(angle) * radius;

    // Ensure this task is the only one filling this layer and not overlapping
    if (!isPositionOccupied(x, y)) {
        // Place the shape in the tessellation
        placedShapes.push({
            task: task.name, // Track the task name for animation purposes
            shape: task.shape,
            color: task.color,
            x: x,
            y: y,
            angle: degrees(angle), // Store initial angle in degrees
            currentScale: 1 // Start with a default scale of 1
        });

        // Move to the next position in this task's dedicated layer
        taskData.index += 1;
    } else {
        console.log(`Position already occupied at (${x}, ${y}). Skipping.`);
    }
}

// Check if a given position is already occupied by any shape
function isPositionOccupied(x, y) {
    for (let shape of placedShapes) {
        let d = dist(shape.x, shape.y, x, y);
        if (d < shapeRadius * 1.8) {
            return true;
        }
    }
    return false;
}

// Utility function to add a random task
function addRandomTask() {
    const taskNames = tasks.map(task => task.name);
    const randomTask = taskNames[Math.floor(Math.random() * taskNames.length)];
    console.log(`Random task chosen: ${randomTask}`);
    addTask(randomTask);
    redraw(); // Redraw canvas after adding a task
}

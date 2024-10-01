// Define 4 tasks, each with a unique shape and color
const tasks = [
    { name: "Exercise", shape: "hexagon", color: "#FF6F61" },  // Coral pink
    { name: "Read", shape: "triangle", color: "#6B5B95" },     // Rich lavender
    { name: "Meditate", shape: "square", color: "#88B04B" },   // Soft green
    { name: "Hydrate", shape: "pentagon", color: "#FFD700" },  // Bright yellow
];

let taskEvents = []; // Track the sequence of completed tasks
let placedShapes = []; // Store placed shapes in tessellation
let taskLayers = {}; // Track each task's progress within its layer
let globalOccupiedPositions = []; // Track all occupied positions across all layers

// Canvas center
let centerX, centerY;
let shapeRadius = 30; // Base radius for shapes

// p5.js setup function
function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent("canvas-container");
    centerX = width / 2;
    centerY = height / 2;
    noLoop(); // Manually control drawing
    drawTessellation(); // Initial drawing
}

// p5.js draw function
function draw() {
    drawTessellation();
}

// Draw the entire tessellation based on the placed shapes
function drawTessellation() {
    background("#1A1A1A"); // Dark background for contrast
    // Draw each placed shape
    for (let shapeData of placedShapes) {
        drawShape(shapeData);
    }
}

// Add a completed task and add one shape to its corresponding layer
function addTask(taskName) {
    const task = tasks.find(t => t.name === taskName);
    if (task) {
        taskEvents.push(task);

        // Initialize task's layer progress if it hasn't started yet
        if (!taskLayers[task.name]) {
            taskLayers[task.name] = { index: 0, layer: 0 }; // Start from the first position in this task's layer
        }

        addShapeToTaskLayer(task);
        redraw(); // Redraw canvas to display updated tessellation
    }
}

// Add one shape to the task's corresponding layer
function addShapeToTaskLayer(task) {
    const taskData = taskLayers[task.name];
    const currentLayer = taskData.layer;
    const radius = shapeRadius * (currentLayer + 1) * 2; // Calculate radius for this layer
    const numShapes = 6 + currentLayer * 6; // Number of shapes in this layer
    const angleIncrement = TWO_PI / numShapes; // Angle between shapes

    // Check if the current layer is fully filled
    if (taskData.index >= numShapes) {
        // Move to the next layer
        taskData.index = 0;
        taskData.layer += 1;
        // Update radius for the new layer
        return addShapeToTaskLayer(task);
    }

    // Find the next available position that is not already occupied
    while (taskData.index < numShapes) {
        const angle = angleIncrement * taskData.index;
        const x = centerX + cos(angle) * radius;
        const y = centerY + sin(angle) * radius;

        // Check if this position is already occupied
        if (!isPositionOccupied(x, y)) {
            // Add the shape to placedShapes
            placedShapes.push({
                shape: task.shape,
                color: task.color,
                x: x,
                y: y,
                angle: degrees(angle) // Store angle in degrees for drawing
            });

            // Mark this position as globally occupied
            globalOccupiedPositions.push({ x: x, y: y });

            // Move to the next position for this task's layer
            taskData.index += 1;
            return;
        }

        // If occupied, move to the next index
        taskData.index += 1;
    }
}

// Check if a given position is already occupied globally
function isPositionOccupied(x, y) {
    for (let pos of globalOccupiedPositions) {
        if (dist(x, y, pos.x, pos.y) < shapeRadius * 1.8) {
            return true;
        }
    }
    return false;
}

// Draw a shape based on its type
function drawShape(shapeData) {
    fill(shapeData.color);
    noStroke();
    push();
    translate(shapeData.x, shapeData.y);
    rotate(radians(shapeData.angle));

    switch (shapeData.shape) {
        case "triangle":
            drawTriangle();
            break;
        case "square":
            rectMode(CENTER);
            rect(0, 0, shapeRadius * 2, shapeRadius * 2);
            break;
        case "hexagon":
            drawPolygon(0, 0, shapeRadius, 6);
            break;
        case "pentagon":
            drawPolygon(0, 0, shapeRadius, 5);
            break;
    }
    pop();
}

// Draw a regular polygon (for pentagon and hexagon shapes)
function drawPolygon(x, y, radius, sides) {
    beginShape();
    for (let i = 0; i < sides; i++) {
        let angle = TWO_PI / sides * i;
        let px = x + cos(angle) * radius;
        let py = y + sin(angle) * radius;
        vertex(px, py);
    }
    endShape(CLOSE);
}

// Draw an equilateral triangle
function drawTriangle() {
    const height = shapeRadius * sqrt(3);
    triangle(0, -height / 2, -shapeRadius, height / 2, shapeRadius, height / 2);
}

// Utility to add task completion events when a button is clicked
document.getElementById('addShapeButton').addEventListener('click', () => {
    const taskNames = tasks.map(task => task.name);
    const randomTask = taskNames[Math.floor(Math.random() * taskNames.length)];
    addTask(randomTask);
});

// Define habit tracking events and their associated shapes and colors
let habits = [
    { name: "Exercise", shape: "hexagon", color: "#FF5733" },
    { name: "Read", shape: "triangle", color: "#33FF57" },
    { name: "Meditate", shape: "square", color: "#3357FF" },
    { name: "Hydrate", shape: "pentagon", color: "#FF33A6" }
];

let trackedEvents = [];
let placedShapes = []; // Array to store placed shapes

// Start from the center
let centerX, centerY;

// Initialize habit tracker data
function addHabitEvent(habitName) {
    const habit = habits.find(h => h.name === habitName);
    if (habit) {
        trackedEvents.push(habit);
        placeNewShape(habit);
        redraw(); // Redraw the canvas every time a new habit event is added
    }
}

// p5.js setup function
function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent("canvas-container");
    centerX = width / 2;
    centerY = height / 2;
    noLoop(); // We manually control drawing
    drawKaleadical(); // Initial drawing

    // Start with the first shape at the center
    let firstHabit = habits[Math.floor(Math.random() * habits.length)];
    addHabitEvent(firstHabit.name);
}

// p5.js draw function
function draw() {
    drawKaleadical();
}

// Draw the Kaleadical pattern based on placed shapes
function drawKaleadical() {
    background(51); // Clear background

    // Draw all placed shapes
    for (let shapeData of placedShapes) {
        drawShape(shapeData);
    }
}

// Function to place a new shape next to an existing shape
function placeNewShape(habit) {
    if (placedShapes.length === 0) {
        // Place the first shape in the center
        placedShapes.push({ shape: habit.shape, color: habit.color, x: centerX, y: centerY, angle: 0 });
        return;
    }

    // Attempt to place the new shape next to an existing shape
    for (let existingShape of placedShapes) {
        let newShapePosition = findAdjacentPosition(existingShape, habit.shape);
        if (newShapePosition) {
            placedShapes.push({
                shape: habit.shape,
                color: habit.color,
                x: newShapePosition.x,
                y: newShapePosition.y,
                angle: newShapePosition.angle
            });
            return;
        }
    }
}

// Find a suitable adjacent position for the new shape
function findAdjacentPosition(existingShape, newShapeType) {
    // Define connection offsets for each shape type
    const offsets = {
        triangle: [[0, -1], [1, 0], [0, 1], [-1, 0]],
        square: [[1, 0], [0, 1], [-1, 0], [0, -1]],
        pentagon: [[1, 0], [0.5, 0.87], [-0.5, 0.87], [-1, 0], [-0.5, -0.87], [0.5, -0.87]],
        hexagon: [[1, 0], [0.5, 0.87], [-0.5, 0.87], [-1, 0], [-0.5, -0.87], [0.5, -0.87]]
    };

    let existingOffsets = offsets[existingShape.shape];

    for (let offset of existingOffsets) {
        let nx = existingShape.x + offset[0] * 40;
        let ny = existingShape.y + offset[1] * 40;

        // Check if there's space for this new shape (ensure it’s not overlapping with others)
        if (!isOccupied(nx, ny)) {
            return { x: nx, y: ny, angle: random([0, 60, 120, 180, 240, 300]) };
        }
    }

    return null; // No valid position found
}

// Check if a position is already occupied
function isOccupied(x, y) {
    for (let shape of placedShapes) {
        let d = dist(shape.x, shape.y, x, y);
        if (d < 30) return true; // Adjust distance threshold as needed
    }
    return false;
}

// Draw shapes based on their data
function drawShape(shapeData) {
    fill(shapeData.color);
    noStroke();
    push();
    translate(shapeData.x, shapeData.y);
    rotate(radians(shapeData.angle));

    switch (shapeData.shape) {
        case "triangle":
            let triHeight = 30 * sqrt(3) / 2;
            triangle(0, -triHeight, -15, triHeight / 2, 15, triHeight / 2);
            break;
        case "square":
            rectMode(CENTER);
            rect(0, 0, 30, 30);
            break;
        case "pentagon":
            drawPolygon(0, 0, 20, 5);
            break;
        case "hexagon":
            drawPolygon(0, 0, 20, 6);
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

// Utility: Add more habit events to see the pattern grow
function trackMoreEvents() {
    // Simulate adding different habit events
    const habitNames = ["Exercise", "Read", "Meditate", "Hydrate"];
    addHabitEvent(habitNames[Math.floor(Math.random() * habitNames.length)]);
}

document.getElementById('addShapeButton').addEventListener('click', trackMoreEvents);
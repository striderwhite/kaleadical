// Define habit tracking events with shapes that tessellate well
let habits = [
    { name: "Exercise", shape: "hexagon", color: "#F94144" },  // Warm red
    { name: "Read", shape: "triangle", color: "#F8961E" },     // Vibrant orange
    { name: "Meditate", shape: "square", color: "#90BE6D" },   // Soft green
];

let trackedEvents = [];
let placedShapes = []; // Array to store placed shapes

// Start from the center
let centerX, centerY;
let shapeRadius = 30; // Base radius for shapes

// Initialize habit tracker data
function addHabitEvent(habitName) {
    const habit = habits.find(h => h.name === habitName);
    if (habit) {
        trackedEvents.push(habit);
        placeNextShape(habit);
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
    background("#1A1A1A"); // Dark background to enhance color contrast

    // Draw all placed shapes
    for (let shapeData of placedShapes) {
        drawShape(shapeData);
    }
}

// Function to place a single shape around the existing shapes with a focus on symmetry
function placeNextShape(habit) {
    if (placedShapes.length === 0) {
        // Place the first shape in the center
        placedShapes.push({ shape: habit.shape, color: habit.color, x: centerX, y: centerY, angle: 0 });
        return;
    }

    // Try placing the shape around existing shapes, one at a time
    for (let existingShape of placedShapes) {
        let positions = generateSymmetricalPositions(existingShape, habit.shape);

        for (let pos of positions) {
            if (!isOccupied(pos.x, pos.y)) {
                placedShapes.push({
                    shape: habit.shape,
                    color: habit.color,
                    x: pos.x,
                    y: pos.y,
                    angle: pos.angle
                });
                return; // Place only one shape per call
            }
        }
    }
}

// Generate symmetrical positions around an existing shape
function generateSymmetricalPositions(existingShape, shapeType) {
    const offsetFactor = shapeRadius * 2; // Adjust distance between shapes based on the radius
    let angles;

    // Define symmetrical angles based on the shape type for more precise tessellation
    switch (existingShape.shape) {
        case "hexagon":
            angles = [0, 60, 120, 180, 240, 300]; // Symmetrical angles for hexagons
            break;
        case "triangle":
            angles = [0, 120, 240]; // Symmetry for equilateral triangles
            break;
        case "square":
            angles = [0, 90, 180, 270]; // Square's rotational symmetry
            break;
        default:
            angles = [0]; // Default symmetry
    }

    let positions = [];
    for (let angle of angles) {
        let rad = radians(angle);
        let nx = existingShape.x + cos(rad) * offsetFactor;
        let ny = existingShape.y + sin(rad) * offsetFactor;

        positions.push({ x: nx, y: ny, angle: angle });
    }

    return positions;
}

// Check if a position is already occupied
function isOccupied(x, y) {
    for (let shape of placedShapes) {
        let d = dist(shape.x, shape.y, x, y);
        if (d < shapeRadius * 1.8) return true; // Adjust distance threshold as needed
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
            let triHeight = shapeRadius * sqrt(3);
            triangle(0, -triHeight / 2, -shapeRadius, triHeight / 2, shapeRadius, triHeight / 2);
            break;
        case "square":
            rectMode(CENTER);
            rect(0, 0, shapeRadius * 2, shapeRadius * 2);
            break;
        case "hexagon":
            drawPolygon(0, 0, shapeRadius, 6);
            break;
    }
    pop();
}

// Draw a regular polygon (for hexagon shapes)
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
    const habitNames = habits.map(habit => habit.name);
    addHabitEvent(habitNames[Math.floor(Math.random() * habitNames.length)]);
}

// Adding button event listener
document.getElementById('addShapeButton').addEventListener('click', trackMoreEvents);

// animation.js

// Store the phase for each shape's pulse
let shapePhases = {}; // Controls the pulsing behavior
let rotationDirections = {}; // Store the rotation direction for each shape

function animateLayers() {
    placedShapes.forEach((shapeData, index) => {
        // Initialize the phase and rotation direction if not already set
        if (shapePhases[index] === undefined) {
            shapePhases[index] = random(TWO_PI); // Start with a random phase
        }

        if (rotationDirections[index] === undefined) {
            rotationDirections[index] = index % 2 === 0 ? 1 : -1; // Alternate rotation direction: even index rotates clockwise, odd index counterclockwise
        }

        // Adjust the individual rotation of the shape
        const individualRotationSpeed = 0.01; // Adjust this value for the desired rotation speed
        shapeData.angle += degrees(individualRotationSpeed) * rotationDirections[index];

        // Update the phase to control the pulsing effect
        const pulseSpeed = 0.05; // Rate of the pulse
        shapePhases[index] += pulseSpeed; // Increment the phase

        // Calculate the scaling factor using a sine wave for the pulsing effect
        const maxScale = 1.20; // Maximum scale size
        const minScale = 0.80; // Minimum scale size
        const pulse = (sin(shapePhases[index]) + 1) / 2; // Value oscillates smoothly between 0 and 1
        const currentScale = minScale + pulse * (maxScale - minScale); // Map pulse to scale range

        // Apply the scale transformation to the shape data
        shapeData.currentScale = currentScale; // Store the current scale in the shape data
    });
}

// Hook animateLayers function to p5.js draw loop
function draw() {
    animateLayers(); // Apply scaling and rotation animation
    drawTessellation(); // Redraw the tessellation
}

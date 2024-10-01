// drawShapes.js

// Draw the selected shape based on the shapeData
function drawShape(shapeData) {
    fill(shapeData.color);
    noStroke();
    push();
    translate(shapeData.x, shapeData.y);
    
    // Apply the scaling effect
    const currentScale = shapeData.currentScale || 1; // Use currentScale or default to 1
    scale(currentScale); // Apply scaling effect

    // Apply the individual rotation effect
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
        case "octagon":
            drawPolygon(0, 0, shapeRadius, 8);
            break;
        case "diamond":
            drawDiamond();
            break;
        case "parallelogram":
            drawParallelogram();
            break;
        case "star":
            drawStar(5, shapeRadius, shapeRadius / 2);
            break;
        case "trapezoid":
            drawTrapezoid();
            break;
        case "cross":
            drawCross();
            break;
        default:
            console.error(`Unknown shape type: ${shapeData.shape}`);
    }
    pop();
}

// Additional shape-drawing functions
function drawTriangle() {
    const triHeight = shapeRadius * sqrt(3) / 2;
    triangle(0, -triHeight, -shapeRadius, triHeight / 2, shapeRadius, triHeight / 2);
}

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

function drawDiamond() {
    beginShape();
    vertex(0, -shapeRadius);
    vertex(shapeRadius / 2, 0);
    vertex(0, shapeRadius);
    vertex(-shapeRadius / 2, 0);
    endShape(CLOSE);
}

function drawParallelogram() {
    beginShape();
    vertex(-shapeRadius, shapeRadius / 2);
    vertex(0, shapeRadius / 2);
    vertex(shapeRadius, -shapeRadius / 2);
    vertex(0, -shapeRadius / 2);
    endShape(CLOSE);
}

function drawStar(points, outerRadius, innerRadius) {
    let angle = TWO_PI / points;
    beginShape();
    for (let i = 0; i < TWO_PI; i += angle) {
        let x1 = cos(i) * outerRadius;
        let y1 = sin(i) * outerRadius;
        vertex(x1, y1);
        let x2 = cos(i + angle / 2) * innerRadius;
        let y2 = sin(i + angle / 2) * innerRadius;
        vertex(x2, y2);
    }
    endShape(CLOSE);
}

function drawTrapezoid() {
    beginShape();
    vertex(-shapeRadius, shapeRadius / 2);
    vertex(shapeRadius, shapeRadius / 2);
    vertex(shapeRadius / 2, -shapeRadius / 2);
    vertex(-shapeRadius / 2, -shapeRadius / 2);
    endShape(CLOSE);
}

function drawCross() {
    rectMode(CENTER);
    rect(0, 0, shapeRadius * 1.5, shapeRadius / 2);
    rect(0, 0, shapeRadius / 2, shapeRadius * 1.5);
}

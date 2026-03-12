// LEVELS MENU
// ------------------------------------------------------------
// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// drawMap() is called from main.js only when:
// currentScreen === "map"

const BASE_W = 1152;
const BASE_H = 648;

// Hover animation state for map icons fade
let mapIconHoverFade = 0;
const MAP_ICON_FADE_SPEED = 0.08; // fade speed per frame

function drawMap() {
  background(0);

  const scaleFactor = min(width / BASE_W, height / BASE_H);
  const offsetX = (width - BASE_W * scaleFactor) / 2;
  const offsetY = (height - BASE_H * scaleFactor) / 2;

  push();
  translate(offsetX, offsetY);
  scale(scaleFactor);

  // Draw background (in base coordinates)
  image(levelMenu, 0, 0, BASE_W, BASE_H);

  // Draw map icons image centered in the middle of the screen
  const mapIconWidth = 778;
  const mapIconAspectRatio = mapIconsDefault.height / mapIconsDefault.width;
  const mapIconHeight = mapIconWidth * mapIconAspectRatio;
  const mapIconX = BASE_W / 2;
  const mapIconY = BASE_H / 2;

  // Check if mouse is hovering over the image (in base coordinates)
  const adjustedMX = (mouseX - offsetX) / scaleFactor;
  const adjustedMY = (mouseY - offsetY) / scaleFactor;
  const mapIconLeft = mapIconX - mapIconWidth / 2;
  const mapIconRight = mapIconX + mapIconWidth / 2;
  const mapIconTop = mapIconY - mapIconHeight / 2;
  const mapIconBottom = mapIconY + mapIconHeight / 2;

  const isHovering =
    adjustedMX >= mapIconLeft &&
    adjustedMX <= mapIconRight &&
    adjustedMY >= mapIconTop &&
    adjustedMY <= mapIconBottom;

  // Update fade animation based on hover state
  if (isHovering) {
    mapIconHoverFade = min(mapIconHoverFade + MAP_ICON_FADE_SPEED, 1);
  } else {
    mapIconHoverFade = max(mapIconHoverFade - MAP_ICON_FADE_SPEED, 0);
  }

  // Draw default image
  imageMode(CENTER);
  image(mapIconsDefault, mapIconX, mapIconY, mapIconWidth, mapIconHeight);

  // Draw hover image on top with fade opacity (only when fading > 0)
  if (mapIconHoverFade > 0) {
    tint(255, mapIconHoverFade * 255);
    image(mapIconsHover, mapIconX, mapIconY, mapIconWidth, mapIconHeight);
    noTint();
  }

  imageMode(CORNER);

  // Title in base coordinates
  fill("#ceb53a");
  textFont("Fraunces");
  textSize(42);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Alchemy Map", BASE_W / 2, BASE_H * 0.14);

  pop();

  if (isHovering) cursor(HAND);
  else cursor(ARROW);
}

// ------------------------------------------------------------
// Mouse input for the map screen.
// ------------------------------------------------------------
// Called from main.js only when currentScreen === "map"
function mapMousePressed() {
  currentScreen = "level";
}

// ------------------------------------------------------------
// Keyboard input for the map screen
// ------------------------------------------------------------
// Provides keyboard shortcuts:
// - ENTER starts the game
// - I opens instructions
function mapKeyPressed() {
  if (keyCode === ENTER) {
    currentScreen = "level";
  }

  if (key === "s" || key === "S") {
    currentScreen = "start";
  }

  // ESC to return disabled temporarily
}

// ------------------------------------------------------------
// Helper: drawButton()
// ------------------------------------------------------------
// This function draws a button and changes its appearance on hover.
// It does NOT decide what happens when you click the button.
// That logic lives in startMousePressed() above.
//
// Keeping drawing separate from input/logic makes code easier to read.
function drawButton({ x, y, w, h, label }) {
  rectMode(CENTER);

  // Check if the mouse is over the button rectangle
  const hover = isHover({ x, y, w, h });

  noStroke();

  // ---- Visual feedback (hover vs not hover) ----
  // This is a common UI idea:
  // - normal state is calmer
  // - hover state is brighter + more “active”
  //
  // We also add a shadow using drawingContext (p5 lets you access the
  // underlying canvas context for effects like shadows).
  if (hover) {
    fill(255, 255, 255, 0); // more opaque on hover
    stroke("#83c5be");
    strokeWeight(1.5);
  } else {
    fill(255, 255, 255, 0); // semi-transparent white
    stroke(255, 255, 255, 0);
    strokeWeight(1.5);
  }

  rect(x, y, w, h);

  // Draw the label text - dark navy for high contrast
  noStroke();
  fill("#ceb53a");
  textSize(23);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}

// Helper: isCircleHover()
// Checks if the mouse is over a circular button.
function isCircleHover({ x, y, diameter }) {
  const radius = diameter / 2;
  const distance = dist(mouseX, mouseY, x, y);
  return distance < radius;
}

// Helper: isIconHover()
// Checks if the mouse is over a rectangular icon
function isIconHover(x, y, width, height) {
  return (
    mouseX > x - width / 2 &&
    mouseX < x + width / 2 &&
    mouseY > y - height / 2 &&
    mouseY < y + height / 2
  );
}

// Helper: drawCircleButton()
// Draws a circular button with "click me" text.
function drawCircleButton({ x, y, diameter }) {
  fill(255);
  noStroke();
  ellipseMode(CENTER);
  ellipse(x, y, diameter, diameter);

  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Begin", x, y);
}

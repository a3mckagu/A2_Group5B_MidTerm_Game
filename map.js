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

// ========== HITBOX CONFIGURATION ==========
// All hitboxes are centered on the map screen (BASE_W/2, BASE_H/2)
// Modify these variables to adjust hitbox positions and sizes

// LEVEL 1: Circle at center
const LEVEL1_HITBOX = {
  centerX: BASE_W / 2 - 288,
  centerY: BASE_H / 2 + 122,
  radius: 87, // diameter will be radius * 2
};

// LEVEL 2: Norman window shape (rectangle with semicircle on top)
// Norman window = rectangle body + semicircle top
const LEVEL2_HITBOX = {
  centerX: BASE_W / 2 - 85,
  centerY: BASE_H / 2 + 50, // positioned slightly lower
  rectWidth: 153, // width of rectangular body
  rectHeight: 170, // height of rectangular body (doesn't include semicircle)
  // semicircle sits on top with same width as rect
};

// LEVEL 3: Norman window shape (same as Level 2, positioned higher with red fill)
const LEVEL3_HITBOX = {
  centerX: BASE_W / 2 + 242,
  centerY: BASE_H / 2 + 210, // positioned slightly higher
  rectWidth: 265,
  rectHeight: 221,
};

// Next Level button in bottom left corner
const NEXT_LEVEL_BUTTON = {
  x: 80,
  y: BASE_H - 40,
  w: 140,
  h: 50,
  label: "Next Level",
};

// ========== HITBOX DETECTION HELPERS ==========

// Check if a point is inside Level 1 circle hitbox
function isPointInLevel1Circle(px, py) {
  const dx = px - LEVEL1_HITBOX.centerX;
  const dy = py - LEVEL1_HITBOX.centerY;
  const distSq = dx * dx + dy * dy;
  const radiusSq = LEVEL1_HITBOX.radius * LEVEL1_HITBOX.radius;
  return distSq <= radiusSq;
}

// Check if a point is inside a Norman window shape (rectangle + semicircle on top)
function isPointInNormanWindow(px, py, config) {
  const rectLeft = config.centerX - config.rectWidth / 2;
  const rectRight = config.centerX + config.rectWidth / 2;
  const rectTop = config.centerY - config.rectHeight;
  const rectBottom = config.centerY;

  // Check if inside rectangular body
  if (px >= rectLeft && px <= rectRight && py >= rectTop && py <= rectBottom) {
    return true;
  }

  // Check if inside semicircle on top
  // Semicircle center is at the top of the rectangle
  const semicircleTop = rectTop;
  const semicircleRadius = config.rectWidth / 2;
  const dx = px - config.centerX;
  const dy = py - semicircleTop;

  if (dy <= 0 && dy >= -semicircleRadius) {
    // Point is above the rectangle line
    const distSq = dx * dx + dy * dy;
    return distSq <= semicircleRadius * semicircleRadius;
  }

  return false;
}

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

  // Select the correct map icons based on current level
  let currentDefaultIcons, currentHoverIcons;

  if (currentLevelNumber === 1) {
    currentDefaultIcons = mapIconsDefault;
    currentHoverIcons = mapIconsHover;
  } else if (currentLevelNumber === 2) {
    currentDefaultIcons = mapIconsLevel2Default;
    currentHoverIcons = mapIconsLevel2Hover;
  } else {
    // Level 3+
    currentDefaultIcons = mapIconsLevel3Default;
    currentHoverIcons = mapIconsLevel3Hover;
  }

  const mapIconAspectRatio =
    currentDefaultIcons.height / currentDefaultIcons.width;
  const mapIconWidth = 778;
  const mapIconHeight = mapIconWidth * mapIconAspectRatio;
  const mapIconX = BASE_W / 2;
  const mapIconY = BASE_H / 2;

  // Check if mouse is hovering over the level hitbox (in base coordinates)
  const adjustedMX = (mouseX - offsetX) / scaleFactor;
  const adjustedMY = (mouseY - offsetY) / scaleFactor;

  // Determine if hovering based on current level's hitbox
  let isHovering = false;
  if (currentLevelNumber === 1) {
    isHovering = isPointInLevel1Circle(adjustedMX, adjustedMY);
  } else if (currentLevelNumber === 2) {
    isHovering = isPointInNormanWindow(adjustedMX, adjustedMY, LEVEL2_HITBOX);
  } else {
    isHovering = isPointInNormanWindow(adjustedMX, adjustedMY, LEVEL3_HITBOX);
  }

  // Update fade animation based on hover state
  if (isHovering) {
    mapIconHoverFade = min(mapIconHoverFade + MAP_ICON_FADE_SPEED, 1);
  } else {
    mapIconHoverFade = max(mapIconHoverFade - MAP_ICON_FADE_SPEED, 0);
  }

  // Draw default image
  imageMode(CENTER);
  image(currentDefaultIcons, mapIconX, mapIconY, mapIconWidth, mapIconHeight);

  // Draw hover image on top with fade opacity (only when fading > 0)
  if (mapIconHoverFade > 0) {
    5;
    tint(255, mapIconHoverFade * 255);
    image(currentHoverIcons, mapIconX, mapIconY, mapIconWidth, mapIconHeight);
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

  // Draw the "Next Level" button in bottom left corner
  drawButton({
    x: NEXT_LEVEL_BUTTON.x,
    y: NEXT_LEVEL_BUTTON.y,
    w: NEXT_LEVEL_BUTTON.w,
    h: NEXT_LEVEL_BUTTON.h,
    label: NEXT_LEVEL_BUTTON.label,
  });

  pop();

  if (isHovering) cursor(HAND);
  else cursor(ARROW);
}

// ------------------------------------------------------------
// Mouse input for the map screen.
// ------------------------------------------------------------
// Called from main.js only when currentScreen === "map"
function mapMousePressed() {
  // Calculate scale and offset to convert mouse coordinates
  const scaleFactor = min(width / BASE_W, height / BASE_H);
  const offsetX = (width - BASE_W * scaleFactor) / 2;
  const offsetY = (height - BASE_H * scaleFactor) / 2;

  // Convert mouse coordinates to base coordinates (accounting for scale and offset)
  const adjustedMX = (mouseX - offsetX) / scaleFactor;
  const adjustedMY = (mouseY - offsetY) / scaleFactor;

  // Check if the "Next Level" button was clicked
  const buttonLeft = NEXT_LEVEL_BUTTON.x - NEXT_LEVEL_BUTTON.w / 2;
  const buttonRight = NEXT_LEVEL_BUTTON.x + NEXT_LEVEL_BUTTON.w / 2;
  const buttonTop = NEXT_LEVEL_BUTTON.y - NEXT_LEVEL_BUTTON.h / 2;
  const buttonBottom = NEXT_LEVEL_BUTTON.y + NEXT_LEVEL_BUTTON.h / 2;

  if (
    adjustedMX >= buttonLeft &&
    adjustedMX <= buttonRight &&
    adjustedMY >= buttonTop &&
    adjustedMY <= buttonBottom
  ) {
    // Next Level button was clicked - increment level
    currentLevelNumber++;
    // Stay on the map screen to show the updated level
    return;
  }

  // Check if click is on the current level's hitbox
  let clickedOnLevel = false;
  if (currentLevelNumber === 1) {
    clickedOnLevel = isPointInLevel1Circle(adjustedMX, adjustedMY);
  } else if (currentLevelNumber === 2) {
    clickedOnLevel = isPointInNormanWindow(
      adjustedMX,
      adjustedMY,
      LEVEL2_HITBOX,
    );
  } else {
    clickedOnLevel = isPointInNormanWindow(
      adjustedMX,
      adjustedMY,
      LEVEL3_HITBOX,
    );
  }

  // Only start the game if clicking on the hitbox
  if (clickedOnLevel) {
    createLevelInstance();
    currentScreen = "level";
  }
}

// ------------------------------------------------------------
// Keyboard input for the map screen
// ------------------------------------------------------------
// Provides keyboard shortcuts:
// - ENTER starts the game
// - S returns to start menu
// - ESC returns to start menu (handled globally)
function mapKeyPressed() {
  if (keyCode === ENTER) {
    currentScreen = "level";
  }

  if (key === "s" || key === "S") {
    currentScreen = "start";
  }
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

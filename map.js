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
// Toggle to show hit areas for debugging
let SHOW_HIT_AREAS = false;

// Level hit-area parameters (relative to map image center)
// Final defaults (aligned to Level 1 artwork). Use debug keys if needed.
// Values chosen from interactive tuning overlay.
let level1RelX = -0.4; // negative = left
let level1RelY = 0.295; // positive = down
let level1RelDiameter = 0.18;

// Level 2 hitbox is 30px to the right of Level 1
let level2RelX = -0.4 + 0.0386; // ~30px shift (30/778 ≈ 0.0386)
let level2RelY = 0.295;
let level2RelDiameter = 0.18;

// Level 3 hitbox is 60px to the right of Level 1 (30px right from Level 2)
let level3RelX = -0.4 + 0.0772; // ~60px shift (60/778 ≈ 0.0772)
let level3RelY = 0.295;
let level3RelDiameter = 0.18;

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

  // Select the correct map icons based on current level
  let currentDefaultIcons,
    currentHoverIcons,
    currentRelX,
    currentRelY,
    currentRelDiameter,
    hitboxType = "circle",
    hitboxOffsetX = 0,
    hitboxOffsetY = 0,
    hitboxW = 0,
    hitboxH = 0;

  if (currentLevelNumber === 1) {
    currentDefaultIcons = mapIconsDefault;
    currentHoverIcons = mapIconsHover;
    currentRelX = level1RelX;
    currentRelY = level1RelY;
    currentRelDiameter = level1RelDiameter;
    hitboxType = "circle";
  } else if (currentLevelNumber === 2) {
    currentDefaultIcons = mapIconsLevel2Default;
    currentHoverIcons = mapIconsLevel2Hover;
    hitboxType = "rect";
    hitboxOffsetX = -155;
    hitboxOffsetY = -34;
    hitboxW = 118;
    hitboxH = 175;
  } else {
    // Level 3+
    currentDefaultIcons = mapIconsLevel3Default;
    currentHoverIcons = mapIconsLevel3Hover;
    hitboxType = "square";
    hitboxOffsetX = 48;
    hitboxOffsetY = 80;
    hitboxW = 138;
    hitboxH = 138;
  }

  const mapIconAspectRatio =
    currentDefaultIcons.height / currentDefaultIcons.width;
  const mapIconHeight = mapIconWidth * mapIconAspectRatio;
  const mapIconX = BASE_W / 2;
  const mapIconY = BASE_H / 2;
  // Check if mouse is hovering over the level hitbox (in base coordinates)
  const adjustedMX = (mouseX - offsetX) / scaleFactor;
  const adjustedMY = (mouseY - offsetY) / scaleFactor;

  // Calculate hitbox position based on level type
  let levelX, levelY, isHovering;

  if (currentLevelNumber === 1) {
    // Level 1: Circle hitbox at center position
    levelX = mapIconX + mapIconWidth * currentRelX;
    levelY = mapIconY + mapIconHeight * currentRelY;
    const levelDiameter = mapIconWidth * currentRelDiameter;

    const dx = adjustedMX - levelX;
    const dy = adjustedMY - levelY;
    const distToLevel = Math.sqrt(dx * dx + dy * dy);
    isHovering = distToLevel <= levelDiameter / 2;
  } else if (currentLevelNumber === 2) {
    // Level 2: Rectangle hitbox with pixel offsets
    levelX = mapIconX + hitboxOffsetX;
    levelY = mapIconY + hitboxOffsetY;
    const rectLeft = levelX - hitboxW / 2;
    const rectTop = levelY - hitboxH / 2;
    const rectRight = levelX + hitboxW / 2;
    const rectBottom = levelY + hitboxH / 2;

    isHovering =
      adjustedMX >= rectLeft &&
      adjustedMX <= rectRight &&
      adjustedMY >= rectTop &&
      adjustedMY <= rectBottom;
  } else {
    // Level 3+: Square hitbox with pixel offsets
    levelX = mapIconX + hitboxOffsetX;
    levelY = mapIconY + hitboxOffsetY;
    const squareLeft = levelX - hitboxW / 2;
    const squareTop = levelY - hitboxH / 2;
    const squareRight = levelX + hitboxW / 2;
    const squareBottom = levelY + hitboxH / 2;

    isHovering =
      adjustedMX >= squareLeft &&
      adjustedMX <= squareRight &&
      adjustedMY >= squareTop &&
      adjustedMY <= squareBottom;
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

  // Debug: draw the hit area on top of the map so it stays visible.
  if (SHOW_HIT_AREAS) {
    push();
    noFill();
    stroke(255, 0, 0, 180);
    strokeWeight(2 / scaleFactor);
    if (currentLevelNumber === 1) {
      const levelDiameter = mapIconWidth * currentRelDiameter;
      ellipseMode(CENTER);
      ellipse(levelX, levelY, levelDiameter, levelDiameter);
      fill(255, 0, 0, 200);
      noStroke();
      const centerSize = 6 / scaleFactor;
      ellipse(levelX, levelY, centerSize, centerSize);
    } else {
      rectMode(CENTER);
      rect(levelX, levelY, hitboxW, hitboxH, 10);
    }
    pop();
  }

  pop();

  if (SHOW_HIT_AREAS) {
    push();
    noStroke();
    fill(0, 0, 0, 160);
    let debugText = "";
    let boxH = 86;

    if (currentLevelNumber === 1) {
      boxH = 104;
      debugText = `LEVEL 1 (Circle)\nJ/L: left/right  I/K: up/down  N/M: smaller/larger\nH: toggle  P: save  O: load\nrelX: ${level1RelX.toFixed(3)}  relY: ${level1RelY.toFixed(3)}  relD: ${level1RelDiameter.toFixed(3)}`;
    } else {
      debugText = `LEVEL ${currentLevelNumber} (${currentLevelNumber === 2 ? "Rectangle" : "Square"})\nH: toggle overlay\nOffset: (${hitboxOffsetX}, ${hitboxOffsetY})  Size: ${hitboxW}x${hitboxH}`;
    }

    const boxW = 430;
    rect(16, height - boxH - 16, boxW, boxH, 8);
    fill(255);
    textAlign(LEFT, TOP);
    textSize(12);
    text(debugText, 24, height - boxH - 8);
    pop();
  }

  if (isHovering) cursor(HAND);
  else cursor(ARROW);
}

// ------------------------------------------------------------
// Mouse input for the map screen.
// ------------------------------------------------------------
// Called from main.js only when currentScreen === "map"
function mapMousePressed() {
  // Create a fresh level instance and transition to gameplay
  createLevelInstance();
  currentScreen = "level";
}

function handleMapDebugShortcut() {
  const lowerKey = key.toLowerCase();

  if (lowerKey === "h") {
    SHOW_HIT_AREAS = !SHOW_HIT_AREAS;
    currentScreen = "map";
    return true;
  }

  if (currentScreen !== "map" || !SHOW_HIT_AREAS) return false;

  if (lowerKey === "j") {
    level1RelX -= 0.005;
    return true;
  }
  if (lowerKey === "l") {
    level1RelX += 0.005;
    return true;
  }
  if (lowerKey === "i") {
    level1RelY -= 0.005;
    return true;
  }
  if (lowerKey === "k") {
    level1RelY += 0.005;
    return true;
  }
  if (lowerKey === "n") {
    level1RelDiameter = max(0.01, level1RelDiameter - 0.005);
    return true;
  }
  if (lowerKey === "m") {
    level1RelDiameter = min(0.8, level1RelDiameter + 0.005);
    return true;
  }
  if (lowerKey === "p") {
    try {
      localStorage.setItem(
        "level1Hit",
        JSON.stringify({ level1RelX, level1RelY, level1RelDiameter }),
      );
      console.log("Saved level1 hit values", {
        level1RelX,
        level1RelY,
        level1RelDiameter,
      });
    } catch (e) {}
    return true;
  }
  if (lowerKey === "o") {
    try {
      const raw = localStorage.getItem("level1Hit");
      if (raw) {
        const obj = JSON.parse(raw);
        level1RelX = obj.level1RelX;
        level1RelY = obj.level1RelY;
        level1RelDiameter = obj.level1RelDiameter;
      }
    } catch (e) {}
    return true;
  }

  return false;
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

  if (handleMapDebugShortcut()) return;

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

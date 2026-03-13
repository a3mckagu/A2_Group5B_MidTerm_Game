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

// Level1 hit-area parameters (relative to map image center)
// Final defaults (aligned to Level 1 artwork). Use debug keys if needed.
// Values chosen from interactive tuning overlay.
let level1RelX = -0.4; // negative = left
let level1RelY = 0.295; // positive = down
let level1RelDiameter = 0.18;

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
  // Check if mouse is hovering over the Level 1 circle (in base coordinates)
  const adjustedMX = (mouseX - offsetX) / scaleFactor;
  const adjustedMY = (mouseY - offsetY) / scaleFactor;

  // Level 1 circle hit area (positioned relative to the map icons image)
  const level1X = mapIconX + mapIconWidth * level1RelX;
  const level1Y = mapIconY + mapIconHeight * level1RelY;
  const level1Diameter = mapIconWidth * level1RelDiameter;

  const dx = adjustedMX - level1X;
  const dy = adjustedMY - level1Y;
  const distToLevel1 = Math.sqrt(dx * dx + dy * dy);
  const isHovering = distToLevel1 <= level1Diameter / 2;

  // Debug: draw the hit area so we can visually tune it
  if (SHOW_HIT_AREAS) {
    push();
    noFill();
    stroke(255, 0, 0, 180);
    strokeWeight(2 / scaleFactor); // keep visible across scales
    ellipseMode(CENTER);
    ellipse(level1X, level1Y, level1Diameter, level1Diameter);
    // mark center
    fill(255, 0, 0, 200);
    noStroke();
    const centerSize = 6 / scaleFactor;
    ellipse(level1X, level1Y, centerSize, centerSize);
    pop();
  }
  // Debug overlay with current params (screen coords)
  if (SHOW_HIT_AREAS) {
    push();
    noStroke();
    fill(0, 0, 0, 140);
    const boxW = 300;
    const boxH = 90;
    rect(16, height - boxH - 16, boxW, boxH, 8);
    fill(255);
    textAlign(LEFT, TOP);
    textSize(12);
    text(
      `A/D: left/right  W/X: up/down  Q/E: smaller/larger\nrelX: ${level1RelX.toFixed(3)}  relY: ${level1RelY.toFixed(3)}  relD: ${level1RelDiameter.toFixed(3)}`,
      24,
      height - boxH - 8,
    );
    pop();
  }

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

  // Debug: adjust Level1 hit area when toggle enabled
  if (SHOW_HIT_AREAS) {
    // Move left/right
    if (key === "a" || key === "A") {
      level1RelX -= 0.005;
    }
    if (key === "d" || key === "D") {
      level1RelX += 0.005;
    }
    // Move up/down (remember relY positive is down)
    if (key === "w" || key === "W") {
      level1RelY -= 0.005;
    }
    if (key === "x" || key === "X") {
      level1RelY += 0.005;
    }
    // Diameter adjust
    if (key === "q" || key === "Q") {
      level1RelDiameter = max(0.01, level1RelDiameter - 0.005);
    }
    if (key === "e" || key === "E") {
      level1RelDiameter = min(0.8, level1RelDiameter + 0.005);
    }
    // Toggle debug overlay with D
    if (key === "d" || key === "D") {
      SHOW_HIT_AREAS = !SHOW_HIT_AREAS;
    }
    // Save current values to localStorage for convenience (press P)
    if (key === "p" || key === "P") {
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
    }
    // Load values (L)
    if (key === "l" || key === "L") {
      try {
        const raw = localStorage.getItem("level1Hit");
        if (raw) {
          const obj = JSON.parse(raw);
          level1RelX = obj.level1RelX;
          level1RelY = obj.level1RelY;
          level1RelDiameter = obj.level1RelDiameter;
        }
      } catch (e) {}
    }
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

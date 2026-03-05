// LEVELS MENU
// ------------------------------------------------------------
// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// drawMap() is called from main.js only when:
// currentScreen === "map"

function drawMap() {
  background(0);

  const BASE_WIDTH = 1152;
  const BASE_HEIGHT = 648;
  const scaleFactor = min(width / BASE_WIDTH, height / BASE_HEIGHT);
  const offsetX = (width - BASE_WIDTH * scaleFactor) / 2;
  const offsetY = (height - BASE_HEIGHT * scaleFactor) / 2;

  push();
  translate(offsetX, offsetY);
  scale(scaleFactor);
  image(levelMenu, 0, 0, BASE_WIDTH, BASE_HEIGHT);
  pop();

  // Draw map icons with individual position and width control
  // Icon configuration - edit these values directly
  const icon1Config = {
    icon: mapIcon1,
    x: width * 0.28 + 17,
    y: height * 0.7,
    width: 150,
  };
  const iconConfigs = [
    icon1Config,
    { icon: mapIcon2, x: width * 0.37 + 17, y: height * 0.5, width: 150 },
    { icon: mapIcon3, x: width * 0.48 + 17, y: height * 0.64, width: 200 },
    { icon: mapIcon4, x: width * 0.62 + 17, y: height * 0.47, width: 245 },
  ];

  iconConfigs.forEach((config) => {
    if (config.icon) {
      const aspectRatio = config.icon.height / config.icon.width;
      const iconHeight = config.width * aspectRatio;
      imageMode(CENTER);
      image(config.icon, config.x, config.y, config.width, iconHeight);
      imageMode(CORNER);
    }
  });

  fill("#ceb53a");
  textFont("Fraunces");
  textSize(42);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Alchemy Map", width / 2, height * 0.14);

  // ---- Cursor feedback ----
  // Show hand cursor when hovering over icon1 or the circular button
  const icon1AspectRatio = mapIcon1.height / mapIcon1.width;
  const icon1Height = icon1Config.width * icon1AspectRatio;
  const isOverIcon1 = isIconHover(
    icon1Config.x,
    icon1Config.y,
    icon1Config.width,
    icon1Height,
  );

  if (isOverIcon1) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

// ------------------------------------------------------------
// Mouse input for the map screen.
// ------------------------------------------------------------
// Called from main.js only when currentScreen === "map"
function mapMousePressed() {
  // Check if mapIcon1 is clicked
  const icon1AspectRatio = mapIcon1.height / mapIcon1.width;
  const icon1Height = 150 * icon1AspectRatio; // 150 is the width from icon1Config
  const icon1Config = { x: width * 0.28 + 17, y: height * 0.7, width: 150 };

  if (
    isIconHover(icon1Config.x, icon1Config.y, icon1Config.width, icon1Height)
  ) {
    currentScreen = "level";
  }
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

  // ESC returns to start screen
  if (keyCode === ESCAPE) {
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

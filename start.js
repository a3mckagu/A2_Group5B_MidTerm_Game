// START MENU
// ------------------------------------------------------------
// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawStart() → what the start/menu screen looks like
// 2) input handlers → what happens on click / key press on this screen
// 3) a helper function to draw menu buttons
// ------------------------------------------------------------
// drawStart() is called from main.js only when:
// currentScreen === "start"

function drawStart() {
  // Background colour for the start screen
  background(startBg); // soft teal background

  // Center the logo images on the screen
  imageMode(CENTER);
  image(potionaryLogo, width / 2, height / 2 - 146, 449, 134);
  image(potionaryLogoDetail, width / 2, height / 2 - 76, 155, 30);
  imageMode(CORNER); // Reset to default mode

  // ---- Buttons (data only) ----
  // These objects store the position/size/label for each button.
  // Using objects makes it easy to pass them into drawButton()
  // and also reuse the same information for hover checks.

  textFont("Fraunces");
  textSize(17);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  const startBtn = {
    x: width / 2,
    y: 338, // Andreea changed manually
    w: 190,
    h: 45,
    label: "New Game",
  };

  const instrBtn = {
    x: width / 2,
    y: 390, // Andreea changed manually
    w: 276,
    h: 45,
    label: "Guide",
  };
  const quitBtn = {
    x: width / 2,
    y: 445, // Andreea changed manually
    w: 190,
    h: 45,
    label: "Quit",
  };

  // Draw both buttons
  drawButton(startBtn);
  drawButton(instrBtn);
  drawButton(quitBtn);

  // ---- Cursor feedback ----
  // If the mouse is over either button, show a hand cursor
  // so the player knows it is clickable.
  const over = isHover(startBtn) || isHover(instrBtn) || isHover(quitBtn);
  cursor(over ? HAND : ARROW);
}

// ------------------------------------------------------------
// Mouse input for the start screen.
// ------------------------------------------------------------
// Called from main.js only when currentScreen === "start"
function startMousePressed() {
  // For input checks, we only need x,y,w,h (label is optional)
  const startBtn = { x: width / 2, y: 338, w: 190, h: 45 };
  const instrBtn = { x: width / 2, y: 390, w: 276, h: 45 };
  const quitBtn = { x: width / 2, y: 445, w: 190, h: 45 };

  // If START is clicked, go to the map screen
  if (isHover(startBtn)) {
    currentScreen = "map";
  }
  // If GUIDE is clicked, go to the instructions screen
  else if (isHover(instrBtn)) {
    currentScreen = "instr";
  } else if (isHover(quitBtn)) {
    window.close();
  }
}

// ------------------------------------------------------------
// Keyboard input for the start screen
// ------------------------------------------------------------
// Provides keyboard shortcuts:
// - ENTER starts the game
// - I opens instructions
function startKeyPressed() {
  if (keyCode === ENTER) {
    currentScreen = "map";
  }

  if (key === "g" || key === "G") {
    currentScreen = "instr";
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

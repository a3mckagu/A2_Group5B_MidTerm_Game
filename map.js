// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawStart() → what the start/menu screen looks like
// 2) input handlers → what happens on click / key press on this screen
// 3) a helper function to draw menu buttons

// ------------------------------------------------------------
// Start screen visuals
// ------------------------------------------------------------
// drawMap() is called from main.js only when:
// currentScreen === "map"
function drawMap() {
  // Background colour for the start screen
  background(levelMenu); // soft teal background

  // Center the logo images on the screen

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
// Mouse input for the map screen.
// ------------------------------------------------------------
// Called from main.js only when currentScreen === "map"
function mapMousePressed() {
  // For input checks, we only need x,y,w,h (label is optional)
  const startBtn = { x: width / 2, y: 560, w: 290, h: 52 };
  const instrBtn = { x: width / 2, y: 620, w: 290, h: 52 };

  // If START is clicked, go to the map screen
  if (isHover(startBtn)) {
    currentScreen = "level";
  }
  // If INSTRUCTIONS is clicked, go to the instructions screen
  else if (isHover(instrBtn)) {
    currentScreen = "instr";
  } else if (isHover(quitBtn)) {
    currentScreen = "start";
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

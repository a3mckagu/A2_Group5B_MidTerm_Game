// -----------------------------
// LEVEL 1 — Base Structure + Bottle Interactivity
// -----------------------------

// Positions
const cauldronPos = { x: 576, y: 374 }; // center of canvas + offset
const crystalPos = { x: 1002, y: 344 }; // right side
const recipeBookPos = { x: 100, y: 344 }; // left side

// Bottles & shelf
const shelfX = 892; // start x-position for bottles
const shelfY = 150; // y-position for all bottles
const bottleSpacing = 60; // horizontal spacing between bottles

// Sizes
const cauldronSize = { w: 150, h: 120 };
const crystalSize = { w: 60, h: 60 };
const recipeBookSize = { w: 80, h: 80 };
const bottleSize = { w: 50, h: 80 };

class Level {
  constructor({
    cauldronImg,
    recipeBookClosed,
    bottleBlue,
    bottleGreen,
    bottleOrange,
    bottlePurple,
    crystalImg,
  }) {
    this.cauldronImg = cauldronImg;
    this.recipeBookClosed = recipeBookClosed;
    this.crystalImg = crystalImg;
    this.cauldronPos = cauldronPos;

    // Bottles
    this.bottles = [
      {
        img: bottleBlue,
        x: shelfX,
        y: shelfY,
        ...bottleSize,
        startX: shelfX,
        startY: shelfY,
        isSelected: false,
        isMoving: false,
        progress: 0,
      },
      {
        img: bottleGreen,
        x: shelfX + 1 * bottleSpacing,
        y: shelfY,
        ...bottleSize,
        startX: shelfX + 1 * bottleSpacing,
        startY: shelfY,
        isSelected: false,
        isMoving: false,
        progress: 0,
      },
      {
        img: bottleOrange,
        x: shelfX + 2 * bottleSpacing,
        y: shelfY,
        ...bottleSize,
        startX: shelfX + 2 * bottleSpacing,
        startY: shelfY,
        isSelected: false,
        isMoving: false,
        progress: 0,
      },
      {
        img: bottlePurple,
        x: shelfX + 3 * bottleSpacing,
        y: shelfY,
        ...bottleSize,
        startX: shelfX + 3 * bottleSpacing,
        startY: shelfY,
        isSelected: false,
        isMoving: false,
        progress: 0,
      },
    ];

    this.selectedBottle = null;
  }

  // Draw everything
  draw() {
    background(20);
    imageMode(CENTER);

    // Cauldron
    image(
      this.cauldronImg,
      cauldronPos.x,
      cauldronPos.y,
      cauldronSize.w,
      cauldronSize.h,
    );

    // Recipe book
    image(
      this.recipeBookClosed,
      recipeBookPos.x,
      recipeBookPos.y,
      recipeBookSize.w,
      recipeBookSize.h,
    );

    // Crystal
    image(
      this.crystalImg,
      crystalPos.x,
      crystalPos.y,
      crystalSize.w,
      crystalSize.h,
    );

    // Bottles + animation
    this.bottles.forEach((b) => {
      // Animate if moving
      if (b.isMoving) {
        const targetX = this.cauldronPos.x;
        const targetY = this.cauldronPos.y;

        b.progress += 0.05; // adjust speed
        if (b.progress < 1) {
          // move to cauldron
          b.x = lerp(b.startX, targetX, b.progress);
          b.y = lerp(b.startY, targetY, b.progress);
        } else if (b.progress < 2) {
          // move back to start
          const backProgress = b.progress - 1;
          b.x = lerp(targetX, b.startX, backProgress);
          b.y = lerp(targetY, b.startY, backProgress);
        } else {
          // done
          b.isMoving = false;
          b.isSelected = false;
          b.progress = 0;
          b.x = b.startX;
          b.y = b.startY;
        }
      }

      // Draw bottle
      image(b.img, b.x, b.y, b.w, b.h);

      // Draw selection highlight if selected
      if (b.isSelected) {
        stroke(255, 255, 0);
        strokeWeight(3);
        noFill();
        rect(b.x, b.y, b.w + 10, b.h + 10);
      }
    });
    imageMode(CORNER);
  }

  // Select bottle when clicked
  selectBottle(mx, my) {
    this.bottles.forEach((b) => {
      const halfW = b.w / 2;
      const halfH = b.h / 2;
      if (
        mx > b.x - halfW &&
        mx < b.x + halfW &&
        my > b.y - halfH &&
        my < b.y + halfH
      ) {
        this.selectedBottle = b;
        b.isSelected = true;
      } else {
        b.isSelected = false;
      }
    });
  }

  // Pour selected bottle
  pourSelectedBottle() {
    if (this.selectedBottle && !this.selectedBottle.isMoving) {
      this.selectedBottle.isMoving = true;
      this.selectedBottle.progress = 0;
    }
  }
}

// ------------------------------------------------------------
// Level screen functions
// ------------------------------------------------------------
function drawLevel() {
  if (levelInstance) {
    levelInstance.draw();
  } else {
    background(50);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Level not loaded!", width / 2, height / 2);
  }
}

// function levelMousePressed() {
//   if (levelInstance) {
//     // Click a bottle
//     levelInstance.selectBottle(mouseX, mouseY);

//     // Click cauldron
//     const c = levelInstance.cauldronPos;
//     const cauldronRadius = 75; // approx half width
//     if (dist(mouseX, mouseY, c.x, c.y) < cauldronRadius) {
//       levelInstance.pourSelectedBottle();
//     }
//   }
// }

function levelMousePressed() {
  console.log("Mouse pressed at", mouseX, mouseY);
  if (levelInstance) {
    levelInstance.selectBottle(mouseX, mouseY);
    console.log("Selected bottle:", levelInstance.selectedBottle?.img);

    const c = levelInstance.cauldronPos;
    if (dist(mouseX, mouseY, c.x, c.y) < 75) {
      console.log("Cauldron clicked!");
      levelInstance.pourSelectedBottle();
    }
  }
}

function levelKeyPressed() {}

// -----------------------------------------
// LEVEL 1 — Basic Structure + Interactivity
// -----------------------------------------

const BASE_WIDTH = 1152;
const BASE_HEIGHT = 648;

// Layout (easy to tweak later)
const layout = {
  cauldron: { x: 576, y: 480, w: 300 },
  recipeBook: { x: 190, y: 530, w: 100 },
  crystal: { x: 900, y: 455, w: 50 },
  orderSheet: { x: 970, y: 150, w: 150 },
  bowl: { x: 900, y: 500, w: 140 },

  shelf: {
    x: 120, // starting X position of the first bottle on the shelf
    y: 132, // Y position for all bottles on the shelf
    spacing: 80, // horizontal distance between consecutive bottles
    bottleWidth: 38, // width of each bottle
  },
};

class Level {
  constructor(assets) {
    this.assets = assets;

    // Bottles
    this.bottles = [];
    const bottleImages = [
      assets.bottleGreen,
      assets.bottleRed,
      assets.bottleBlue,
      assets.bottleOrange,
      assets.bottlePink,
    ];

    const maxPerRow = 3; // max bottles per row
    bottleImages.forEach((img, i) => {
      const bottleWidth = layout.shelf.bottleWidth;
      const bottleHeight = (img.height / img.width) * bottleWidth;

      const row = Math.floor(i / maxPerRow);
      const col = i % maxPerRow;

      const x = layout.shelf.x + col * layout.shelf.spacing;
      const y = layout.shelf.y + row * (bottleHeight + 20); // 20 = vertical spacing between rows

      this.bottles.push({
        img,
        x,
        y,
        startX: x,
        startY: y,
        isSelected: false,
        isMoving: false,
        progress: 0,
      });
    });

    this.selectedBottle = null;
  }

  draw() {
    // Background
    imageMode(CORNER);
    image(this.assets.levelBg, 0, 0, BASE_WIDTH, BASE_HEIGHT);
    imageMode(CENTER);

    // ---- ORDER SHEET ----
    const o = layout.orderSheet;
    const oHeight =
      (this.assets.orderSheet.height / this.assets.orderSheet.width) * o.w;
    image(this.assets.orderSheet, o.x, o.y, o.w, oHeight);

    // ---- CAULDRON ----
    const c = layout.cauldron;
    const cHeight =
      (this.assets.cauldronImg.height / this.assets.cauldronImg.width) * c.w;

    image(this.assets.cauldronImg, c.x, c.y, c.w, cHeight);

    // ---- RECIPE BOOK CLOSED ----
    const r = layout.recipeBook;
    const rHeight =
      (this.assets.recipeBookClosed.height /
        this.assets.recipeBookClosed.width) *
      r.w;

    image(this.assets.recipeBookClosed, r.x, r.y, r.w, rHeight);

    // ---- BOWL ----
    const b = layout.bowl;
    const bHeight =
      (this.assets.bowlImg.height / this.assets.bowlImg.width) * b.w;
    image(this.assets.bowlImg, b.x, b.y, b.w, bHeight);

    // ---- CRYSTAL ----
    const cr = layout.crystal;
    const crHeight =
      (this.assets.crystalImg.height / this.assets.crystalImg.width) * cr.w;

    image(this.assets.crystalImg, cr.x, cr.y, cr.w, crHeight);

    // ---- BOTTLES ----
    this.bottles.forEach((b) => {
      if (b.isMoving) {
        const targetX = layout.cauldron.x - 20;
        const targetY = layout.cauldron.y - 160;

        const speed = 0.02;
        b.progress += speed;

        if (b.progress < 1) {
          b.x = lerp(b.startX, targetX, b.progress);
          b.y = lerp(b.startY, targetY, b.progress);
        } else if (b.progress < 1.5) {
          b.x = targetX;
          b.y = targetY;
        } else if (b.progress < 2.5) {
          const back = (b.progress - 1.5) / 1;
          b.x = lerp(targetX, b.startX, back);
          b.y = lerp(targetY, b.startY, back);
        } else {
          b.isMoving = false;
          b.isSelected = false;
          b.progress = 0;
          b.x = b.startX;
          b.y = b.startY;
        }
      }

      const bottleWidth = layout.shelf.bottleWidth;
      const bottleHeight = (b.img.height / b.img.width) * bottleWidth;

      push();
      translate(b.x, b.y);

      let angle = 0;
      if (b.isMoving && b.progress >= 0.5 && b.progress < 2) {
        angle = PI / 2.5;
      }

      rotate(angle);

      // ---- Selection Outline (slightly rounded rectangle) ----
      if (b.isSelected) {
        noFill();
        stroke(255); // white outline
        strokeWeight(2); // thickness
        rectMode(CENTER);
        rect(0, 0, bottleWidth + 10, bottleHeight + 10, 8); // 8 = corner radius
      }

      // ---- Draw the bottle ----
      noStroke();
      image(b.img, 0, 0, bottleWidth, bottleHeight);

      pop();
    });
  }

  selectBottle(mx, my) {
    this.bottles.forEach((b) => {
      const w = layout.shelf.bottleWidth;
      const h = (b.img.height / b.img.width) * w;

      if (
        mx > b.x - w / 2 &&
        mx < b.x + w / 2 &&
        my > b.y - h / 2 &&
        my < b.y + h / 2
      ) {
        this.selectedBottle = b;
        b.isSelected = true;
      } else {
        b.isSelected = false;
      }
    });
  }

  pourSelectedBottle() {
    if (this.selectedBottle && !this.selectedBottle.isMoving) {
      this.selectedBottle.isMoving = true;
      this.selectedBottle.progress = 0;
    }
  }
}

// -----------------------------
// DRAW WRAPPER (scaling system)
// -----------------------------
function drawLevel() {
  background(0);

  if (!levelInstance) return;

  const scaleFactor = min(width / BASE_WIDTH, height / BASE_HEIGHT);

  const offsetX = (width - BASE_WIDTH * scaleFactor) / 2;
  const offsetY = (height - BASE_HEIGHT * scaleFactor) / 2;

  push();
  translate(offsetX, offsetY);
  scale(scaleFactor);

  levelInstance.draw();

  pop();
}

function levelMousePressed() {
  if (!levelInstance) return;

  const scaleFactor = min(width / BASE_WIDTH, height / BASE_HEIGHT);

  const offsetX = (width - BASE_WIDTH * scaleFactor) / 2;
  const offsetY = (height - BASE_HEIGHT * scaleFactor) / 2;

  const adjustedX = (mouseX - offsetX) / scaleFactor;
  const adjustedY = (mouseY - offsetY) / scaleFactor;

  levelInstance.selectBottle(adjustedX, adjustedY);

  // ---- CAULDRON CLICK ----
  const c = layout.cauldron;
  const cWidth = c.w;
  const cHeight =
    (levelInstance.assets.cauldronImg.height /
      levelInstance.assets.cauldronImg.width) *
    c.w;

  if (
    adjustedX > c.x - cWidth / 2 &&
    adjustedX < c.x + cWidth / 2 &&
    adjustedY > c.y - cHeight / 2 &&
    adjustedY < c.y + cHeight / 2
  ) {
    levelInstance.pourSelectedBottle();
  }
}

function levelKeyPressed() {}

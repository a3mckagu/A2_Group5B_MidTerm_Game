// results.js — Result overlay screens for level outcomes
// Drawn inside the BASE_WIDTH / BASE_HEIGHT coordinate space,
// called from within levelInstance.draw() after the game layer.
//
// Three result types matching levelInstance.levelResult:
//   "CORRECT"  → Well Brewed!    (green banner)
//   "WRONG"    → Wrong Potion!   (red banner)
//   "TIMEOUT"  → Too Slow!       (navy banner, yellow heading)
//
// Fonts used:
//   Manufacturing Consent — headings
//   IM Fell English       — quote body + attribution
//   VT323                 — status label + button

const Results = {
  // ── Button rects in BASE coords (set each draw, read in mousePressed) ──
  _playAgainBtn: { x: 0, y: 0, w: 0, h: 0 },
  _backToMapBtn: { x: 0, y: 0, w: 0, h: 0 },

  // ── Unfurl animation state ──
  _unfurlStart: null, // millis() when current result was first drawn
  _lastResult: null, // track result changes to reset animation

  // ── Public draw entry point ──
  // Call this from inside the scaled push()/pop() block in drawLevel(),
  // after levelInstance.draw().
  draw: function (type) {
    if (!type) return;

    // Reset animation when result type changes
    if (type !== Results._lastResult) {
      Results._unfurlStart = millis();
      Results._lastResult = type;
    }

    const elapsed = millis() - Results._unfurlStart;
    const UNFURL_MS = 650; // total unfurl duration
    // Eased 0→1 progress for clip reveal
    const rawP = constrain(elapsed / UNFURL_MS, 0, 1);
    const progress = 1 - pow(1 - rawP, 3); // ease-out cubic

    const cx = BASE_WIDTH / 2;

    // ── Dim ──
    push();
    noStroke();
    // slightly increased dimming from 140 -> 170 for better focus
    fill(0, map(progress, 0, 1, 0, 160));
    rectMode(CORNER);
    rect(0, 0, BASE_WIDTH, BASE_HEIGHT);
    pop();

    // ── Colour palette per result ──
    let faceHi, faceLo, rodCol, trimCol, innerBorder;
    let headingCol, statusCol, bodyCol, attrCol, btnBorderCol, btnTextCol;
    let headingText, statusText, quoteText, attrText, btnLabel;

    if (type === "CORRECT") {
      faceHi = color(0, 59, 1); // #003B01
      faceLo = color(0, 59, 1); // #003B01 (uniform full face color)
      rodCol = color(42, 24, 8);
      trimCol = color(200, 160, 48);
      innerBorder = color(10, 42, 10);
      headingCol = color(160, 240, 128);
      statusCol = color(120, 200, 96);
      bodyCol = color(216, 240, 208);
      attrCol = color(144, 192, 128);
      btnBorderCol = color(112, 192, 80);
      btnTextCol = color(160, 240, 128);
      headingText = "Well Brewed!";
      statusText = "ORDER FULFILLED";
      quoteText =
        "Remarkable! I can already feel the odds\nshifting in my favour. You have a gift.";
      attrText = "\u2014 Lord Alistair, unusually pleased";
      // Level-specific overrides
      if (
        typeof levelInstance !== "undefined" &&
        levelInstance.levelNumber === 2
      ) {
        quoteText =
          "At last! Prince Dorian won't know what hit him...\nI must clear my schedule, I have bridal fittings to arrange!";
        attrText = "\u2014 Lady Beaumont, beaming with joy (and delusion)";
      }
      btnLabel = "PLAY AGAIN";
    } else if (type === "WRONG") {
      faceHi = color(68, 0, 0); // #440000
      faceLo = color(68, 0, 0); // #440000 (uniform full face color)
      rodCol = color(42, 24, 8);
      trimCol = color(200, 160, 48);
      innerBorder = color(49, 0, 0); // #310000
      headingCol = color(255, 224, 224);
      statusCol = color(240, 144, 144);
      bodyCol = color(248, 232, 232);
      attrCol = color(192, 152, 152);
      btnBorderCol = color(224, 112, 112);
      btnTextCol = color(255, 224, 224);
      headingText = "Wrong Potion!";
      statusText = "ORDER FAILED";
      quoteText =
        "This smells nothing like Beginner's Luck!\nI asked for fortune, not a biohazard.";
      attrText = "\u2014 Lord Alistair, deeply unimpressed";
      if (
        typeof levelInstance !== "undefined" &&
        levelInstance.levelNumber === 2
      ) {
        quoteText =
          "This is NOT Sparks Fly! How am I supposed to win\nPrince Dorian's heart with this sludge?!";
        attrText = "\u2014 Lady Beaumont, beside herself";
      }
      btnLabel = "TRY AGAIN";
    } else {
      // TIMEOUT
      faceHi = color(34, 7, 80); // #220750
      faceLo = color(34, 7, 80); // #220750 (uniform full face color)
      rodCol = color(42, 24, 8);
      trimCol = color(200, 160, 48);
      innerBorder = color(10, 12, 40);
      headingCol = color(232, 216, 64);
      statusCol = color(192, 176, 48);
      bodyCol = color(216, 224, 248);
      attrCol = color(152, 152, 200);
      btnBorderCol = color(200, 184, 32);
      btnTextCol = color(232, 216, 64);
      headingText = "Too Slow!";
      statusText = "ORDER CANCELLED";
      quoteText =
        "I am a lord, not a patient man.\nMy luck won't wait forever and neither shall I.";
      attrText = "\u2014 Lord Alistair, already halfway out the door";
      if (
        typeof levelInstance !== "undefined" &&
        levelInstance.levelNumber === 2
      ) {
        quoteText =
          "Every second without this potion is a second\nPrince Dorian slips further from my grasp!";
        attrText = "\u2014 Lady Beaumont, spiralling";
      }
      btnLabel = "TRY AGAIN";
    }

    // ── Banner dimensions ──
    const BW = 580; // banner width
    const BH = type === "CORRECT" ? 320 : 368; // banner height (body only, excluding rod)
    const ROD_H = 18;
    const ROD_Y = 20; // rod centre Y (from banner top)
    const BODY_TOP = ROD_Y + 12; // where fabric starts
    const POINT_H = 44; // depth of pointed bottom
    const bx = cx - BW / 2; // banner left edge

    // Total SVG height including rod area
    const totalH = ROD_Y + ROD_H / 2 + BH + POINT_H + 10;

    // Unfurl: clip from top, revealing downward
    const revealH = totalH * progress;

    // Banner draws slightly higher than the top of the screen
    const BANNER_SHIFT = -18; // move banner up by 18px
    const bannerTopY = BANNER_SHIFT;

    push();
    // Clip to revealed region only
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(0, bannerTopY, BASE_WIDTH, revealH);
    drawingContext.clip();

    Results._drawBanner({
      cx,
      bx,
      BW,
      BH,
      ROD_Y: ROD_Y + BANNER_SHIFT,
      ROD_H,
      BODY_TOP: BODY_TOP + BANNER_SHIFT,
      POINT_H,
      faceHi,
      faceLo,
      rodCol,
      trimCol,
      innerBorder,
      progress,
      resultType: type,
    });

    // ── Text (fades in after banner is mostly revealed) ──
    const textFade = constrain(map(progress, 0.55, 1.0, 0, 1), 0, 1);
    if (textFade > 0) {
      Results._drawText({
        cx,
        BW,
        BODY_TOP: BODY_TOP + BANNER_SHIFT,
        BH,
        headingText,
        statusText,
        quoteText,
        attrText,
        btnLabel,
        headingCol,
        statusCol,
        bodyCol,
        attrCol,
        btnBorderCol,
        btnTextCol,
        trimCol,
        innerBorder,
        textFade,
        resultType: type,
      });
    }

    drawingContext.restore();
    pop();

    // no Back-to-Start button
  },

  // ── Draw the banner shape (rod + fabric + point) ──
  _drawBanner: function ({
    cx,
    bx,
    BW,
    BH,
    ROD_Y,
    ROD_H,
    BODY_TOP,
    POINT_H,
    faceHi,
    faceLo,
    rodCol,
    trimCol,
    innerBorder,
    resultType,
  }) {
    const GOLD_INSET = 10; // gold border inset from fabric edge
    const FACE_INSET = 18; // face inset from fabric edge
    const INNER_INSET = 26; // inner border inset from fabric edge

    // ── Gold outer border ──
    push();
    noStroke();
    fill(trimCol);
    beginShape();
    vertex(bx, BODY_TOP); // top-left
    vertex(bx + BW, BODY_TOP); // top-right
    vertex(bx + BW, BODY_TOP + BH); // bottom-right
    vertex(cx, BODY_TOP + BH + POINT_H); // bottom point
    vertex(bx, BODY_TOP + BH); // bottom-left
    endShape(CLOSE);
    pop();

    // ── Fabric face — pentagon matching gold border shape, inset by GOLD_INSET ──
    push();
    noStroke();
    const faceTopY = BODY_TOP + GOLD_INSET;
    const faceBottomY = BODY_TOP + BH - GOLD_INSET;
    const facePointY = BODY_TOP + BH + POINT_H - GOLD_INSET; // inset point
    const faceMidY = faceTopY + (faceBottomY - faceTopY) / 2;
    const faceL = bx + GOLD_INSET;
    const faceR = bx + BW - GOLD_INSET;

    // Full face shape (darker colour) — rectangle + inset point
    fill(faceLo);
    beginShape();
    vertex(faceL, faceTopY); // top-left
    vertex(faceR, faceTopY); // top-right
    vertex(faceR, faceBottomY); // bottom-right
    vertex(cx, facePointY); // bottom point
    vertex(faceL, faceBottomY); // bottom-left
    endShape(CLOSE);

    // No top-half overlay: fabric face is a single inset shape matching gold trim
    pop();

    // ── Inner border line (inset shape matching gold outer border) ──
    push();
    stroke(innerBorder);
    strokeWeight(2);
    noFill();
    const ibLeft = bx + INNER_INSET;
    const ibRight = bx + BW - INNER_INSET;
    const ibTopY = BODY_TOP + INNER_INSET;
    const ibBottomY = BODY_TOP + BH - INNER_INSET;
    const ibPointY = BODY_TOP + BH + POINT_H - INNER_INSET;
    beginShape();
    vertex(ibLeft, ibTopY); // top-left
    vertex(ibRight, ibTopY); // top-right
    vertex(ibRight, ibBottomY); // bottom-right
    vertex(cx, ibPointY); // bottom point
    vertex(ibLeft, ibBottomY); // bottom-left
    endShape(CLOSE);
    pop();

    // ── Gold top trim bar (covers top of fabric) ──
    push();
    noStroke();
    fill(trimCol);
    rectMode(CORNER);
    rect(bx, BODY_TOP - 6, BW, GOLD_INSET + 6);
    pop();

    // ── Rod ──
    push();
    noStroke();
    // rod body
    fill(rodCol);
    rectMode(CENTER);
    rect(cx, ROD_Y, BW + 40, ROD_H, ROD_H / 2);
    // rod highlight
    fill(80, 50, 20, 120);
    rect(cx, ROD_Y - 3, BW + 40, ROD_H / 2, ROD_H / 4);
    // left finial
    fill(rodCol);
    circle(bx - 20, ROD_Y, 28);
    fill(60, 38, 14, 160);
    circle(bx - 24, ROD_Y - 5, 10);
    // right finial
    fill(rodCol);
    circle(bx + BW + 20, ROD_Y, 28);
    fill(60, 38, 14, 160);
    circle(bx + BW + 16, ROD_Y - 5, 10);
    pop();

    // ── Fabric loops (5 evenly spaced) ──
    push();
    noStroke();
    const loopPositions = [0.18, 0.32, 0.5, 0.68, 0.82];
    // center loop rects around the banner center (use CENTER mode)
    rectMode(CENTER);
    loopPositions.forEach((t) => {
      const lx = bx + BW * t; // center x for each loop
      // loop body (centered vertically at ROD_Y)
      fill(red(trimCol) * 0.75, green(trimCol) * 0.75, blue(trimCol) * 0.75);
      rect(lx, ROD_Y, 18, 22, 4);
      // loop shadow below (centered)
      fill(red(trimCol) * 0.5, green(trimCol) * 0.5, blue(trimCol) * 0.5);
      rect(lx, ROD_Y + 8, 18, 8, 2);
    });
    // restore default rectMode via pop()
    pop();
  },

  // ── Draw text content over the banner ──
  _drawText: function ({
    cx,
    BW,
    BODY_TOP,
    BH,
    headingText,
    statusText,
    quoteText,
    attrText,
    btnLabel,
    headingCol,
    statusCol,
    bodyCol,
    attrCol,
    btnBorderCol,
    btnTextCol,
    trimCol,
    innerBorder,
    textFade,
    resultType,
  }) {
    const alpha = textFade * 255;
    const textAreaTop = BODY_TOP + 36;

    push();
    textAlign(CENTER, TOP);

    // ── Heading ── (use gold trim color)
    textFont(FONT_MANUFACTURING_CONSENT);
    textSize(46);
    fill(red(trimCol), green(trimCol), blue(trimCol), alpha);
    noStroke();
    let y = textAreaTop + 8;
    text(headingText, cx, y);

    // ── Status ── (use gold trim color)
    // nudged slightly lower so it sits directly below the heading
    y += 46;
    textFont(FONT_VT323);
    textSize(18);
    fill(red(trimCol), green(trimCol), blue(trimCol), alpha * 0.9);
    text(statusText, cx, y);

    // ── Ornament divider ── (use inner border color)
    // moved slightly lower
    y += 32;
    stroke(
      red(innerBorder),
      green(innerBorder),
      blue(innerBorder),
      alpha * 0.45,
    );
    strokeWeight(1);
    line(cx - BW * 0.3, y, cx + BW * 0.3, y);
    noStroke();

    // ── Quote ── (use #F5F5F5)
    // moved slightly lower
    y += 30;
    textFont(FONT_IM_FELL_ENGLISH);
    textStyle(ITALIC);
    textSize(17);
    fill(245, 245, 245, alpha);
    text(quoteText, cx, y);
    textStyle(NORMAL);

    // ── Attribution ── (use #F5F5F5)
    // move a bit higher and use slightly larger text
    y += 50;
    textSize(14);
    textAlign(CENTER, TOP);
    fill(245, 245, 245, alpha * 0.85);
    text(attrText, cx, y);

    // ── Buttons ──
    const btnW = 200;
    const btnH = 36;
    const btnPadding = 15;
    const attributionToButtonGap = 44;
    const bottomButtonMargin = 38;

    // Determine which buttons to show based on result type
    const showPlayAgain = resultType !== "CORRECT";
    const showBackToMap = true; // always show

    // Calculate button positions
    let btnY1, btnY2;
    const firstButtonY = y + attributionToButtonGap;
    if (showPlayAgain && showBackToMap) {
      btnY1 = firstButtonY;
      btnY2 = BODY_TOP + BH - bottomButtonMargin - btnH;
    } else if (showBackToMap) {
      btnY2 = BODY_TOP + BH - bottomButtonMargin - btnH;
    }

    const btnX = cx - btnW / 2;

    // Helper function to draw a button
    const drawButton = (
      btnX,
      btnY,
      btnW,
      btnH,
      btnText,
      trimCol,
      innerBorder,
    ) => {
      // Detect hover in BASE coordinates
      let isBtnHovered = false;
      if (typeof getScaleAndOffset === "function") {
        const { scaleFactor, offsetX, offsetY } = getScaleAndOffset();
        const adjustedMX = (mouseX - offsetX) / scaleFactor;
        const adjustedMY = (mouseY - offsetY) / scaleFactor;
        isBtnHovered =
          adjustedMX >= btnX &&
          adjustedMX <= btnX + btnW &&
          adjustedMY >= btnY &&
          adjustedMY <= btnY + btnH;
      }

      stroke(red(trimCol), green(trimCol), blue(trimCol), alpha * 0.7);
      strokeWeight(1);
      // Lighten the button fill when hovered
      const lightenAmount = isBtnHovered ? 20 : 0;
      const br = min(255, red(trimCol) + lightenAmount);
      const bg = min(255, green(trimCol) + lightenAmount);
      const bb = min(255, blue(trimCol) + lightenAmount);
      fill(br, bg, bb, alpha * 0.95);
      rectMode(CORNER);
      rect(btnX, btnY, btnW, btnH, 4);

      noStroke();
      // Slightly adjust button text color on hover for contrast
      const textDarken = isBtnHovered ? -10 : 0;
      const tr = constrain(red(innerBorder) + textDarken, 0, 255);
      const tg = constrain(green(innerBorder) + textDarken, 0, 255);
      const tb = constrain(blue(innerBorder) + textDarken, 0, 255);
      fill(tr, tg, tb, alpha);
      textFont(FONT_VT323);
      textSize(24);
      textAlign(CENTER, CENTER);
      text(btnText, cx, btnY + btnH / 2);
    };

    // Draw Play Again / Try Again button if not CORRECT
    if (showPlayAgain) {
      Results._playAgainBtn = { x: btnX, y: btnY1, w: btnW, h: btnH };
      drawButton(btnX, btnY1, btnW, btnH, btnLabel, trimCol, innerBorder);
    } else {
      Results._playAgainBtn = { x: 0, y: 0, w: 0, h: 0 }; // disable
    }

    // Draw Back To Map button (always)
    Results._backToMapBtn = { x: btnX, y: btnY2, w: btnW, h: btnH };
    drawButton(btnX, btnY2, btnW, btnH, "BACK TO MAP", trimCol, innerBorder);

    pop();
  },

  // ── Back to Start button below the banner point ──
  // Back button removed — results panel uses only Play Again

  // ── Mouse handler ──
  // Call from levelMousePressed() when levelInstance.levelResult is set.
  // mx / my are already in BASE coords (divide out scale/offset before calling).
  mousePressed: function (mx, my) {
    const pa = Results._playAgainBtn;
    const ba = Results._backToMapBtn;

    // Play Again / Try Again
    // Primary hit-test uses the provided mx/my (BASE coords). As a fallback,
    // also test the actual global mouse position converted to BASE coords
    // in case callers passed inconsistent coordinates (protects Level 3).
    const {
      scaleFactor: _sf,
      offsetX: _ox,
      offsetY: _oy,
    } = typeof getScaleAndOffset === "function"
      ? getScaleAndOffset()
      : { scaleFactor: 1, offsetX: 0, offsetY: 0 };
    const rawMX = typeof mouseX !== "undefined" ? (mouseX - _ox) / _sf : mx;
    const rawMY = typeof mouseY !== "undefined" ? (mouseY - _oy) / _sf : my;

    const playedClicked =
      pa.w > 0 &&
      ((mx >= pa.x && mx <= pa.x + pa.w && my >= pa.y && my <= pa.y + pa.h) ||
        (rawMX >= pa.x &&
          rawMX <= pa.x + pa.w &&
          rawMY >= pa.y &&
          rawMY <= pa.y + pa.h));

    if (playedClicked) {
      // Reset the results animation state
      Results._unfurlStart = null;
      Results._lastResult = null;

      // Use the central helper to recreate the level instance and switch
      // screens to ensure assets are attached consistently.
      jumpToLevel(currentLevelNumber);
      return;
    }

    // Back To Map
    if (mx >= ba.x && mx <= ba.x + ba.w && my >= ba.y && my <= ba.y + ba.h) {
      // Increment level counter if the player completed the level
      if (Results._lastResult === "CORRECT") {
        currentLevelNumber++;
      }
      // Reset the results animation state
      Results._unfurlStart = null;
      Results._lastResult = null;
      // Switch to map screen
      currentScreen = "map";
      return;
    }
  },

  // Reset animation state (call if you want a fresh unfurl on next show)
  reset: function () {
    Results._unfurlStart = null;
    Results._lastResult = null;
  },
};

window.Results = Results;

let movingBtn;
let btnWidth = 80;
let btnHeight = 36;
let btnFill = "white";
let btnTextFill = "black";
let btnTextSize = 16;
let bgColor = 220;

let clickCount = 0;
let misclickCount = 0;
let lastClickDate = new Date().getTime(); // Time at which button was last clicked
let lastClickTime = 0; // Time taken to click button in milliseconds
let clickData = []; // Array to store click data
let initialCursorX, initialCursorY; // Stores initial cursor position when button appears

function setup() {
  createCanvas(windowWidth, windowHeight);
  movingBtn = new Button("Click me!", (width-btnWidth)/2, (height-btnHeight)/2, btnWidth, btnHeight, moveButton);

  let exportBtn = createButton("Export Data");
  exportBtn.position(20, 20);
  exportBtn.mousePressed(exportData);
}

function keyPressed() {
  if (key === '=' || key === '+') {
    movingBtn.w = min(movingBtn.w * Math.sqrt(2), 320); // Ensure a maximum width of 320
    movingBtn.h = min(movingBtn.h * Math.sqrt(2), 144); // Ensure a maximum height of 144
    btnTextSize = min(btnTextSize * Math.sqrt(2), 64);  // Ensure a maximum text size of 64
  } else if (key === '-' || key === '_') {
    movingBtn.w = max(movingBtn.w / Math.sqrt(2), 20);  // Ensure a minimum width of 20
    movingBtn.h = max(movingBtn.h / Math.sqrt(2), 9);   // Ensure a minimum height of 9
    btnTextSize = max(btnTextSize / Math.sqrt(2), 4);   // Ensure a minimum text size of 4
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Keep button within canvas
  movingBtn.x = min(movingBtn.x, windowWidth - movingBtn.w);
  movingBtn.y = min(movingBtn.y, windowHeight - movingBtn.h);
}

class Button {
  constructor(t="Button", x=0, y=0, w=50, h=36, clickAction=undefined) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.btnFill = btnFill;
    this.btnTextFill = btnTextFill;
    this.clickAction = clickAction;
  }
  show() {
    fill(this.btnFill);
    rect(this.x, this.y, this.w, this.h);
    fill(this.btnTextFill);
    textAlign(CENTER, CENTER);
    textSize(btnTextSize);
    text(this.t, this.x, this.y, this.w, this.h);
  }
  onClick() {
    this.btnFill = "lightgreen";
    if(this.clickAction) {
      this.clickAction();
    }
  }
}

function moveButton() {
  this.x = round(Math.random() * (width - this.w));
  this.y = round(Math.random() * (height - this.h));
  
  // Store initial cursor position when the button moves
  initialCursorX = mouseX;
  initialCursorY = mouseY;
}

function checkClick(btn) {
  let buttonCenterX = btn.x + btn.w / 2;
  let buttonCenterY = btn.y + btn.h / 2;

  // Calculate distance from initial cursor position to button center (Fitts' Law distance)
  let movementDistance = dist(initialCursorX, initialCursorY, buttonCenterX, buttonCenterY);

  if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
    clickCount++;
    let date = new Date().getTime();
    lastClickTime = date - lastClickDate;

    clickData.push({
      trial: clickCount,
      buttonSize: { width: btn.w, height: btn.h },
      buttonPosition: { x: btn.x, y: btn.y },
      initialCursorPosition: { x: initialCursorX, y: initialCursorY },
      movementDistance: movementDistance, // Correctly recorded movement distance
      clickTime: lastClickTime
    });
    
    lastClickDate = date;
    btn.onClick();
  }
  else {
    misclickCount++;
  }
}

function draw() {
  background(bgColor);
  let textX = width - 20;
  let textY = 20;
  
  textAlign(RIGHT, CENTER);

  textStyle("bold");
  textSize(16);
  text("Fitts' Law Experiment", textX, textY+=20);
  textStyle("normal");

  text("Canvas size: " + width + "×" + height, textX, textY+=20);
  text("Button size: " + round(movingBtn.w) + "×" + round(movingBtn.h), textX, textY+=20);
  text("Button position: " + movingBtn.x + "," + movingBtn.y, textX, textY+=20);
  text("Mouse position: " + mouseX + "," + mouseY, textX, textY+=20);
  text("Successful clicks: " + clickCount, textX, textY+=20);
  text("Misclicks: " + misclickCount, textX, textY+=20);
  text("Total clicks: " + (clickCount + misclickCount), textX, textY+=20);
  text("Accuracy: " + round(clickCount / max(clickCount + misclickCount, 1) * 100, 2) + "%", textX, textY+=20);
  text("Last click time: " + lastClickTime + "ms", textX, textY+=20);
  text("'-' or '+' keys to change button size", textX, textY+=20);
  movingBtn.show();
}

function mousePressed() {
  checkClick(movingBtn);
}
function mouseReleased() {
  movingBtn.btnFill = btnFill;
}

function exportData() {
  let exportObj = {
    experimentInfo: {
      canvasSize: { width: width, height: height },
      buttonSize: { width: btnWidth, height: btnHeight },
      totalClicks: clickCount + misclickCount,
      successfulClicks: clickCount,
      misclicks: misclickCount,
      accuracy: round((clickCount / max(clickCount + misclickCount, 1)) * 100, 2) + "%"
    },
    clickDetails: clickData
  };

  saveJSON(exportObj, "fitts_law_experiment_data.json");
}

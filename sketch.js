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

function setup() {
  createCanvas(windowWidth, windowHeight);
  movingBtn = new Button("Click me!", (width-btnWidth)/2, (height-btnHeight)/2, btnWidth, btnHeight, moveButton);
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
}

function checkClick(btn) {
  if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
    clickCount++;
    let date = new Date().getTime();
    lastClickTime = date - lastClickDate;
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
  text("Fitts' Law Experiment", textX, textY+=20);
  textStyle("normal");

  text("Canvas size: " + width + "×" + height, textX, textY+=20);
  text("Button size: " + movingBtn.w + "×" + movingBtn.h, textX, textY+=20);
  text("Button position: " + movingBtn.x + "," + movingBtn.y, textX, textY+=20);
  text("Mouse position: " + mouseX + "," + mouseY, textX, textY+=20);
  text("Successful clicks: " + clickCount, textX, textY+=20);
  text("Misclicks: " + misclickCount, textX, textY+=20);
  text("Total clicks: " + (clickCount + misclickCount), textX, textY+=20);
  text("Accuracy: " + round(clickCount / max(clickCount + misclickCount, 1) * 100, 2) + "%", textX, textY+=20);
  text("Last click time: " + lastClickTime + "ms", textX, textY+=20);
  movingBtn.show();
}

function mousePressed() {
  checkClick(movingBtn);
}
function mouseReleased() {
  movingBtn.btnFill = btnFill;
}

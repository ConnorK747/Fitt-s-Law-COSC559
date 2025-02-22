let movingBtn;
let btnFill = "white";
let btnTextFill = "black";
let btnTextSize = 16;
let bgColor = 220;

function setup() {
  createCanvas();
  movingBtn = new Button("Click me!", (width-80)/2, (height-36)/2, 80, 36, moveButton);
}

class Button {
  constructor(t="Button", x=0, y=0, w=50, h=36, clickAction=undefined) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.size = w;
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
  this.x = Math.random() * (width - this.w);
  this.y = Math.random() * (height - this.h);
}

function checkClick(btn) {
  if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
    btn.onClick();
  }
}

function draw() {
  background(bgColor);
  textStyle("bold");
  text("Fitts' Law Experiment", width/2, 20);
  textStyle("normal");
  movingBtn.show();
}

function mousePressed() {
  checkClick(movingBtn);
}
function mouseReleased() {
  movingBtn.btnFill = btnFill;
}

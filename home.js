var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// score
var score = 0;

// ball
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
let storeColor = "";
let fastSpeedX = 0;

// paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

// build brick
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// 碰撞偵測

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                      alert("YOU WIN, CONGRATS!");
                      document.location.reload();
                    }
                    dy = -dy;
                    b.status = 0;
                    changeColor();
                }
            }
        }
    }
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

 // draw ball

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = storeColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function changeColor(){
    storeColor = "rgb(" + Math.floor((Math.random() * 255)) + "," + Math.floor((Math.random() * Math.floor((Math.random() * 255)))) + "," + 55 + ")";
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
  }

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    
    // 碰撞偵測
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = dx + (Math.random() * 2 -1);
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }else if(y + dy > canvas.height-ballRadius) {
        // 在 paddle 範圍內，下方
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = dy + (Math.random() * 1);
            // 定義最大速度
            if(dy > 5) {
                dy = 5;
            }else if(dy < -5){
                dy = -5;
            }
            dy = -dy;
        }
        else {
            clearInterval(drawTimer);
            alert("GAME OVER");
            document.location.reload();;
        }
    }

    // 左右移動
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += Math.floor((Math.random() * 15));
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= Math.floor((Math.random() * 15));
    }

    // 增加速度
    x += dx;
    y += dy;
}

let drawTimer = setInterval(draw, 10);

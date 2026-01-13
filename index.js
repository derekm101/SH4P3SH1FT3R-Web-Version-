
//board "canvas"

let boardWidth = 626;
let boardHeight = 417;

//player

let playerShape = "square";
let playerShapes = ["./squareplayer.png", "./circleplayer.png"]
let playerShapesIndex = 0;
let playerImg = new Image();
playerImg.src = playerShapes[playerShapesIndex];

let heartImg = new Image();
heartImg.src = "heart.png";

let player = {
    width : 60,
    height : 56,
    x : (256-(60/3)),
    y : 240,
    position : boardHeight/1.19,
    jump : 0,
    shape : playerShape,
    health : 3
}

let square = {
    shape : "square",
    attackDmg : 15,
    knockbackDistance : 10,
    dashCount : 0,
    speed : 3
}

let circle = {
    shape : "circle",
    attack : 10,
    knockback : 5,
    speed : 3.5,
}

//background

let backgroundImg = new Image();
backgroundImg.src = "./sewer_background.png"

let background = {
    x : 0,
    y : 0,
    width : 626,
    height : 417,
    speed : 7,
}

//physics

let physics = {
    velocityX : 0,
    velocityY : 0,
    gravity : 0.4,
    applyGravity : true,
    falling : undefined,
    inertia : undefined,
    direction : undefined,
    isCharging : undefined,
}

let physicsE = {
    velocityX : 0,
    velocityY : 0,
    gravity : 0.4,
    applyGravity : true,
    falling : undefined,
    inertia : undefined,
    direction : undefined,
    isCharging : undefined,
}

// enemies

let enemyImage = new Image();
let enemyImageList = ["./enemy/spider.png", "./enemy/critter.png", "./enemy/rat.png", "./enemy/bat.png","./enemy/blob.png", "./enemy/snake.png", "./enemy/opposum.png"];
let enemyImagesIndex = 2;
enemyImage.src = enemyImageList[enemyImagesIndex];

let enemy = {
    x : 400,
    y : 240,
    position : boardHeight/1.19,
    list : ["spider", "critter", "rat", "bat", "blob", "snake", "opposum"],
    spider : {
        index : 0,
        health : 20,
        speed : 3,
        jump : 7,
        width : undefined,
        height : undefined,
    },
    critter : {
        index : 1,
        health : 25,
        speed : 3.5,
        jump : 4,
        width : 34,
        height : 25,
    },
    rat : {
        index : 2,
        health : 30,
        speed : 2,
        jump : 2, 
        width : undefined,
        height : undefined,
    },
    bat : {
        index : 3,
        health : 30,
        speed : 3,
        flight : 4,
        width : undefined,
        height : undefined,
    },
    blob : {
        index : 4,
        health : 20,
        speed : 1,
        width : undefined,
        height : undefined,
    },
    snake : {
        index : 5,
        health : 45,
        speed : 4,
        width : undefined,
        height : undefined,
    },
    opposum : {
        index : 6,
        health : 50,
        speed : 2,
        width : undefined,
        height : undefined,
    }
}

//onload

window.onload = function() {
    const board = document.getElementById("board");
    context = board.getContext("2d");
    board.height = boardHeight;
    board.width = boardWidth;

    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keydown", playerSpecificMoves);
    document.addEventListener("keydown", playerState);

    requestAnimationFrame(update);
}

function update() {
    requestAnimationFrame(update);
    
    context.clearRect(0, 0, board.width, board.height);

    //player motion
    if (physics.applyGravity) physics.velocityY += physics.gravity;

    context.drawImage(backgroundImg, background.x, background.y);
    context.drawImage(backgroundImg, (background.x + background.width) - (background.speed + 1), background.y);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    context.drawImage(heartImg, 5, 5, 31, 32);
    context.drawImage(heartImg, 40, 5, 31, 32);
    context.drawImage(heartImg, 75, 5, 31, 32);

    //player collisions
    function playerCollisions() {
        player.y = Math.max(player.y + physics.velocityY, 65)
        player.y = Math.min(player.y - physics.gravity, ((player.position) - player.height))
        player.x = Math.max(player.x + physics.velocityX, 0.5)
        player.x = Math.min(player.x + physics.velocityX, (boardWidth - player.width))
    }

    playerCollisions();
    applyInertia();
    moveScreen();
    
    physicsE.velocityY += physicsE.gravity

    context.drawImage(enemyImage, enemy.x, enemy.y, enemy.critter.width, enemy.critter.height);


    function enemyCollisions() {
        enemy.y = Math.max(enemy.y + physicsE.velocityY, 65)
        enemy.y = Math.min(enemy.y - physicsE.gravity, ((enemy.position) - enemy.critter.height))
        enemy.x = Math.max(enemy.x + physicsE.velocityX, 0.5)
        enemy.x = Math.min(enemy.x + physicsE.velocityX, (boardWidth - enemy.critter.width))
    }
 

    enemyCollisions();

    //velocity
    context.fillStyle = "white";
    context.font = "35px monospace";
    context.fillText(physics.velocityX.toFixed(2), 5, 410);
    context.fillText(playerShape, 500, 408);
} 

function moveScreen() {
    if (physics.velocityX > 0 && physics.velocityX <= 3.5) {
        background.x -= background.speed
    } else if (physics.velocityX < 0 && physics.velocityX >= -3.5) {
        background.x -= background.speed/1.5
    } else if (physics.velocityX === 0 && !physics.isCharging) {
        return;
    } else if (physics.velocityX === 0 && physics.isCharging) {
        background.x -= background.speed/1.1
    } else if (physics.velocityX > 3.55) {
        background.x -= physics.velocityX
    } else if (physics.velocityX < -3.55) {
        Math.max(background.x - physics.velocityX, 10)
    }
    if (background.x < 0 - background.width) {
        background.x = 0;
    }
}
    

function applyInertia() {
    if (physics.velocityX !== 0 && player.y === (player.position - player.height)) {
        if (physics.velocityX < 0) {
            physics.velocityX = Math.min(0, physics.velocityX + physics.inertia)
        }
        if (physics.velocityX > 0) {
            physics.velocityX = Math.max(0, physics.velocityX - physics.inertia)
        }
    }

    if (player.y !== (player.position - player.height)) {
        physics.falling = true
    } else if (player.y === (player.position - player.height)) {
        physics.falling = false
    }
}

function movePlayer(e) {

    //jumping
    if ((player.y === (player.position - player.height)) || player.jump  < 1) {
        if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW") {
            physics.velocityY = -7;
            player.jump++;
        }
    }
    if (player.y === (player.position - player.height)) {
        player.jump = 0;
    }

    //inertia
    if (playerShape === "circle") {
        physics.inertia = 0.075
    } else if (playerShape === "square") {
        physics.inertia = 0.095
    }

    //player state momentum
    if (e.code == "KeyA" || e.code == "ArrowLeft") {
        if (playerShape === "square") {
            physics.velocityX = -square.speed;
        } else if (playerShape === "circle") {
            physics.velocityX = -circle.speed;
        }
    } else if (e.code == "KeyD" || e.code == "ArrowRight") {
        if (playerShape === "square") {
            physics.velocityX = square.speed;
        } else if (playerShape === "circle") {
            physics.velocityX = circle.speed;
        }
        -physics.inertia
    }

    //direction
    if (e.code === "KeyD" || e.code === "ArrowRight") {
        physics.direction = "right";
    } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
        physics.direction = "left";
    };

}

function playerSpecificMoves(e) { 

    //square dash
    if ((e.code === "KeyR") && square.dashCount < 1 && playerShape === "square") {
        if (physics.direction === "right") {
            physics.velocityX += 4
            console.log("Player Dashed")
        } else if (physics.direction === "left") {
            physics.velocityX += -4
            console.log("Player Dashed")
        }
        square.dashCount++
    } else if (square.dashCount >= 1) {
        function resetDash() {
            square.dashCount = 0;
        }
        setTimeout(resetDash, 3500)
    };

    //circle wall jumping
    if ((player.x === (boardWidth - player.width) && playerShape === "circle") || (player.x <= (player.width/4) && playerShape === "circle")) {
        player.jump = 0;
    }

    //circle charge attack
    let chargeAttack = 0;
    let isCharging = false;
    physics.isCharging = false;

    if (playerShape === "circle") {
        if (e.code === "KeyR") {
            isCharging = true;
            physics.isCharging = true;
            chargeAttack += 0.15;
            poweringUp();
        } else {
            chargeAttack = 0;
            isCharging = false
            physics.isCharging = false;
            physics.applyGravity = true;
        };
    };

    function poweringUp() {
        if (isCharging) {
            physics.applyGravity = false
            physics.velocityY = 0
            physics.velocityX = 0
        }
        function launchPlayer(e) {
            if ((e.code === "KeyR") && playerShape === "circle") {
                if (physics.direction === "right") {
                    physics.velocityX += chargeAttack;
                    console.log("Player Launched")
                } else if (physics.direction === "left") {
                    physics.velocityX -= chargeAttack;
                    console.log("Player Launched")
                };
                chargeAttack = 0;
                isCharging = false
                physics.isCharging = false;
                physics.applyGravity = true;
            } else {
                chargeAttack = 0;
                isCharging = false
                physics.isCharging = false;
                physics.applyGravity = true;
            };
        };

        document.addEventListener("keyup", launchPlayer)
    };

    //square cancel momentum (shockwave)
    if (physics.falling && playerShape === "square") {
        if (e.code === "KeyS" || e.code === "ArrowDown") {
            physics.velocityX = 0;
            physics.velocityY = 7
        };
    };
};

function playerState(e) {

    if (e.code == "KeyF") {
        playerShapesIndex++
        if (playerShapesIndex >= playerShapes.length) {
            playerShapesIndex = 0;
        };

        playerImg.src = playerShapes[playerShapesIndex];

        if (playerShapesIndex == 0) {
            playerShape = "square"
        } else if (playerShapesIndex == 1) {
            playerShape = "circle"
        };
    };
};
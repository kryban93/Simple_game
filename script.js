"use strict";
//=================================================
let controller = {
    goLeft : false,
    goRight : false,
    goUp : false,
    goDown : false,
    keyListener : function(e) {
        let pressed = (e.type == "keydown") ? true : false;
        switch(e.keyCode) {
            case 37: controller.goLeft = pressed; break;
            case 38: controller.goUp = pressed; break;
            case 39: controller.goRight = pressed; break;
            case 40: controller.goDown = pressed; break;
        }
    }
}
//=================================================
let player = {
    x : 100,
    y : 100,
    width : 16,
    height : 32,
    x_velocity : 0,
    y_velocity : 0,
    scale: 2,
    images : {
        stand : getImages("stand",1),
        moveUp : getImages("moveUp",3),
        moveDown : getImages("moveDown",3),
        moveLeft : getImages("moveLeft",3),
        moveRight : getImages("moveRight",3)
        },
    r_edge : function() {return Math.floor(this.x + (this.width * this.scale))},
    l_edge : function() {return Math.floor(this.x)},
    t_edge : function() {return Math.floor(this.y)},
    b_edge : function() {return Math.floor(this.y + (this.height * this.scale))}
}
let playerImage = player.images.stand[0];

let monster = {
    x : 300,
    y : 400,
    width : 16,
    height : 16,
    scale : 3,
    x_velocity : -3,
    y_velocity : 0,
    images : {
        stand : getImages("monster",2)
    },
    r_edge : function() {return Math.floor(this.x + this.width * this.scale)},
    l_edge : function() {return Math.floor(this.x)},
    t_edge : function() {return Math.floor(this.y)},
    b_edge : function() {return Math.floor(this.y + this.height * this.scale)},        
}
let monsterImage = monster.images.stand[0];
console.log(monster.images.stand);

let box = {
    x : 150,
    y : 150,
    width : 16,
    height : 16,
    scale : 2,
    x_velocity : 0,
    y_velocity : 0,
    images : {
        box : getImages("box",0)
    },
    r_edge : function() {return Math.floor(this.x + this.width * this.scale)},
    l_edge : function() {return Math.floor(this.x)},
    t_edge : function() {return Math.floor(this.y)},
    b_edge : function() {return Math.floor(this.y + this.height * this.scale)}, 
}

let map = {
    columns : 20,
    rows : 20,
    x : 0,
    y : 0,
    width : 32,
    height : 32,
    scale : 1,
    images : {
        grass : getImages("grass",0),
        dirt : getImages("dirt",0),
        frame : getImages("frame",1)
    }
    }
let map_image = map.images.dirt[0];
let map_frame = map.images.frame[0];
//================================================
const ctx = document.querySelector('canvas').getContext('2d');
let canvas_height = map.rows * map.height,
    canvas_width = map.columns * map.width;
    ctx.canvas.height = canvas_height;
    ctx.canvas.width = canvas_width;
//===============================================
//Funkcja zwracająca tablicę obrazów 
function getImages(name,endNum) {
    const arr = [];
    let img;
    for (let i = 0 ; i<= endNum ; i++ ) {
        img = new Image();
        img.src = `${name}_${i}.png`;
        arr.push(img); 
    }
    return arr;
}
//================================================
//Funkcje powodujące zmianę obrazja oraz update wartości
let [counter,delay] = [0,0];
function changeImage(name,endNum) {   
    let arr = player.images[`${name}`];     
    if (counter >= endNum) {
        counter = 0;
    }    
    return arr[counter]; 
}

function updateValues(endNum) {
    delay++;
    if (delay >= endNum) {
        counter++
        delay = 0;
    }
}

//================================================
//Collision Detection
function collisionDetection(firstElement,secondElement) {
    if (firstElement.l_edge() < secondElement.r_edge() && firstElement.r_edge() > secondElement.l_edge() &&
     firstElement.t_edge() < secondElement.b_edge() && firstElement.b_edge() > secondElement.t_edge()) {
        return true;
    }
}
//================================================
function movableDetection(movingObject,movableObject) {
            
        if (movingObject.r_edge() > movableObject.l_edge() && movingObject.t_edge() < movableObject.b_edge() &&
        movingObject.b_edge() > movableObject.t_edge() && movingObject.l_edge() < movableObject.l_edge()) { 
            movableObject.x = movingObject.r_edge();         
            movingObject.x_velocity = movingObject.x_velocity / 1.2;
            movingObject.y_velocity = movingObject.y_velocity / 1.2;        
        }
        if (movingObject.l_edge() < movableObject.r_edge() && movingObject.t_edge() < movableObject.b_edge() && 
        movingObject.b_edge() > movableObject.t_edge() && movingObject.r_edge() > movableObject.l_edge()) { 
            movableObject.x = movingObject.l_edge() - (movableObject.width * movableObject.scale);         
            movingObject.x_velocity = movingObject.x_velocity / 1.2;
            movingObject.y_velocity = movingObject.y_velocity / 1.2; 
        } 
        if (movingObject.b_edge() > movableObject.t_edge() && movingObject.r_edge() > movableObject.l_edge() && 
        movingObject.l_edge() < movableObject.r_edge() && movingObject.t_edge() < movableObject.b_edge()) {
                        
            movingObject.x_velocity = movingObject.x_velocity / 1.2;
            movingObject.y_velocity = movingObject.y_velocity / 1.2; 
        }
}
//================================================
let loop = function() {    
    //---------------------------------------------
    // Kontrola obiektu
    if (controller.goUp) {
        player.y_velocity -= 0.4; 
        playerImage = changeImage("moveUp",4);
    } 
    if (controller.goDown) {
        player.y_velocity += 0.4;
        playerImage = changeImage("moveDown",4);
    }
    if (controller.goLeft) {
        player.x_velocity -=0.4;
        playerImage = changeImage("moveLeft",4);
    }
    if (controller.goRight) {
        player.x_velocity +=0.4;
        playerImage = changeImage("moveRight",4);
    }

    if (!controller.goUp && !controller.goDown && !controller.goLeft && !controller.goRight) {
        playerImage = changeImage("stand",1);
    }

    player.y += player.y_velocity;
    player.x += player.x_velocity;
    player.x_velocity *= 0.9;
    player.y_velocity *= 0.9;    
    
    monster.x += monster.x_velocity;  

    //-----------------------------------------------
    //COLLISION DETECTION - WALLS
    if (player.l_edge() <= map.width) {        
        player.x_velocity = -player.x_velocity;
        
    }
    if (player.r_edge() >= canvas_width - map.width) {        
        player.x_velocity = -player.x_velocity;
    }
    if (player.b_edge() > canvas_height - map.height) {        
        player.y_velocity = -player.y_velocity;
    }
    if (player.t_edge() < map.height) {        
        player.y_velocity = -player.y_velocity;
    }

    if (monster.l_edge() <= map.width) {        
        monster.x_velocity = -monster.x_velocity;
        monsterImage = monster.images.stand[2];
    }
    if (monster.r_edge() >= canvas_width - map.width) {
        monster.x_velocity = -monster.x_velocity;
        monsterImage = monster.images.stand[0];
    }
    
    if(collisionDetection(player,monster)) console.log("bang"); 
    movableDetection(player,box);   
    collisionDetection(box,monster);
    //-----------------------------------------------
    //MAP GENERATION

    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,canvas_width,canvas_height);
    ctx.fill();    

    for (let i = 0 ; i <= map.columns ; i++) {
        for(let j = 0 ; j <= map.rows ; j++) {
            let tile_x = i * map.width,
                tile_y = j * map.height;
    
            ctx.drawImage(map_image,tile_x,tile_y,map.width,map.height);
        }
    } 
    
    for (let i = 0 ; i <= map.columns ; i++) {
        for(let j = 0 ; j <= map.columns;j++) {
            let tile_x = i * map.width,
                tile_y = j * map.height;
            if (i == 0 || i == map.columns -1 || j == 0 || j == map.rows -1) {
                ctx.drawImage(map_frame,tile_x,tile_y,map.width,map.height);

            }
        }
    }
   //--------------------------------------------------------------    
   ctx.imageSmoothingEnabled = false;// EDGE SHARPENING
    //-------------------------------------------------------------
    //OBJECTS GENERATION
    //ctx.fillStyle ='black';
    //ctx.fillRect(player.x,player.y,player.width,player.height);
    ctx.drawImage(playerImage,0,0,player.width,player.height,Math.floor(player.x),Math.floor(player.y),player.width * player.scale,player.height * player.scale);
           
    //ctx.fillStyle ='black';
    //ctx.fillRect(monster.x,monster.y,monster.width,monster.height);
    ctx.drawImage(monsterImage,0,0,monster.width,monster.height,Math.floor(monster.x),Math.floor(monster.y),monster.width * monster.scale,monster.height * monster.scale)
    
    ctx.drawImage(box.images.box[0],0,0,box.width,box.height,Math.floor(box.x),Math.floor(box.y),box.width * box.scale,box.height * box.scale);
    //--------------------------------------------------------------
    
    updateValues(5);
    window.requestAnimationFrame(loop);
}

/*
function resize() {
    canvas_width = document.documentElement.clientWidth - 300;
    ctx.canvas.width = canvas_width;
    ctx.imageSmoothingEnabled = false;
    if (canvas_width > document.documentElement.clientHeight) {
        canvas_height = document.documentElement.clientHeight;
        ctx.canvas.height = canvas_height;
    }
        canvas_height = document.documentElement.clientHeight - 200;
        ctx.canvas.height = canvas_height;
        
    
}
resize();
*/

window.addEventListener("keydown",controller.keyListener);
window.addEventListener("keyup",controller.keyListener);
//window.addEventListener("resize",resize);
window.requestAnimationFrame(loop);
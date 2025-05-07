//Esther Kim / Spring 2025/ CIS231 / Cairn University  
//Main and only js file

let count = 9;
let count2 = 10;
let countDown = 10;
let gravity = 5;
let jump = -100;
let bgImg;
let font;
let timer = 120;
let started = false;
let gameOver = false;
let winner;
let fighter;
let fighter2;
let startButton;
let replayButton;

//Class used to make each player. Constructor takes in a starting x-position and a player id (either 1 or -1 for this game)
//Players are made using 8 lines for legs and arms, two circles for hands, and a single base line used for the body (all coordinates move based on
//the body coordinates)
class Fighter {
    constructor(x, player){
        this.body_x = x;
        this.body_y = 300; 
        this.right_handx = 50;
        this.left_handx = 30;
        this.hand_d = 20;
        this.shoulder = 20;
        this.hip = 100;
        this.dir = player;
        this.left_footx = -60 *player;
        this.right_footx = 40*player;
        this.feet_y = 75;
        this.punching = false;
        this.special = false;
        this.moving = false;
        this.jumping = false;
        this.stepAngle = 3;
        this.walkSpeed = 1;
        this.stepLength = 5;
        this.yVel = 0;
        this.keys;
        this.id = player;
        this.color;
        this.health_coord;
        this.outlineColor = "white";
        this.image = loadImage("smiley.png");
        if (player == 1){
            this.keys = [65,68,87,83,69]; //left, right, up, down, punch
            this.color = "yellow";
            this.health_coord = [213, 60, .2];
            //sets up unique attributes for Player 1

        } else { //for Player 2 (-1)
            this.keys = [37,39,38,40,191];
            this.color = "blue";
            this.health_coord = [775, 60, .2];
            
        }
        this.rect = [this.body_x - 15, this.body_y, 30, 100]; //points for a collision rectangle around the body
        this.head_img = [this.body_x-28, this.body_y-58, 55,55]; //points for collision rectangle around the head image
        this.health = 150;
    }

    draw(){
        let rh = this.right_handx * this.dir;
        let lh = this.left_handx * this.dir;
        let ff = this.right_footx;
        let bf = this.left_footx;
        //for when player is jumping. mimics gravity
        this.body_y += this.yVel;
        if (this.body_y+this.hip+this.feet_y >= 500){ //if feet touching the ground
            this.left_footx = -60 * this.dir;
            this.right_footx = 40 * this.dir;
            this.yVel = 0;
            this.jumping = false;
        }
        
        strokeWeight(10);
        stroke(this.outlineColor);
        //head image
        image(this.image, this.body_x-28, this.body_y-58, 55,55, 0,0, this.image.width, this.image.height, COVER);
        //body line
        line(this.body_x, this.body_y, this.body_x, this.body_y+this.hip); 

        //arms and legs use trig equations to calculate how to place forearm/upper arm and
        // thigh/shin lines to make punching and moving easier to animate

        //right arm
        let angle = 90-(Math.acos(((rh**2)+(50**2)-(50**2))/(2*rh*50))*(180/Math.PI));
        let w = Math.sin(angle*(Math.PI/180))*50;
        let h = Math.cos(angle*(Math.PI/180))*50;
        line(this.body_x, this.body_y+this.shoulder, this.body_x+w, this.body_y+this.shoulder+h);
        line(this.body_x+w, this.body_y+this.shoulder+h, this.body_x+rh, this.body_y+this.shoulder);
        strokeWeight(0);
        fill(this.color);
        circle(this.body_x+rh, this.body_y+this.shoulder, 20);
        //left arm
        strokeWeight(10);
        angle = 90-(Math.acos(((lh**2)+(50**2)-(50**2))/(2*lh*50))*(180/Math.PI));
        w = Math.sin(angle*(Math.PI/180))*50;
        h = Math.cos(angle*(Math.PI/180))*50;
        line(this.body_x, this.body_y+this.shoulder, this.body_x+w, this.body_y+this.shoulder+h);
        line(this.body_x+w, this.body_y+this.shoulder+h, this.body_x+lh, this.body_y+this.shoulder);
        strokeWeight(0);
        fill(this.color);
        circle(this.body_x+lh, this.body_y+this.shoulder, this.hand_d);
        
        //back leg
        strokeWeight(10);
        let hyp = Math.sqrt(bf**2 + this.feet_y**2);
        angle = Math.acos(this.feet_y/hyp) - (Math.acos(((hyp**2)+(50**2)-(50**2))/(2*hyp*50)));
        w = Math.sin(angle)*50*this.dir;
        h = Math.cos(angle)*50;
        line(this.body_x, (this.body_y+this.hip), this.body_x-w, (this.body_y+this.hip)+h);
        line(this.body_x-w, (this.body_y+this.hip)+h, this.body_x + bf, this.feet_y+this.hip+this.body_y);
        //front leg
        hyp = Math.sqrt(ff**2 + this.feet_y**2);
        angle = Math.acos(this.feet_y/hyp) + (Math.acos(((hyp**2)+(50**2)-(50**2))/(2*hyp*50)));
        w = Math.sin(angle)*50*this.dir;
        h = Math.cos(angle)*50;
        line(this.body_x, (this.body_y+this.hip), this.body_x+w, (this.body_y+this.hip)+h);
        line(this.body_x+w, (this.body_y+this.hip)+h, this.body_x + ff, this.feet_y+this.hip+this.body_y);
        stroke(100,235,200);
        strokeWeight(15);

        //health bar line drawn at top
        line(this.health_coord[0], this.health_coord[1], this.health_coord[0]+(this.health*this.id), this.health_coord[1]+ this.health*this.health_coord[2]); 
        this.outlineColor="white"; //to reset outline color after being hit
    }



    //method that listens for keys and moves player accordingly
    move(){
        //if right key pressed
        if (keyIsDown(this.keys[1])) { 
            this.dir = 1;
            this.moving = true;
        }
        //if left key pressed
        if (keyIsDown(this.keys[0])) {
            this.dir = -1;
            this.moving = true;
        }

        //move player using sine wave pattern for feet, trying to mimic shuffling back and forth
        if (this.moving) {
            this.stepAngle += this.walkSpeed;
            // Offset feet in a sine wave pattern
            this.right_footx = 40 * this.dir + Math.sin(this.stepAngle) * this.stepLength;
            this.left_footx = -60 * this.dir + Math.sin(this.stepAngle + Math.PI) * this.stepLength;
        
            // Move body slightly forward
            this.body_x += 10 * this.dir;
        
            if (!keyIsDown(this.keys[1]) && !keyIsDown(this.keys[0])) {
                this.moving = false;
            }
        }

        //if punching key pressed
        if (keyIsDown(this.keys[4])) {
            this.punching = true;
            this.right_handx = 100;
        }
        
        //keep punch up for 10 frames before going back down
        if (this.punching) {
            countDown--;
            if (countDown <= 0) {
                this.right_handx = 50;
                countDown = 10;
                this.punching = false;
            }
        }

        //if spacebar pressed and special attack being done
        if (this.special) {
            count2--;
            if (count2 <= 0){
                this.left_handx = 30;
                this.hand_d = 20;
                count2 = 10;
                this.special = false;
            }
        }
        //if down key pressed, lower body y-coordinate (intentionally placed low enough so as to dodge incoming punches)
        //however, body was not edited to make the ducking/squatting look realistic (but I thought it looked funnier this way)
        if (keyIsDown(this.keys[3])){
            this.body_y = 420;
            this.feet_y = 475-(this.hip+this.body_y);
        } else{
            this.body_y = 300;
            this.feet_y = 75;
        }

        //if key is up and player not already jumping
        if (keyIsDown(this.keys[2]) && this.yVel >= 0){
            this.jumping = true;
            this.yVel += jump;
            this.feet_y = 90;
            //straightening legs a bit
            this.right_footx = 30 * this.dir;
            this.left_footx = -30 * this.dir;
        }

        if (this.jumping){
            this.yVel += gravity;
        }

        //if collision box x-coordinate is less than 90 or greater than 900, keep body from moving past a certain point
        if (this.rect[0] < 90){
            this.body_x = 115;
        } 
        if (this.rect[0] > 900){
            this.body_x = 900;
        }
        //update location of collision rectangles
        this.rect = [this.body_x - 15, this.body_y, 30, 100];
        this.head_img = [this.body_x-28, this.body_y-58, 55,55];
    }

    //check for hits
    checkHit(player2){
        //if this player is colliding with hand of the other player
        if (collideRectCircle(this.rect[0], this.rect[1], this.rect[2], this.rect[3], 
            player2.body_x+(player2.right_handx*player2.dir), player2.shoulder+player2.body_y, 20)){
                //move player backwards a bit to keep them from moving past each other
                this.body_x += 5 * player2.dir;
                //if other player punching this player's body, change health by 1 and show red outline
                if (player2.punching == true && this.health > 0){
                    this.health -= 1;
                    this.outlineColor = "red";
                }
                //if health of this player is 0 or less, end game and set winner to other player
                if (this.health <= 0){
                    this.health = 0;
                    if (player2.id == 1){
                        winner = "Player 1";
                    }
                    else{
                        winner = "Player 2";
                    }
                    gameOver = true;
                }
            }
        //if player being hit on the head, increase the amount of damage
            if (collideRectCircle(this.head_img[0], this.head_img[1], this.head_img[2], this.head_img[3], 
                player2.body_x+(player2.right_handx*player2.dir), player2.shoulder+player2.body_y, 20)){
                    this.body_x += 5 * player2.dir;
                    if (player2.punching == true && this.health > 0){
                        this.health -= 5;
                        this.outlineColor = "red";
                    }
                    if (this.health <= 0){
                        this.health = 0;
                        if (player2.id == 1){
                            winner = "Player 1";
                        }
                        else{
                            winner = "Player 2";
                        }
                        gameOver = true;
                    }
                }
        //if this player being hit by a special attack from other player, increase damage
        if (collideRectCircle(this.rect[0], this.rect[1], this.rect[2], this.rect[3], 
                player2.body_x+(player2.left_handx*player2.dir), player2.shoulder+player2.body_y, 50)){
                    if (player2.special == true && this.health > 0){
                        this.health -= 40;
                        this.outlineColor = "red";
                        this.body_x += 300 * player2.dir;
                    }
                    if (this.health <= 0){
                        this.health = 0;
                        gameOver = true;
                        if (player2.id == 1){
                            winner = "Player 1";
                        }
                        else{
                            winner = "Player 2";
                        }
                    }

                }
        //if this player's hand colliding with other player, move this player slightly backwards as well to keep them from moving past each other
        if (collideRectCircle(player2.rect[0], player2.rect[1], player2.rect[2], player2.rect[3], 
            this.body_x+(this.right_handx*this.dir), this.shoulder+this.body_y, 20)){
                this.body_x -= 5 * this.dir;
            }
    }
}



function preload(){
    bgImg = loadImage("background.jpg");
    font = loadFont("BebasKai.otf");
}

function setup(){
    //keep arrow keys from scrolling
    //referenced: https://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser 
    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
    let canvas = createCanvas(1000,580);
    //add canvas to game div
    canvas.parent("game");
    //accidentally made fighter Player 2 and fighter2 Player 1 which can get confusing
    fighter = new Fighter(700, -1);
    fighter2 = new Fighter(300, 1);
    //1 second interval for timer to tick by 
    setInterval(timeIt, 1000);
    //start button added to game div
    startButton = createButton("Start");
    startButton.parent("game");
    startButton.size(300,200);
    startButton.style("font-size", "100px");
    startButton.mouseClicked(start);
    //replay button added to game div
    replayButton = createButton("Play Again?");
    replayButton.parent("game");
    replayButton.size(130,70);
    replayButton.style("font-size", "20px");
    replayButton.hide();
    replayButton.mouseClicked(replay);
    textFont(font);
}

function draw(){
    background(bgImg);
    //starting screen with start button
    if (!started){
        startButton.position(windowWidth/2-150, 200, 'absolute');
    }
    //playing screen for when game has started and has not ended yet
    if (started && !gameOver){
        startButton.hide();
        replayButton.hide();
        //move and draw characters
        fighter.checkHit(fighter2);
        fighter2.checkHit(fighter);
        fighter.move();
        fighter2.move();
        fighter.draw();
        fighter2.draw();

        //Player 1 and Player 2 text labels that appear on the screens in game
        strokeWeight(0);
        textSize(40);
        push();
        fill(255,255,0);
        translate(fighter2.health_coord[0], fighter2.health_coord[1]-20);
        rotate(radians(12));
        text("Player1", 0,0, 100, 50);
        pop();

        push();
        fill(0,0,200);
        translate(fighter.health_coord[0]-110, fighter.health_coord[1]+3);
        rotate(radians(348));
        text("Player2", 0,0,100, 50);
        pop();
        
        //draw timer -- referenced https://editor.p5js.org/denaplesk2/sketches/ryIBFP_lG 
        textAlign(CENTER);
        fill(255, 250, 255);
        let t;
        if (timer % 60 >= 10){
            t = timer % 60;
        }
        else if (timer % 60 < 10){
            t = "0"+ timer%60;
        }
        text(`${Math.floor(timer/60)}:${t}`, width/2, 30);
    }

    //when game ends by KO or time runs out, show game end screen
    if (gameOver){
        //rectangle for holding text
        fill(78, 38, 106);
        stroke(240, 33, 212);
        rect(280,150,450,300,20);
        //Main header text (who won)
        textAlign(CENTER);
        strokeWeight(0);
        fill("white");
        textSize(50);
        if (winner == "TIE"){
            textSize(100);
            text("TIE", 500, 300);
        } else{
            //show winner name
            text(`${winner} WINS`, 500, 230);
            //show KO if someone won by KO, else show remaining health
            if (fighter.health <= 0 || fighter2.health <= 0){
                textSize(70);
                text("KO", 500, 300);
            }
            else{
                textSize(30);
                text(`Player 1 health: ${fighter2.health}`, 500, 280);
                text(`Player 2 health: ${fighter.health}`, 500, 330);
            }
        }
        replayButton.position(windowWidth/2-80, 350, 'absolute');
        replayButton.show();
    }

}
//check if space bar hit (did this here because it should not be checked in rapid succession when clicked, since it needs to choose a random person
//to do a special move for)
function keyPressed(){
    if (keyCode == 32){
        //choose a random player
        let i = Math.floor(Math.random()*2 + 1);
        if (i == fighter2.id){
            fighter2.special = true;
            fighter2.left_handx = 100;
            fighter2.hand_d = 50;
        }
        if (i == 2){
            fighter.special = true;
            fighter.left_handx = 100;
            fighter.hand_d = 50;
        }
    }
}
//timer function
function timeIt(){
    if (timer > 0 && started){
        timer--;
    }
    //when time is done, end game and get winner
    else if (timer <= 0){
        if (fighter.health < fighter2.health){
            winner = "Player 1";
        } 
        else if (fighter.health > fighter2.health){
            winner = "Player 2";
        }
        else{
            winner = "TIE";
        }
        gameOver = true;
    }
}

function start(){
    started = true;
}
//reset attributes and start game again
function replay(){
    fighter.health = 150;
    fighter.body_x = 700;
    fighter2.body_x = 300;
    fighter2.health = 150;
    fighter.dir = -1;
    fighter2.dir = 1;
    timer = 120;
    gameOver = false;
}
//every time a different image file is uploaded for a character, change the image source for the respective character's head
//referenced https://www.google.com/search?q=how+to+let+users+upload+pictures+on+your+website+html&oq=how+to+let+users+upload+pictures+on+your+website+&gs_lcrp=EgZjaHJvbWUqCAgBEAAYFhgeMgoIABBFGBYYHhg5MggIARAAGBYYHjIICAIQABgWGB4yCAgDEAAYFhgeMgcIBBAAGO8FMgoIBRAAGIAEGKIEMgcIBhAAGO8F0gEIODk1N2owajeoAgCwAgA&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:d97a987a,vid:73Pnj4MfhzI,st:0 
function loadFile(event, imgId){
    //checking which character a file has been uploaded for and whether the fighter object has been made yet
    if (imgId === 'head' && fighter2) {
        document.getElementById("head").src = URL.createObjectURL(event.target.files[0]);
        fighter2.image = loadImage(URL.createObjectURL(event.target.files[0]));
    } else if (imgId === 'head2' && fighter) {
        document.getElementById("head2").src = URL.createObjectURL(event.target.files[0]);
        fighter.image = loadImage(URL.createObjectURL(event.target.files[0]));
    }
}

Player = function(game, x, y, img, speed, jumpHeight) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.playerImg = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.jumpHeight = jumpHeight;
    this.dir = 'right';

    //changing players starting health from 0 to 100
    this.health = 100;

    this.animations.add('idle',[0,1,2,3,4,5,6,7], 8, true);
    this.animations.add('move',[8,9,10,11,12,13,14,15], 8, true);
    this.animations.add('slide',[24,25,26,27,28,29,30,31], 7);
    this.animations.add('fire_behind', [16,17,18,19,20,21,22,23], 8);

    //'this' refers to the player, and this code is adding him to the games physics engine
    game.physics.enable(this, Phaser.Physics.ARCADE);

    //give the player some physics values and dont allow him to exit the screen
    this.body.collideWorldBounds = true;
    this.body.setSize(40 ,55);
    this.anchor.setTo(.5,.5);

    //sets up sprite for players melee skill
    this.meleeRange = game.add.sprite(0, 0, null);
    this.meleeRange.anchor.setTo(.5,.5);
    game.physics.enable(this.meleeRange);
    this.meleeRange.body.gravity = -game.physics.gravity; //so the meleeRange body does not fall out of the world
    this.meleeRange.body.setSize(160,55);
    this.addChild(this.meleeRange); //adds melee range to the player DisplayContainer

    //double jump ability variables
    this.doubleJump = false; //this stores if the player has the double jump ability
    this.jumps = 0; //how many times has the player jumped
    this.jumpsTimer = 0; //when was the last time the player hit the jump key

    //sliding ability variables
    this.slide = true; //does the player have the slide ability
    this.canSlide = false;
    this.slideCooldown = 0;

    //dont know if this is still going to be used
    this.offensiveAbilityTag = "Flare";
    this.defensiveAbilityTag = "Bubble Shield";

    this.offensiveAbility = game.add.sprite(0, 0, null);
    this.defensiveAbility = game.add.sprite(0, 0, null);
    this.addChild(this.defensiveAbility);
    this.addChild(this.offensiveAbility);

    this.offensiveCD = false;
    this.defensiveCD = false;

    this.offensiveAbilityActive = false;
    this.defensiveAbilityActive = false;

    this.playerGun;

    this.body.maxVelocity.y = 800;

    /*
     *  When using a variable to store the current player gun it was constantly updating it
     *  which was bugging the update function. We decided to use this function to update the
     *  players gun.
     */


    this.LeftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.RightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.UpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.DownKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

    this.FireLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.FireRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    this.offensiveKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
    this.defensiveKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);

    //variable that stores if the player is currently hitting a ladder
    this.onLadder = false;

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

var canSlideTimer;

Player.prototype.update = function(){

    this.animations.play('idle');

    /*
     * Using the players direction call the right slide direction.
     * This allows the player to dash quickly to one side every 3 seconds
     * once he double taps one of the movement keys.
     * Also this handles the players basic movement :)
     */

    if(this.canSlide == true && canSlideTimer < this.game.time.now){
        this.canSlide = false;
    }

    if(this.LeftKey.isDown){

        if(this.animations.currentAnim != 'slide')
            this.animations.play('move');

        this.dir = 'left';
        this.body.velocity.x = -this.speed;
        this.scale.x = -1;
        this.scale.y = 1;
        this.playerGun.scale.x = -1;
        this.playerGun.scale.y = 1;
        if(this.canSlide == true && this.slide == true && this.LeftKey.downDuration(300)){

            this.slideCooldown  = this.game.time.totalElapsedSeconds() + 3;
            this.body.velocity.x = -this.speed*3;
            this.animations.play('slide');

        } else {
            this.canSlide = false;
        }

        if(this.FireRight.isDown){
            this.animations.play('fire_behind');
        }

    } else if(this.RightKey.isDown){
        if(this.animations.currentAnim != 'slide')
            this.animations.play('move');

        this.dir = 'right';
        this.body.velocity.x = this.speed;
        this.scale.x = 1;
        this.scale.y = 1;
        this.playerGun.scale.x = 1;
        this.playerGun.scale.y = 1;
        if(this.canSlide == true && this.slide == true && this.RightKey.downDuration(300)){

            this.slideCooldown = this.game.time.totalElapsedSeconds() + 3;
            this.body.velocity.x = this.speed*3;
            this.animations.play('slide');

        } else{
            this.canSlide = false;
        }

        if(this.FireLeft.isDown){
            this.animations.play('fire_behind')
        }

    } else {

        this.body.velocity.x = 0;

    }

    if(this.onLadder == true){
        if(this.UpKey.isDown){
            this.body.velocity.y = -this.speed;
        }
        if(this.DownKey.isDown){
            this.body.velocity.y = this.speed;
        }

        if(this.body.velocity.y < -this.speed){
            this.body.velocity.y = -this.speed
        }
    }

    //handles everything about sliding
    this.SlidingUpdate();

    //This allows the player to jump for a second time whilst in the air
    if(this.doubleJump == true && this.jumps < 2 && this.jumpsTimer <= this.game.time.now){
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
            this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
            this.body.velocity.y = -this.jumpHeight;
            this.jumps = 2;
        }
    }

    //player jumping
    if(this.body.onFloor() && this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
        this.body.onFloor() && this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
        this.body.velocity.y = -this.jumpHeight;
        this.jumps = 1;
        //if the jumping the undesirable then change it so the player can only jump a second time whilst his velocity is > 0
        this.jumpsTimer = this.game.time.now + 500;
    }

    if(this.body.onFloor()){
        this.jumps = 0;
    }

    this.playerGun.update(this.offensiveAbilityTag, this.offensiveAbilityActive);
    this.playerGun.visible = true;

    this.AbilityBehaviours();

}

//function for changing the players gun
Player.prototype.ChangeGun = function(gun){

    if(this.playerGun != null)
    this.playerGun.destroy();

    switch(gun){
        case "Hail":
            this.playerGun = new Gun(this.game, 0.1, 3, 10, 1,0,0,'playergun', 'Hail', 100);
            break;
        case "Buckshot":
            this.playerGun = new Gun(this.game, 1.5, 3, 5, 3,0,0,'playergun','Buckshot', 30);
            break;
        case "Bullseye":
            this.playerGun = new Gun(this.game, 3, 2, 5, 5,0,0,'playergun','Bullseye', 25);
            break;
        case "Potshot":
            this.playerGun = new Gun(this.game, 0.5, 2, 5, 2,0,0,'playergun','Potshot', 30);
            break;
    }
    this.playerGun.anchor.setTo(.5,.5);
    this.addChild(this.playerGun);
}

Player.prototype.ChangeOffensiveAbility = function(Ability){

    this.offensiveAbilityTag = Ability;

    //this.removeChild(this.offensiveAbility);
    this.offensiveAbility.destroy();

    if(this.offensiveAbilityTag == "Flare"){
        //sets up one ability sprite and the animation
        this.offensiveAbility = this.game.add.sprite(0, 0, 'flare');
        this.game.physics.enable(this.offensiveAbility);
        this.offensiveAbility.body.gravity = -this.game.physics.gravity;
        this.offensiveAbility.body.immovable = true;
        this.offensiveAbility.body.setSize(5,5);
        this.offensiveAbility.anchor.setTo(.5,.5);
        this.offensiveAbilityAnim = this.offensiveAbility.animations.add('flare');
        this.offensiveAbility.visible = false;
        this.addChild(this.offensiveAbility);

    } else if(this.offensiveAbilityTag == 'Powershot'){
        this.offensiveAbility = this.game.add.sprite(0, 0, null);

    } else if(this.offensiveAbilityTag == 'Infect'){
        this.offensiveAbility = this.game.add.sprite(0, 0, null);
    } else if(this.offensiveAbilityTag == 'Rage'){
        this.offensiveAbility = this.game.add.sprite(0, 0, null);
    }
}

Player.prototype.ChangeDefensiveAbility = function(Ability){

    this.defensiveAbilityTag = Ability;

    //this.removeChild(this.defensiveAbility);
    this.defensiveAbility.destroy();

    if(this.defensiveAbilityTag == "Panic"){
        this.defensiveAbility = this.game.add.sprite(0,0,null);
        this.addChild(this.defensiveAbility);
    } else if(this.defensiveAbilityTag == "Colossus"){
        this.defensiveAbility = this.game.add.sprite(0,0,null);
        this.addChild(this.defensiveAbility);
    } else if(this.defensiveAbilityTag == "Bubble Shield"){
        this.defensiveAbility = this.game.add.sprite(this.x,this.y,'bubble');
        this.defensiveAbility.anchor.setTo(.5,.5);
        this.defensiveAbilityAnim = this.defensiveAbility.animations.add('shieldAnim', [0,1,2,3,4]);
        this.defensiveAbility.visible = false;
        this.defensiveAbility.alpha = 100;
        this.defensiveAbility.health = 5;
    }else if(this.defensiveAbilityTag == 'Ground Slam'){
        this.defensiveAbility = this.game.add.sprite(0, 20, 'GroundSlam');
        this.game.physics.enable(this.defensiveAbility);
        this.defensiveAbility.body.gravity = -this.game.physics.gravity;
        this.defensiveAbility.body.immovable = true;
        this.defensiveAbility.body.setSize(5,5);
        this.defensiveAbility.anchor.setTo(.5,.5);
        this.defensiveAbilityAnim = this.defensiveAbility.animations.add('GroundSlam');
        this.defensiveAbility.kill();
        this.addChild(this.defensiveAbility);
    }
}

var CDTimerOffensive;
var CDTimerDefensive;

var defenceTimer;
var offenceTimer;

Player.prototype.AbilityBehaviours = function(){

    if(this.offensiveKey.isDown == true && this.offensiveCD == false){
        if(this.offensiveAbilityTag == 'Flare'){
            //check that the current major ability has an animation
            if(this.offensiveAbilityAnim != null){

                this.offensiveAbility.revive();
                this.offensiveAbility.animations.play('flare', 8, false, true);
                this.offensiveAbility.visible = true;
                this.offensiveAbilityActive = true;
                CDTimerOffensive = this.game.time.totalElapsedSeconds() + 5;

            }
        } else if(this.offensiveAbilityTag == 'Powershot'){
            this.offensiveAbilityActive = true;
            CDTimerOffensive = this.game.time.totalElapsedSeconds() + 5;
        } else if(this.offensiveAbilityTag == 'Infect'){
            this.offensiveAbilityActive = true;
            offenceTimer = this.game.time.totalElapsedSeconds() + 3;
            CDTimerOffensive = this.game.time.totalElapsedSeconds() + 5;
        } else if(this.offensiveAbilityTag == 'Rage'){
            this.offensiveAbilityActive = true;
            this.loadTexture('playersheetrage');
            this.playerGun.loadTexture('playergunrage');
            offenceTimer = this.game.time.totalElapsedSeconds() + 3;
            CDTimerOffensive = this.game.time.totalElapsedSeconds() + 10;
            this.originDpb = this.playerGun.Dpb;
            this.playerGun.Dpb = this.playerGun.Dpb * 2;
        }
    }

    var Offensiveframe = 1;

    if(this.offensiveAbilityTag == 'Flare'){
        if( this.offensiveAbility.alive == true){
            if(this.offensiveAbility.animations.currentAnim.frame > Offensiveframe){
                Offensiveframe = this.offensiveAbility.animations.currentAnim.frame;
                this.offensiveAbility.body.setSize(this.offensiveAbility.body.width += 2,this.offensiveAbility.body.height += 2);
            }
        }
        if(this.offensiveAbilityAnim.isFinished){
            this.offensiveAbility.body.setSize(10,10);
            this.offensiveAbility.kill();
            this.offensiveAbilityActive = false;
        }
    }

    if(this.defensiveKey.isDown == true && this.defensiveCD == false){
        if(this.defensiveAbilityTag == 'Panic'){
            this.defensiveAbilityActive = true;
            defenceTimer = this.game.time.totalElapsedSeconds() + 3;
            CDTimerDefensive = this.game.time.totalElapsedSeconds() + 10;
            this.speed = this.speed*2;

        } else if(this.defensiveAbilityTag == "Colossus"){
            this.defensiveAbilityActive = true;
            this.loadTexture('playersheetcolossus');
            defenceTimer = this.game.time.totalElapsedSeconds() + 3;
            CDTimerDefensive = this.game.time.totalElapsedSeconds() + 10;
            this.health = this.health*2;

        }else if(this.defensiveAbilityTag == "Bubble Shield"){

            this.defensiveAbility.revive();
            this.defensiveAbility.health = 5;
            this.defensiveAbility.visible = true;
            this.defensiveAbility.animations.play('shieldAnim', 16, false, false);
            defenceTimer = this.game.time.totalElapsedSeconds() + 5;
            CDTimerDefensive = this.game.time.totalElapsedSeconds() + 10;
            this.defensiveAbilityActive = true;

        }
    }

    var Defensiveframe = 1;


    if(this.defensiveAbilityTag == 'Ground Slam'){


        if(this.body.onFloor()==false && this.DownKey.isDown==true && this.defensiveCD == false && this.defensiveCD == false){
            this.body.velocity.y = 600;
            this.defensiveAbilityActive = true;
            CDTimerDefensive = this.game.time.totalElapsedSeconds() + 5;

        }

        if(this.body.onFloor()==true && this.defensiveAbilityActive == true && this.defensiveAbilityAnim.isPlaying == false){
            console.log('slam2');
            this.defensiveAbility.revive();
            this.defensiveAbility.animations.play('GroundSlam', 6, false, true);
            this.defensiveAbilityActive = false;
        }

        if( this.defensiveAbility.alive == true){
            if(this.defensiveAbility.animations.currentAnim.frame >= Defensiveframe){
                Defensiveframe = this.defensiveAbility.animations.currentAnim.frame;
                this.defensiveAbility.body.setSize(this.defensiveAbility.body.width += 6,12);
            }
        } else{
            this.defensiveAbility.body.setSize(10,10);
        }

    }


    if(this.defensiveAbilityTag == "Bubble Shield"){
        if(this.defensiveAbilityAnim.isFinished == true) {
            this.game.physics.enable(this.defensiveAbility);
            this.defensiveAbility.body.gravity = -this.game.physics.gravity;
            this.defensiveAbility.body.immovable = true;
        }else{
            this.defensiveAbility.x = this.x;
            this.defensiveAbility.y = this.y-7;
        }

        switch(this.defensiveAbility.health){
            case 3:
                this.defensiveAbility.frame = 5;
                break;
            case 2:
                this.defensiveAbility.frame = 6;
                break;
            case 1:
                this.defensiveAbility.frame = 7;
                break;
        }
    }

    if(CDTimerOffensive > this.game.time.totalElapsedSeconds()){
        this.offensiveCD = true;
    } else {
        this.offensiveCD = false;
    }

    if(CDTimerDefensive > this.game.time.totalElapsedSeconds()){
        this.defensiveCD = true;
    } else {
        this.defensiveCD = false;
    }

    if(defenceTimer < this.game.time.totalElapsedSeconds() && this.defensiveAbilityActive == true){
        this.defensiveAbilityActive = false;
        this.playerGun.loadTexture('playergun');
        this.loadTexture('playersheetnormal');

        if(this.defensiveAbilityTag == 'Panic')
            this.speed = 300;
        else if(this.defensiveAbilityTag == 'Colossus'){
            this.loadTexture('playersheetnormal');
            this.health = 100;
        }
        else if (this.defensiveAbilityTag == 'Bubble Shield')
            this.defensiveAbility.kill();
    }

    if(offenceTimer < this.game.time.totalElapsedSeconds() && this.offensiveAbilityActive == true){
        this.offensiveAbilityActive = false;
        this.playerGun.loadTexture('playergun');
        this.loadTexture('playersheetnormal');

        if(this.offensiveAbilityTag == 'Rage'){
            this.playerGun.Dpb = this.originDpb;
            this.playerGun.loadTexture('playergun');
        }

    }

}


var downTime, upTime;
var slidePrep = false, slidePrimed = false;
var slideBeenPreped = false;

Player.prototype.SlidingUpdate = function(){

    if(this.RightKey.isDown && slidePrep == false && slideBeenPreped == false ||
        this.LeftKey.isDown && slidePrep == false && slideBeenPreped == false){
        downTime = this.game.time.now + 500;
        slidePrep = true;
    }

    if(this.RightKey.isUp && this.LeftKey.isUp){
        if(slidePrimed == false && slidePrep == true){

            upTime = this.game.time.now + 500;
            slidePrimed = true;
        }
        slideBeenPreped = false;
    }

    if(downTime < this.game.time.now){
        slidePrep = false;
        if(this.RightKey.isDown || this.LeftKey.isDown)
            slideBeenPreped = true;
    }
    if(upTime < this.game.time.now){
        slidePrimed = false
    }

    if(slidePrep == true && slidePrimed == true && this.RightKey.isDown ||
        slidePrep == true && slidePrimed == true && this.LeftKey.isDown){
        if(this.slideCooldown < this.game.time.totalElapsedSeconds()) {
            this.canSlide = true;
            this.slideCooldown = this.game.time.totalElapsedSeconds() + 3;
            canSlideTimer = this.game.time.now+300;
        }
    }

    //console.log(slidePrimed);

    if(this.canSlide == true){
        //console.log('canslide');
    }
}

Player.prototype.RndAbilities = function(){
    var RndOfAbility = Math.floor(Math.random() * 4) + 1;
    var RndDeAbility = Math.floor(Math.random() * 4) + 1;
    var RndGun = Math.floor(Math.random() * 4) + 1;
    var RndPassive = Math.floor(Math.random() * 2) + 1;

    switch(RndPassive){
        case 1:
            this.slide = true;
            this.doubleJump = false;
            break;
        case 2:
            this.slide = false;
            this.doubleJump = true;
            break;
    }

    switch(RndOfAbility){
        case 1:
            this.ChangeOffensiveAbility('Flare');
            break;
        case 2:
            this.ChangeOffensiveAbility('Powershot');
            break;
        case 3:
            this.ChangeOffensiveAbility('Infect');
            break;
        case 4:
            this.ChangeOffensiveAbility('Rage');
            break;
    }

    switch(RndDeAbility){
        case 1:
            this.ChangeDefensiveAbility('Panic');
            break;
        case 2:
            this.ChangeDefensiveAbility('Colossus');
            break;
        case 3:
            this.ChangeDefensiveAbility('Bubble Shield');
            break;
        case 4:
            this.ChangeDefensiveAbility('Ground Slam');
            break;
    }

    switch(RndGun){
        case 1:
            this.ChangeGun('Hail');
            break;
        case 2:
            this.ChangeGun('Buckshot');
            break;
        case 3:
            this.ChangeGun('Bullseye');
            break;
        case 4:
            this.ChangeGun('Potshot');
            break;
    }

}


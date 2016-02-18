Enemy = function(game, x, y, img, speed, type, jumpHeight, dps, health, attackSpeed){
    Phaser.Sprite.call(this, game, x, y, img);

    this.enemyImage = img;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.type = type;
    this.jumpHeight = jumpHeight;
    this.dps = dps;
    this.health = health;
    this.attackSpeed = attackSpeed;

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.mass = 10;

    //enemy bullet group declaration
    this.bullets = game.add.group();
    this.bullet = new Bullet(game, this.x, this.y, img, 300, 'right');
    //Enemy attack timer variables
    this.lastAttack = 0;
    this.canAttack = true;

    this.anchor.setTo(.5,.5);

    //enemy sight sprite for seeing player
    this.sight = game.add.sprite(0, 0, null);
    this.sight.anchor.setTo(0.5,0.5);
    game.physics.enable(this.sight, Phaser.Physics.ARCADE);
    this.sight.body.gravity = -game.physics.gravity;
    this.sight.body.setSize(500,64);
    this.addChild(this.sight);
    this.seesPlayer = false;

    //variables for following the player
    this.followingPlayer = false;
    this.followTime = 0;

    //set up diffrent variables for diffrent enemy types
    if(this.type == "flying"){
        this.sight.body.setSize(300,300);
        this.body.setSize(53,50);
        this.animations.add('idle',[0,1,2,3,4,5,6], 10, true);
        this.animations.play('idle');
    } else if(this.type == "shooter"){
        this.sight.body.setSize(300,64);
        this.body.setSize(60,58);
        this.animations.add('idle',[0,1,2,3,4], 8, true);
        this.animations.play('idle');

    } else if(this.type == "melee"){
        this.sight.body.setSize(300,56);
        this.body.setSize(60,56);
        this.animations.add('idle',[0,1,2,3,4], 4, true);
        this.animations.play('idle');

    } else if(this.type == "exploding"){
        this.sight.body.setSize(300,73);
        this.body.setSize(64,73);
        this.animations.add('idle',[0,1,2,3], 4, true);
        this.animations.play('idle');
    } else if(this.type == 'boss'){
        this.sight.body.setSize(300,73);
        //this.body.setSize(200,300);
        //this.animations.add('idle',[0,1,2,3], 4, true);
        //this.animations.play('idle');
    }

    this.infected = false;
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){

    //update follow time
    if(this.followTime < this.game.time.totalElapsedSeconds()){
        this.followingPlayer = false;
        this.body.velocity.x = 0;
    }

     //allows the enemy to fire once every x seconds
     if(this.lastAttack < this.game.time.totalElapsedSeconds()) {
     this.canAttack = true;
     //this.lastAttack = this.game.time.totalElapsedSeconds() + 1;
     } else {
     this.canAttack = false;
     }

    if(this.canAttack == false && this.lastAttack < this.game.time.totalElapsedSeconds()){
        this.canAttack = true;
    }

    if(this.type == 'boss'){

        if(this.health <= 13 && this.attackSpeed != 0.25){
            this.attackSpeed = 0.25;
        }

        if(this.health <= 6 && this.speed < 300){
            this.speed = this.speed*2;
        }

        this.Fire('left');
    }

}

Enemy.prototype.Fire = function(dir){

    //allows the enemy to fire once every x seconds
    if(this.canAttack == true) {

        //use the dir variable to fire the bullet in the right direction
        this.bullet = new Bullet(this.game, this.x, this.y, 'Bullets', 300, dir, this.dps);
        this.bullet.frame = 0;
        if(dir == 'Left'){
            this.bullet.scale.x = 1;
        } else{
            this.bullet.scale.x = -1;
        }
        this.bullets.add(this.bullet);

        //reset last fired
        this.canAttack = false;
        this.lastAttack = this.game.time.totalElapsedSeconds() + this.attackSpeed;
    }

}

//follows the player using the position given
Enemy.prototype.followPlayer = function(player) {

    //this moves the enemy towards the player if he can see him
    if (player.x < this.x) {
        this.scale.x = 1;
        this.scale.y = 1;
    }
    if (player.x > this.x) {
        this.scale.x = -1;
        this.scale.y = 1;
    }

    //movement for each enemy type
    if (this.type == "flying"){

        //move the enemy to the players current x and y position
        this.game.physics.arcade.moveToXY(this, player.x, player.y, this.speed);

    } else if(this.type == "shooter"){

        //move away from the player if he is within range
        if(player.x > this.x){
            this.body.velocity.x = -this.speed;
        } else if(player.x < this.x){
            this.body.velocity.x = this.speed;
        }

        //this moves the enemy to a safe shooting distance
        if((player.x + player.body.width) > this.sight.world.x && (player.x + player.body.width) < this.sight.world.x + 10){
            this.body.velocity.x = 0;
        } else if(player.x < (this.sight.world.x + this.sight.body.width) && player.x > this.sight.world.x + this.sight.body.width - 10){
            this.body.velocity.x = 0;
        }
    }
    else if (this.type == "melee" || this.type == "exploding") {

        //this moves the enemy towards the player if he can see him
        if (player.x < this.x) {
            this.body.velocity.x = -this.speed;
        } else if (player.x > this.x) {
            this.body.velocity.x = this.speed;
        }

        //jump if he hits a wall
        if (this.body.onWall() && this.jumpHeight != null && this.body.onFloor() == true) {
            this.body.velocity.y = -this.jumpHeight;
        }
    } else if(this.type == 'boss'){

        //this moves the enemy towards the player if he can see him
        if (player.y < this.y) {
            this.body.velocity.y = -this.speed;
        } else if (player.y > this.y) {
            this.body.velocity.y = this.speed;
        }
        console.log('follow ');
    }
}

Enemy.prototype.SightBehaviour = function(playersX){

    if(this.type == "flying"){

    }
    else if(this.type == "shooter"){

        //if the player is to the left of the enemy fire left and the same for right
        if(playersX < this.x) {
            this.Fire('left');
        }
        if(playersX > this.x){
            this.Fire('right');
        }

    } else if(this.type == "melee"){

    } else if(this.type == "exploding"){

    }

    //player is set to follow the player for a set ammount of time
    this.followingPlayer = true;
    this.followTime = this.game.time.totalElapsedSeconds() + 5;

}

Enemy.prototype.CollideBehaviour = function(player){
    if(this.type == "melee" || this.type == "flying"){
        if(this.canAttack == true){
            player.damage(this.dps);
            this.canAttack = false;
            this.lastAttack = this.game.time.totalElapsedSeconds() + this.attackSpeed;
        }
    } else if(this.type == "exploding"){
        this.kill();
        player.damage(this.dps);
    }
}

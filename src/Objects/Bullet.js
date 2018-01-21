Bullet = function(game, x, y, img, speed, dir, dpb, Frame){
    Phaser.Sprite.call(this, game, x, y, img);


    this.x = this.x;
    this.y = this.y;
    this.img = img;
    this.speed = speed;
    this.dir = dir;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.dpb = dpb;
    this.frame = Frame;

    //add the bullet to the physics engine
    game.physics.enable(this, Phaser.Physics.ARCADE);

    //give the bullets no gravity
    this.body.gravity.y = -600;

    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
}


Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){

    //move the bullet in the direction the object is facing
    if(this.dir == 'left'){
        this.body.velocity.x = -this.speed;
    } else if(this.dir == 'right'){
        this.body.velocity.x = this.speed;
    }

}

Bullet.prototype.PlayerFire = function(dir){
    //this.game.physics.arcade.moveToPointer(this, 300);


    switch (dir){
        case 'left':
            this.body.velocity.x = -this.speed;
            this.rotation = 3.14;
            break;
        case 'up':
            this.body.velocity.y = -this.speed;
            this.rotation = -1.57;
            break;
        case 'right':
            this.body.velocity.x = this.speed;
            this.rotation = 0;
            break;
        case 'down':
            this.body.velocity.y = this.speed;
            this.rotation = 1.57;
            break;
    }


}

Item = function(game, x, y, img, type){
    Phaser.Sprite.call(this, game, x, y, img);
    this.game = game;
    this.type = type;

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.gravity = -game.physics.gravity;
}

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

Item.prototype.update = function(){

}
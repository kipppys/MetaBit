Ladder = function(game, x, y, img){
    Phaser.Sprite.call(this, game, x, y, img);
    this.game = game;

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.gravity = -game.physics.gravity;
}

Ladder.prototype = Object.create(Phaser.Sprite.prototype);
Ladder.prototype.constructor = Ladder;

Ladder.prototype.update = function(){

}
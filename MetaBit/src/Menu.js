var Menu = function(game){}

Menu.prototype = {
    create: function(){
        this.game.add.image(200,50,'Logo');
        var PlayBtn = this.game.add.button(400,420,'playBtn', this.PlayGame,this);
        PlayBtn.anchor.setTo(.5,.5);
        var instructionsBtn = this.game.add.button(400,520,'instructionsBtn', this.Instructions,this);
        instructionsBtn.anchor.setTo(.5,.5);
    },
    PlayGame: function(){
        this.game.state.start('Game');
    },
    Instructions: function(){
        this.game.state.start('Instructions');
    }
}

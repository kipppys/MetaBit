var Instructions = function(game){}

var abilities;
var AbilityListBtn;

Instructions.prototype = {
    create: function(){
        var inst = this.game.add.image(0,0,'instructions');

        abilities = this.game.add.image(0,0, 'AbilityList');
        abilities.visible = false;

        var PlayBtn = this.game.add.button(780,530,'playBtn', this.PlayGame,this);
        PlayBtn.anchor.setTo(1,0);
        AbilityListBtn = this.game.add.button(20,530,'AbilityListBtn', this.AbilityList,this);

    },
    PlayGame: function(){
        console.log(this);
        this.game.state.start('Game');

    },
    AbilityList: function(){

        abilities.visible = true;
        AbilityListBtn.visible = false;
    }
}

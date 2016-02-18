
var Boot = function(game){
    console.log("%cStarting my awesome game", "color:white; background:red");
};

Boot.prototype = {
    preload: function(){
        this.game.load.image("loading","MetaBit/assets/loading.png");
    },
    create: function(){
        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.setScreenSize();
        this.game.state.start("Preload");
    }
}
var preload = function(game){}

preload.prototype = {
    preload: function(){
        var loadingBar = this.add.sprite(400,300,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);

        //load enemy image
        this.game.load.image('enemyimg', 'MetaBit/assets/enemy.jpg');

        //load item & bullet image
        this.game.load.image('bull', 'MetaBit/assets/bullet.jpg');
        this.game.load.spritesheet('Bullets', 'MetaBit/assets/BulletsSheet.png', 22, 9, 4,0,0);
        this.game.load.spritesheet('playergun', 'MetaBit/assets/player_weapon.png', 12,10,4,0,0);
        this.game.load.spritesheet('playergunrage', 'MetaBit/assets/player_weapon_rage.png', 12,10,4,0,0);
        this.game.load.image('itemimg', 'MetaBit/assets/item.png');

        this.game.load.image('ladder', 'MetaBit/assets/ladder.png');

        this.game.load.image('goalSprite', 'MetaBit/assets/goal.png');

        this.game.load.tilemap('level1', 'MetaBit/assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level2', 'MetaBit/assets/level2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level3', 'MetaBit/assets/level3.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level4', 'MetaBit/assets/level4.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tileset', 'MetaBit/assets/tileset.png');


        //loads the example for the animation
        this.game.load.spritesheet('flare', 'MetaBit/assets/SolarFlare.png', 256, 256, 16);
        this.game.load.spritesheet('GroundSlam', 'MetaBit/assets/Ground_Slam_Sprite_Sheet.png', 114, 13, 3,0,0);

        this.game.load.spritesheet('bubble', 'MetaBit/assets/BubbleShield.png', 130, 70, 8);

        this.game.load.spritesheet('playersheetnormal', 'MetaBit/assets/player_sprite_sheet_normal.png', 38, 56, 32,0,0);
        this.game.load.spritesheet('playersheetrage', 'MetaBit/assets/player_sprite_sheet_rage.png', 38, 56, 32,0,0);
        this.game.load.spritesheet('playersheetcolossus', 'MetaBit/assets/player_sprite_sheet_colossus.png', 38, 56, 32,0,0);

        this.game.load.spritesheet('flyingEnemy', 'MetaBit/assets/flying_enemy.png', 53, 30, 7,0,0);
        this.game.load.spritesheet('explodingEnemy', 'MetaBit/assets/bigBoom.png', 62, 73, 4,0,1);
        this.game.load.spritesheet('shootingEnemy', 'MetaBit/assets/shootingEnemy.png', 60, 58, 15,1,1);
        this.game.load.spritesheet('meleeEnemy', 'MetaBit/assets/meleeEnemy.png', 60, 56, 11,0,0);
        this.game.load.image('boss', 'MetaBit/assets/boss.png');
        this.game.load.image('boss_hb_outline', 'MetaBit/assets/boss_healthbar_outline.png');
        this.game.load.image('boss_hb', 'MetaBit/assets/boss_healthbar.png');

        this.game.load.image('HudBG', 'MetaBit/assets/hudBackground.png');
        this.game.load.image('PlayerHB', 'MetaBit/assets/playerHealth.png');
        this.game.load.spritesheet('AbilityIcons', 'MetaBit/assets/AbilityIcons.png', 36, 36, 11,0,0);
        this.game.load.spritesheet('GunIcons', 'MetaBit/assets/gunIcons.png', 110, 35, 4,0,0);

        this.game.load.spritesheet('Bullets', 'MetaBit/assets/BulletSheet.png', 22, 9, 4,0,0);

        this.game.load.image('playBtn', 'MetaBit/assets/playBtn.png');
        this.game.load.image('instructionsBtn', 'MetaBit/assets/instructionsBtn.png');
        this.game.load.image('AbilityListBtn', 'MetaBit/assets/AbilityListBtn.png');
        this.game.load.image('instructions', 'MetaBit/assets/instructionsScreen.png');
        this.game.load.image('AbilityList', 'MetaBit/assets/AbilityList.png');
        this.game.load.image('Logo', 'MetaBit/assets/logo.png');
    },
    create: function(){
        this.game.state.start("Menu");
    }
}
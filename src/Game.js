//variable for player
var player = 0;

//variables for each layer on the tilemap
var layers = [];

//map variable
var map = 0;
var mapTag;
var Ladders;

//enemy and item group variables
var enemyGroup;
var itemGroup;
var boss;
var Goal;

//hud variables
var AmmoText, ClipText, OfSprite,DeSprite, slideSprite, doubleJumpSprite, GunIcon;
var playerHealthBar, bossHealthBar, bosshp;

var Game = function(game){

}
    Game.prototype = {

        create: function(){

            //general level set up, background color, tile map, layers and collision, world size, gravity
            this.game.stage.backgroundColor = '#123465';
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

           //loads the first level
            this.LoadLevel('level1', 'tileset', ['platforms', 'spawning']);
        },
        update: function(){
            //checks if boss is alive and if he is check for collisions
            if(boss != null){
                if(boss.alive == true){
                    boss.followPlayer(player);

                    this.game.physics.arcade.collide(player, boss.bullets, function(player, bullet){
                        player.damage(boss.dps);
                        bullet.kill();
                    });

                    this.game.physics.arcade.collide(layers[0], boss.bullets, function(bullet, layer){
                        bullet.kill();
                    });

                    this.game.physics.arcade.collide(player.playerGun.bullets, boss, function(boss, bullet){
                        console.log('hit');
                    });

                    //if the boss dies restart the game
                } else if(mapTag == 'level4' && boss.alive == false){
                    this.LoadLevel('level1', 'tileset', ['platforms', 'spawning']);
                }
            }

            //skip to the boss level for demo
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.B)){
                this.LoadLevel('level4', 'tileset', ['platforms', 'spawning', 'death']);
            }

            //skip to the boss level for demo
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.C)){
                this.LoadLevel('level1', 'tileset', ['platforms', 'spawning']);
                player.ChangeOffensiveAbility("Flare");
                player.ChangeDefensiveAbility("Bubble Shield");
                player.ChangeGun('Hail');
            }

            //set up collision for the boss and the ground
            this.game.physics.arcade.collide(layers[0], boss);

            //make the player collide with the ground and platforms
            this.game.physics.arcade.collide(player, layers[0]);
            this.game.physics.arcade.collide(Goal, layers[0]);

            //kill the player when he hits the death layer
            this.game.physics.arcade.collide(player, layers[2], function(player, layer){
                player.kill();
            });

            //kill the players bullets when he hits a wall
            this.game.physics.arcade.collide(player.playerGun.bullets, layers[0], function(playerBullet, layer){
                playerBullet.kill();
            });

            //when the player reaches the goal set up the next level
            this.game.physics.arcade.collide(player, Goal, function(player, goal){
                switch(mapTag){
                    case 'level1':

                        this.LoadLevel('level2', 'tileset', ['platforms', 'spawning', 'death']);
                        break;
                    case 'level2':
                        this.LoadLevel('level3', 'tileset', ['platforms', 'spawning', 'death']);
                        break;
                    case 'level3':
                        this.LoadLevel('level4', 'tileset', ['platforms', 'spawning', 'death']);
                        break;
                }

            },null,this);

            //when the player picks up an item add ammo
            this.game.physics.arcade.overlap(itemGroup, player, function (player, item){

                player.playerGun.ammo = player.playerGun.maxAmmo;
                item.kill();
            });

            //resets the player on ladder function so if hes not on one its false
            player.onLadder = false;

            this.game.physics.arcade.overlap(Ladders, player, function(player, ladder){
                player.onLadder = true;
            });

            //when the enemy hits the players flare ability he will take .1 damage per tick
            this.game.physics.arcade.collide(player.offensiveAbility, enemyGroup, function(ability, enemy){
                enemy.damage(0.1);
            });

            if(enemyGroup.length > 0){  //make sure there is at least one enemy on the map

                //ground to enemy collision
                this.game.physics.arcade.collide(enemyGroup, layers[0]);

                //when player bullet hits enemy check what abilities are active and damage for the correct ammount
                this.game.physics.arcade.overlap(player.playerGun.bullets,enemyGroup, function(bullet, enemy){
                    bullet.kill();

                    if(player.offensiveAbilityTag == 'Powershot' && player.offensiveAbilityActive == true){
                        enemy.damage(player.playerGun.Dpb*3);
                        console.log(player.playerGun.Dpb);
                        player.offensiveAbilityActive = false;
                        //if the player ability is infect then half the enemy attack speed and movement speed
                    }else if(player.offensiveAbilityTag == 'Infect' && player.offensiveAbilityActive == true){
                        enemy.speed = enemy.speed/2;
                        enemy.attackSpeed = enemy.attackSpeed*2;
                        enemy.damage(player.playerGun.Dpb);
                    }
                    else {
                        enemy.damage(player.playerGun.Dpb);
                    }

                });

                //if the enemy hits the bullet shield call the collide behaviour
                this.game.physics.arcade.collide(enemyGroup, player.defensiveAbility, function (playerAbility, enemy){
                    if(player.defensiveAbilityTag == 'Bubble Shield')
                        enemy.CollideBehaviour(playerAbility);
                });

                //cycle through the enemy group
                for(var e = 0; e < enemyGroup.length; e++) {

                    //remove the enemy from the group when he dies
                    if(enemyGroup.getAt(e).health <= 0){
                        enemyGroup.remove(e, true);
                        enemyGroup.getAt(e).destroy();
                    }

                    //check for collision between the player and the enemy bullets
                    this.game.physics.arcade.collide(enemyGroup.getAt(e).bullets, player, function(player, enemyBullet){
                        player.damage(enemyGroup.getAt(e).dps);
                        enemyBullet.kill();
                    });

                    //bubble shield collision for enemy bullets
                    this.game.physics.arcade.collide(enemyGroup.getAt(e).bullets, player.defensiveAbility, function(playerAbility, enemyBullet){
                        playerAbility.damage(1);
                        enemyBullet.damage(1);
                    })

                    //stops a shooter enemy from moving too far away from the player
                    if(enemyGroup.getAt(e).type == "shooter"){
                        enemyGroup.getAt(e).followingPlayer = false;
                        enemyGroup.getAt(e).body.velocity.x = 0;
                    }

                    //reset sees player variable
                    enemyGroup.getAt(e).seesPlayer = false;

                    this.game.physics.arcade.overlap(enemyGroup.getAt(e).sight, player, function(player, enemy){
                        enemyGroup.getAt(e).seesPlayer = true;
                    });

                    if(enemyGroup.getAt(e).seesPlayer == true){
                        enemyGroup.getAt(e).SightBehaviour(player.x);
                    }

                    if(enemyGroup.getAt(e).followingPlayer == true){
                        enemyGroup.getAt(e).followPlayer(player);
                    }
                }
            }

            //if the enemy collides with the player call the collide behaviour
            this.game.physics.arcade.overlap(enemyGroup, player, function (player, enemy){
                enemy.CollideBehaviour(player);
            });

            //when the player dies reset the game
            if(player.alive == false){
                this.LoadLevel('level1', 'tileset', ['platforms', 'spawning']);
            }

            //fianly update the game hud
            this.UpdateHud();

        },
        LoadLevel: function(level, tileset, newLayers){
            //remove everything from the game world
            this.game.world.removeAll();

            //reset all the variables
            enemyGroup = this.game.add.group();
            itemGroup = this.game.add.group();
            Ladders = this.game.add.group();

            map = this.game.add.tilemap(level);
            mapTag = level;

            map.addTilesetImage(tileset);

            layers = [];

            newLayers.forEach(function(curr, index, array){
                layers[index] = map.createLayer(curr);
            });

            //reset the collision layers and the physics
            map.setCollision([0,1,2,3,4,5,6],true,layers[0]);
            map.setCollision([11],true,layers[2]);
            layers[0].resizeWorld();
            this.game.physics.arcade.gravity.y = 600;

            //make the second layer invisible
            layers[1].visible = false;

            //map array for placing all the objects
            var mapArray = layers[1].getTiles(0,0,this.game.world.width, this.game.world.height);

            //loop through all the tiles in the map
            for(var i = 0; i < mapArray.length; i++){
                //create a variable to test against the tiles
                var myTile = mapArray[i];

                var TileMid = myTile.worldX + 32;

                if(myTile.index == 8){

                    //create player and add him to the game and give him physics
                    player = new Player(this.game, myTile.worldX, myTile.worldY, 'playersheetnormal', 300, 290);
                    this.game.add.existing(player);
                    player.RndAbilities();
                }

                if(myTile.index == 7){
                    var ladder = new Ladder(this.game, myTile.worldX, myTile.worldY, 'ladder');
                    Ladders.add(ladder);
                }

                //if the tile index is 2 create an enemy at that tiles position and add him to the game
                if(myTile.index == 9){
                    var enemiesToAdd = [];
                    var RndEnemy = Math.floor(Math.random() * 4) + 1

                    switch (RndEnemy){
                        case 1: //flying

                            enemiesToAdd[0] = new Enemy(this.game, TileMid, myTile.worldY, 'flyingEnemy', 150, 'flying', 250, 15, 3, 0.5);
                            break;
                        case 2: //shooter
                            enemiesToAdd[0] = new Enemy(this.game, TileMid, myTile.worldY, 'shootingEnemy', 150, 'shooter', 250, 20, 10, 1);
                            break;
                        case 3: //melee
                            enemiesToAdd[0] = new Enemy(this.game, TileMid, myTile.worldY, 'meleeEnemy', 150, 'melee', 250, 10, 7, 0.5);
                            break;
                        case 4: //exploding
                            enemiesToAdd[0] = new Enemy(this.game, TileMid, myTile.worldY, 'explodingEnemy', 150, 'exploding', 250, 50, 5, 0);
                            break;
                    }

                    enemyGroup.add(enemiesToAdd[0]);

                }

                //if the tiles index is 3 then add an item to the game and place it at the tiles position
                if(myTile.index == 10){
                    var item = new Item(this.game, myTile.worldX, myTile.worldY, 'itemimg', 'item');
                    itemGroup.add(item);
                }

                if(myTile.index == 12){
                    //create goal when the tile index is 12
                    Goal = this.game.add.sprite(myTile.worldX, myTile.worldY, 'goalSprite');
                    this.game.physics.enable(Goal, Phaser.Physics.ARCADE);
                    Goal.body.immovable = true;
                }
            }

            //make the camera follow the player
            this.game.camera.follow(player);

            if(level == 'level4'){
                boss = new Enemy(this.game, 705, 150, 'boss', 150, 'boss', 0, 10, 25, 0.5);
                //game.add.existing(boss);
                enemyGroup.add(boss);
            }

            //reload the game hud
            this.LoadHud();

        },//function for quick position of sprites on the hud
        PositionOnHud: function(x,y,sprite){
            sprite.fixedToCamera = true;
            sprite.cameraOffset.x = x;
            sprite.cameraOffset.y = y;
        },
        LoadHud: function(){
            var HudStyle = {font: '12px Arial', fill: '#000000'}

            var HudBackground = this.game.add.image(0,0,'HudBG');
            this.PositionOnHud(0,539,HudBackground);

            var OfKey = this.game.add.text(0,0,'E',HudStyle);
            this.PositionOnHud(155,582,OfKey);

            var DeKey = this.game.add.text(0,0,'Q',HudStyle);
            this.PositionOnHud(96,582,DeKey);

            OfSprite = this.game.add.sprite(0,0,'AbilityIcons',8);
            this.PositionOnHud(142,546,OfSprite);

            DeSprite = this.game.add.sprite(0,0,'AbilityIcons',8);
            this.PositionOnHud(84,546,DeSprite);

            slideSprite = this.game.add.sprite(0,0,'AbilityIcons',10);
            this.PositionOnHud(190,553,slideSprite);
            slideSprite.visible = false;

            doubleJumpSprite = this.game.add.sprite(0,0,'AbilityIcons',9);
            this.PositionOnHud(236,553,doubleJumpSprite);
            doubleJumpSprite.visible = false;

            playerHealthBar = this.game.add.sprite(0,0,'PlayerHB');
            this.PositionOnHud(297,559,playerHealthBar);
            playerHealthBar.cropEnabled = true;

            AmmoText = this.game.add.text(0,0,'',{font: '18px Arial', fill: '#000000'});
            this.PositionOnHud(701,572,AmmoText);

            ClipText = this.game.add.text(0,0,'',{font: '18px Arial', fill: '#000000'});
            this.PositionOnHud(701,550,ClipText);

            GunIcon = this.game.add.sprite(0,0,'GunIcons',3);
            this.PositionOnHud(570,555,GunIcon);

            if(mapTag == 'level4'){
                if(boss.alive == true){
                    bossHealthBar = this.game.add.sprite(0,0,'boss_hb');
                    var outline = this.game.add.image(0,0,'boss_hb_outline');
                    outline.anchor.setTo(.5,.5);
                    this.PositionOnHud(202,15,bossHealthBar);
                    this.PositionOnHud(400,25,outline);
                    bossHealthBar.cropEnabled = true;

                }
            }

        },
        UpdateHud: function(){
            AmmoText.setText(player.playerGun.ammo.toString());

            ClipText.setText(player.playerGun.currClip.toString());

            playerHealthBar.crop(new Phaser.Rectangle(0,0,(200 * (player.health / 100)), playerHealthBar.height));

            if(mapTag == 'level4'){
                if(boss.alive == true){
                    bossHealthBar.crop(new Phaser.Rectangle(0,0,(400* (boss.health / 25)), bossHealthBar.height));
                }
            }

            switch(player.offensiveAbilityTag){
                case 'Flare':
                    OfSprite.frame = 0;
                    break;
                case 'Powershot':
                    OfSprite.frame = 7;
                    break;
                case 'Infect':
                    OfSprite.frame = 4;
                    break;
                case 'Rage':
                    OfSprite.frame = 2;
                    break;

            }

            switch(player.defensiveAbilityTag){
                case 'Panic':
                    DeSprite.frame = 6;
                    break;
                case 'Colossus':
                    DeSprite.frame = 3;
                    break;
                case 'Bubble Shield':
                    DeSprite.frame = 1;
                    break;
                case 'Ground Slam':
                    DeSprite.frame = 5;
                    break;

            }

            switch (player.playerGun.type){
                case 'Hail':
                    GunIcon.frame = 2;
                    break;
                case 'Buckshot':
                    GunIcon.frame = 1;
                    break;
                case 'Bullseye':
                    GunIcon.frame = 3;
                    break;
                case 'Potshot':
                    GunIcon.frame = 0;
                    break;
            }

            if(player.slide == true){
                slideSprite.visible = true;
            } else{
                slideSprite.visible = false;
            }

            if(player.doubleJump == true){
                doubleJumpSprite.visible = true;
            } else{
                doubleJumpSprite.visible = false;
            }
        }
    }

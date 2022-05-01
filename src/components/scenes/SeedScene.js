import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';
import { Enemy, Player } from '../objects';
import * as THREE from 'three';
import Background from './background.png';

const SCORE_POS = window.innerWidth/window.innerHeight * 2;
class SeedScene extends Scene {
    constructor(camera) {
        // Call parent Scene() constructor
        super();

        // Need this to convert mouse coordinates to scene coordinates
        this.camera = camera;

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            updateEnemyList: [],
            updatePlayerBulletList: [],
            score: 0,
        };

        // Set background
        // const loader = new THREE.TextureLoader();
        var scene = this;
        const map = new THREE.TextureLoader().load( Background );
        this.background = map;

        const player = new Player(this);
        this.player = player;
        this.add(player);

        //Display score
        const textLoader = new THREE.FontLoader();
        //var pos = this.player.position.clone();
        textLoader.load('https://components.ai/api/v1/typefaces/geostar/normal/400', function (font) {
            var text = 'SCORE: ' + scene.state.score;
            const textObj = new THREE.TextGeometry(text, {
                font: font,
                size: 0.2,
                height: 0.02,
                bevelEnabled: false,
            });
            const material = new THREE.MeshBasicMaterial({color: 'white'});
            const mesh = new THREE.Mesh(textObj, material);
            mesh.name = "score";
            mesh.position.set(SCORE_POS, SCORE_POS, 0);

            scene.add(mesh);
            
        });

        // Dynamically Generate Enemies
        this.lifetime = 0;  // This lifetime is used to determine if no enemy has died for X amount of time
        this.spawnTimer = 0; // This timer is used to give a bit of time before enemies spawn
        this.randSpawnLimit = Math.random() * 60 + 60;
        // Time it takes for an enemy to spawn assuming no kills
        // Starts at 1000, but decreases upon enemy kill to increase difficulty
        this.difficultyCounter = 1000;  
        this.enemiesKilled = 0;

        // Figure out a way to dynamically generate enemies
        var enemyPosition = new THREE.Vector3(0, 2, 0);
        const enemy = new Enemy(this, player, enemyPosition);
        this.add(enemy);
        
        // Add meshes to scene
        //const land = new Land();
        //const flower = new Flower(this);
        //const lights = new BasicLights();
        //this.add(land, flower, lights);

        // Populate GUI
        //this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        this.active = true;
    }

    addToUpdateList(object, type) {
        this.state.updateList.push(object);
        // add to list of enemies
        if (type == "enemy") {
            this.state.updateEnemyList.push(object);
        } else if (type == "playerBullet") {
            // add to list of Player Bullets
            this.state.updatePlayerBulletList.push(object);
        }
    }

    removeFromUpdateList(object, type, despawn = false) {
        this.remove(object);
        var index = this.state.updateList.indexOf(object);
        this.state.updateList.splice(index, 1);
        if (type == "enemy") {
            var index1 = this.state.updateEnemyList.indexOf(object);
            this.state.updateEnemyList.splice(index1, 1);
            if (despawn == false) {
                this.state.score++;
            }

            //Update display score
            const textLoader = new THREE.FontLoader();
            var scene = this;
            var scoreMesh = scene.getObjectByName("score");
            this.remove(scoreMesh);
            var pos = this.camera.position.clone();
            textLoader.load('https://components.ai/api/v1/typefaces/geostar/normal/400', function (font) {
                var text = 'SCORE: ' + scene.state.score;
                const textObj = new THREE.TextGeometry(text, {
                    font: font,
                    size: 0.2,
                    height: 0.02,
                    bevelEnabled: false,
                });
                const material = new THREE.MeshBasicMaterial({color: 'white'});
                const mesh = new THREE.Mesh(textObj, material);
                mesh.name = "score";
                mesh.position.set(SCORE_POS+pos.x, SCORE_POS+pos.y, 0);
                scene.add(mesh);
            });
        }
        else if (type == "playerBullet") {
            var index1 = this.state.updatePlayerBulletList.indexOf(object);
            this.state.updatePlayerBulletList.splice(index1, 1);
        }
    }

    // Call this when game over
    // Remove all from Update List
    removeAllFromUpdateList() {
        this.state.updateList = [];
        this.state.updateEnemyList = [];
        this.state.updatePlayerBulletList = [];
        console.log("GAME OVER");
        //this.background = new Color(0x808080);
        const loader = new THREE.FontLoader();
        var scene = this;

        var pos = this.camera.position.clone();

        loader.load('https://components.ai/api/v1/typefaces/geostar/normal/400', function (font) {
            const textObj = new THREE.TextGeometry('GAME OVER', {
                font: font,
                size: 0.5,
                height: 0.1,
                bevelEnabled: false,
            });
            const material = new THREE.MeshBasicMaterial({color: 'white'});
            const mesh = new THREE.Mesh(textObj, material);

            var bbox = new THREE.Box3().setFromObject(mesh);

            var xLen = (bbox.max.x - bbox.min.x)/2;
            var yLen = (bbox.max.y - bbox.min.y)/2;

            mesh.position.set(pos.x -xLen, pos.y - yLen, 0);

            scene.add(mesh);
            
        });

        this.active = false;
    }

    // Create an enemy a distance of between 2 and 4 from the player in a random direction
    createEnemy() {
        if (this.active == true) {
            var dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).normalize();
            var dist = (Math.random() * 2) + 2;
            var enemyPosition = this.player.position.clone().add(dir.multiplyScalar(dist));
            var enemy = new Enemy(this, this.player, enemyPosition);
            this.add(enemy);
        }

    }

    convertMouseToSceneCoords(mouseLocationX, mouseLocationY) {
        var vec = new THREE.Vector3(); // create once and reuse
        var pos = new THREE.Vector3(); // create once and reuse

        vec.set(
            ( mouseLocationX / window.innerWidth ) * 2 - 1,
            - ( mouseLocationY / window.innerHeight ) * 2 + 1,
            0.5 );

        vec.unproject(this.camera);
        vec.sub(this.camera.position).normalize();
        
        var distance = - this.camera.position.z / vec.z;
        
        pos.copy(this.camera.position).add(vec.multiplyScalar(distance));
        return pos;
    }

    update(timeStamp) {
        if (this.active == true) {
            const { rotationSpeed, updateList, updateEnemyList, updatePlayerBulletList } = this.state;
            //console.log(updateList);
            //console.log(updateEnemyList);
            //console.log(updatePlayerBulletList);
            //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

            // Call update for each object in the updateList
            for (const obj of updateList) {
                obj.update(timeStamp);
            }

            // Collision detection for player bullet and Enemies
            for (const playerBullet of updatePlayerBulletList) {
                // Since enemies might be larger, treating circular enemies as squares might be a bit bad, since it doesn't favor the player
                // This is in contrast to treating bullets as boxes, since they're so small
                // And in contrast to treating the player as a box, since it helps the player
                var bulletBoundingBox = this.createBoundingBox(playerBullet.position, playerBullet.radius);

                for (const enemy of updateEnemyList) {
                    var enemyBoundingBox = this.createBoundingBox(enemy.position, enemy.radius);
                    if (bulletBoundingBox.intersectsBox(enemyBoundingBox)) {
                        this.removeFromUpdateList(playerBullet, "playerBullet");
                        console.log("contact");
                        enemy.takeDamage(playerBullet.damage);
                        console.log(this.state.score);
                    }
                }
            }

            // Animate Background
            // const loader = new THREE.TextureLoader();
            // var scene = this;
            // loader.load('https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' , function(texture)
            // {
            //     texture.rotation = timeStamp / 500000;
            //     scene.background = texture;  
            // });

            // Enemy Generation
            // Generate enemy if lifetime has been too long
            var timer = this.difficultyCounter - (50*this.enemiesKilled);
            if (timer < 500) {
                timer = 500;
            }
            if (this.lifetime > timer) {
                this.createEnemy();
                this.lifetime = 0;
            }
            this.lifetime++;
            // Generate enemy based on spawn timer so enemies don't immediately spawn
            if (updateEnemyList.length == 0) {
                this.spawnTimer++;
            }
            if (this.spawnTimer > this.randSpawnLimit) {
                this.randSpawnLimit == Math.random() * 60;
                this.spawnTimer = 0;
                this.lifetime = 0;
                this.createEnemy();
            }

            // Purge enemies that are too far away from the camera
            // Rather than using an internal lifetime, it's basically the same if an enemy too far away just disappears
            for (const enemy of updateEnemyList) {
                if (this.checkInBounds(enemy.position) == false) {
                    this.removeFromUpdateList(enemy, "enemy", true);
                    console.log("despawn");
                }
            }
        }
    }

    // Check if an enemy is visible or not
    checkInBounds(enemyPos) {
        var leeway = 4;  // Determines how far off the screen the enemy can be before despawning
        var min = this.convertMouseToSceneCoords(0, window.innerHeight);
        var max = this.convertMouseToSceneCoords(window.innerWidth, 0);
        if (enemyPos.x > (min.x - leeway) && enemyPos.x < (max.x + leeway)) {
            if (enemyPos.y > (min.y - leeway) && enemyPos.y < (max.y + leeway)) {
                return true;
            }
        }
        return false;
    }

    // Create a Box2 representing the bounding box of a circular entity with given radius and center
    // Redundant with the code in EnemyBullet.js
    createBoundingBox(center, rad) {
        var temp = center.clone();
        var min = new THREE.Vector2(temp.x - (rad*Math.sqrt(2)/2), temp.y - (rad*Math.sqrt(2)/2));
        var max = new THREE.Vector2(temp.x + (rad*Math.sqrt(2)/2), temp.y + (rad*Math.sqrt(2)/2));
        var out = new THREE.Box2(min, max);
        return out;
    }
}

export default SeedScene;

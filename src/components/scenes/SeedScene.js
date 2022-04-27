import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';
import { Enemy, Player } from '../objects';
import * as THREE from 'three'

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
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        const player = new Player(this);
        this.add(player);

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

    removeFromUpdateList(object, type) {
        this.remove(object);
        var index = this.state.updateList.indexOf(object);
        this.state.updateList.splice(index, 1);
        if (type == "enemy") {
            var index1 = this.state.updateEnemyList.indexOf(object);
            this.state.updateEnemyList.splice(index1, 1);
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
        this.active = false;
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
                }
            }
        }
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

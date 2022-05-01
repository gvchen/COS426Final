import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'
import { PlayerBullet } from '../PlayerBullet';
import PLAYER from './player.png';

const KEY_UP = 87; // W
const KEY_DOWN = 83; // S
const KEY_LEFT = 65; // A
const KEY_RIGHT = 68; // D

const SHIFT_LEFT = 16; // SHIFT
const NORMAL_SPEED = 0.025;
const FOCUS_SPEED = 0.01;

const KEY_ROTATE_LEFT = 81; // Q
const KEY_ROTAtE_RIGHT = 69; // E

class Player extends Sprite {
    constructor(parent) {
        super();

        // Set Texture and starting position
        const map = new TextureLoader().load( PLAYER );
        const material = new SpriteMaterial( { map: map } );
        this.material = material;
        this.position.set(0, 0, 0);
        this.scale.set(0.2, 0.2, 1);

        // Movement
        this.speed = NORMAL_SPEED;
        window.addEventListener("keydown", (evt) => this.handleKeyEvent(this, evt));
        window.addEventListener("keyup", (evt) => this.handleUpEvent(this, evt));
        this.keyState = [];

        // Screen rotation
        /*this.rotateLeft = false;
        this.rotateRight = false;*/

        // Shooting
        window.addEventListener("mousedown", (evt) => this.handleMouseDownEvent(this, evt) )
        window.addEventListener("mouseup", (evt) => this.handleMouseUpEvent(this, evt) )
        window.addEventListener("mousemove", (evt) => this.handleMouseMoveEvent(this, evt) )

        this.shooting = false;
        this.mouseLocationX;
        this.mouseLocationY;
        this.timeOuts = []; // This contains timeOuts for bullet shooting

        // Parent (scene) interaction
        this.parent = parent;
        parent.addToUpdateList(this);

        // Hitbox calculation
        this.radius = 0.05;
    }

    // Movement
    handleKeyEvent(player, event) {
        if (event.keyCode == KEY_UP || event.keyCode == KEY_DOWN || event.keyCode == KEY_LEFT || event.keyCode == KEY_RIGHT) {
            this.keyState[event.keyCode] = true;
            //console.log(this.keyState);
        }
        if (event.keyCode == SHIFT_LEFT) {
            this.speed = FOCUS_SPEED
        }
        /*if (event.keyCode == KEY_ROTATE_LEFT) {
            this.rotateLeft = true;
        }
        if (event.keyCode == KEY_ROTAtE_RIGHT) {
            this.rotateRight = true;
        }*/
    }
    handleUpEvent(player, event) {
        if (event.keyCode == KEY_UP || event.keyCode == KEY_DOWN || event.keyCode == KEY_LEFT || event.keyCode == KEY_RIGHT) {
            this.keyState[event.keyCode] = false;
            //console.log(this.keyState);
        }
        if (event.keyCode == SHIFT_LEFT) {
            this.speed = NORMAL_SPEED;
        }
        /*if (event.keyCode == KEY_ROTATE_LEFT) {
            this.rotateLeft = false;
        }
        if (event.keyCode == KEY_ROTAtE_RIGHT) {
            this.rotateRight = false;
        }*/
    }

    // Shooting
    handleMouseDownEvent(player, event) {
        // Make sure the game isn't dead
        if (player.parent.active != false) {
            this.shooting = true;
            this.createBullet(player, event);
        }
    }
    handleMouseUpEvent(player, event) {
        this.shooting = false;
        // Clear all timeouts
        for (let i = 0; i < this.timeOuts.length; i++) {
            window.clearInterval(this.timeOuts[i]);
        }
    }
    handleMouseMoveEvent(player, event) {
        player.mouseLocationX = event.clientX;
        player.mouseLocationY = event.clientY;
    }
    // Create a bullet at the player's current position
    createBullet(player, event) {
        var shootingSpeed = 100; // Bullet shot every X milliseconds
        if (event.which == 1 && player.shooting == true && player.parent.active == true) {
            //var sceneCoords = player.parent.convertMouseToSceneCoords(player.mouseLocationX, player.mouseLocationY);
            /*if (Number.isNaN(sceneCoords.x)) {
                setTimeout(player.createBullet, shootingSpeed, player, event);
                return;
            }*/
            
            // EXTREMELY JANK SOLUTION TO CAMERA CENTERING
            // SPAGETTI ALERT
            /*var sceneCoordsX = ( player.mouseLocationX / window.innerWidth ) * 2 - 1;
            var sceneCoordsY = -( player.mouseLocationY / window.innerHeight ) * 2 + 1
            var sceneCoords = new THREE.Vector3(sceneCoordsX, sceneCoordsY, 0.5);*/

            var sceneCoords = player.convertMouseToSceneCoords(player.mouseLocationX, player.mouseLocationY);

            if (Number.isNaN(sceneCoords.x)) {
                setTimeout(player.createBullet, shootingSpeed, player, event);
                return;
            }

            sceneCoords.add(player.position);
            //sceneCoords.unproject(player.parent.camera);

            var speed = 0.05;
            var direction = sceneCoords.sub(player.position).normalize();
            direction = sceneCoords.clone().normalize();

            var playerBullet = new PlayerBullet(player.parent, player.position, direction, speed);
            player.parent.add(playerBullet);

            var timeoutId = setTimeout(player.createBullet, shootingSpeed, player, event);
            player.timeOuts.push(timeoutId);
        }
    }

    // RESULT OF SPAGETTI
    convertMouseToSceneCoords(mouseLocationX, mouseLocationY) {
        var vec = new THREE.Vector3(); // create once and reuse
        var pos = new THREE.Vector3(); // create once and reuse

        vec.set(
            ( mouseLocationX / window.innerWidth ) * 2 - 1,
            - ( mouseLocationY / window.innerHeight ) * 2 + 1,
            0.5 );
        
        var tempCam = new THREE.PerspectiveCamera();
        const { innerHeight, innerWidth } = window;
        tempCam.aspect = innerWidth / innerHeight;
        tempCam.updateProjectionMatrix();
        tempCam.position.set(0, 0, 10);

        vec.unproject(tempCam);
        vec.sub(tempCam.position).normalize();
        
        var distance = - tempCam.position.z / vec.z;
        
        pos.copy(tempCam.position).add(vec.multiplyScalar(distance));
        return pos;
    }

    /*getPlayerDirection(){
        var dir = new THREE.Vector3(0, 0, 0);
        if (this.keyState[KEY_UP] == true) {
            dir.add(new THREE.Vector3(0,  this.speed,  0));
        }
        if (this.keyState[KEY_DOWN] == true) {
            dir.add(new THREE.Vector3(0,  -this.speed,  0));
        }
        if (this.keyState[KEY_LEFT] == true) {
            dir.add(new THREE.Vector3(-this.speed,  0,  0));
        }
        if (this.keyState[KEY_RIGHT] == true) {
            dir.add(new THREE.Vector3(this.speed,  0,  0));
        }
        return dir;
    }*/

    update() {
        //console.log("HI");
        if (this.keyState[KEY_UP] == true) {
            this.position.add(new THREE.Vector3(0,  this.speed,  0));
            this.parent.camera.position.add(new THREE.Vector3(0,  this.speed,  0));

            var scoreMesh = this.parent.getObjectByName("score");
            console.log(scoreMesh.position);
            scoreMesh.position.add(new THREE.Vector3(0,  this.speed,  0));
            console.log(scoreMesh.position);
        }
        if (this.keyState[KEY_DOWN] == true) {
            this.position.add(new THREE.Vector3(0,  -this.speed,  0));
            this.parent.camera.position.add(new THREE.Vector3(0,  -this.speed,  0));
            
            var scoreMesh = this.parent.getObjectByName("score");
            console.log(scoreMesh.position);
            scoreMesh.position.add(new THREE.Vector3(0,  -this.speed,  0));
            console.log(scoreMesh.position);
        }
        if (this.keyState[KEY_LEFT] == true) {
            this.position.add(new THREE.Vector3(-this.speed,  0,  0));
            this.parent.camera.position.add(new THREE.Vector3(-this.speed,  0,  0));

            var scoreMesh = this.parent.getObjectByName("score");
            console.log(scoreMesh.position);
            scoreMesh.position.add(new THREE.Vector3(-this.speed,  0,  0));
            console.log(scoreMesh.position);
        }
        if (this.keyState[KEY_RIGHT] == true) {
            this.position.add(new THREE.Vector3(this.speed,  0,  0));
            this.parent.camera.position.add(new THREE.Vector3(this.speed,  0,  0));

            var scoreMesh = this.parent.getObjectByName("score");
            console.log(scoreMesh.position);
            scoreMesh.position.add(new THREE.Vector3(this.speed,  0,  0));
            console.log(scoreMesh.position);
        }

        /*
        if (this.rotateLeft == true) {
            this.parent.camera.rotation.z += 0.01;
        }
        if (this.rotateRight == true) {
            this.parent.camera.rotation.z -= 0.01;
        }*/
    }
}   

export default Player;
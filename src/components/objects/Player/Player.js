import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'
import { PlayerBullet } from '../PlayerBullet';

const KEY_UP = 87; // W
const KEY_DOWN = 83; // S
const KEY_LEFT = 65; // A
const KEY_RIGHT = 68; // D

class Player extends Sprite {
    constructor(parent) {
        super();

        // Set Texture and starting position
        const map = new TextureLoader().load( 'https://blog.fastforwardlabs.com/images/2018/02/circle_aa-1518730700478.png' );
        const material = new SpriteMaterial( { map: map } );
        this.material = material;
        this.position.set(0, 0, 0);
        this.scale.set(0.1, 0.1, 1);

        // Movement
        this.speed = 0.025;
        window.addEventListener("keydown", (evt) => this.handleKeyEvent(this, evt));
        window.addEventListener("keyup", (evt) => this.handleUpEvent(this, evt));
        this.keyState = [];

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
    }
    handleUpEvent(player, event) {
        if (event.keyCode == KEY_UP || event.keyCode == KEY_DOWN || event.keyCode == KEY_LEFT || event.keyCode == KEY_RIGHT) {
            this.keyState[event.keyCode] = false;
            //console.log(this.keyState);
        }
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
            var sceneCoords = player.parent.convertMouseToSceneCoords(player.mouseLocationX, player.mouseLocationY);
            if (Number.isNaN(sceneCoords.x)) {
                setTimeout(player.createBullet, shootingSpeed, player, event);
                return;
            }
            var direction = sceneCoords.sub(player.position).normalize();
            var playerBullet = new PlayerBullet(player.parent, player.position, direction);
            player.parent.add(playerBullet);

            var timeoutId = setTimeout(player.createBullet, shootingSpeed, player, event);
            player.timeOuts.push(timeoutId);
        }
    }

    update() {
        //console.log("HI");
        if (this.keyState[KEY_UP] == true) {
            this.position.add(new THREE.Vector3(0,  this.speed,  0));
        }
        if (this.keyState[KEY_DOWN] == true) {
            this.position.add(new THREE.Vector3(0,  -this.speed,  0));
        }
        if (this.keyState[KEY_LEFT] == true) {
            this.position.add(new THREE.Vector3(-this.speed,  0,  0));
        }
        if (this.keyState[KEY_RIGHT] == true) {
            this.position.add(new THREE.Vector3(this.speed,  0,  0));
        }
    }
}   

export default Player;
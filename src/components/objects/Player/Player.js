import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

class Player extends Sprite {
    constructor(parent) {
        super();

        const map = new TextureLoader().load( 'https://blog.fastforwardlabs.com/images/2018/02/circle_aa-1518730700478.png' );
        const material = new SpriteMaterial( { map: map } );

        this.material = material;
        this.position.set(0, 0, 0);
        this.scale.set(0.1, 0.1, 1);

        this.speed = 0.05;

        this.keyState = [];

        parent.addToUpdateList(this);

        window.addEventListener("keydown", (evt) => this.handleKeyEvent(this, evt));
        window.addEventListener("keyup", (evt) => this.handleUpEvent(this, evt))
    }

    handleKeyEvent(player, event) {
        if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
            this.keyState[event.keyCode] = true;
            //console.log(this.keyState);
        }
    }

    handleUpEvent(player, event) {
        if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
            this.keyState[event.keyCode] = false;
            //console.log(this.keyState);
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
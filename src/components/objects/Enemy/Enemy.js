import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'

class Enemy extends Sprite {
    constructor(parent, position) {
        super();

        const map = new TextureLoader().load( 'https://blog.fastforwardlabs.com/images/2018/02/circle_aa-1518730700478.png' );
        const material = new SpriteMaterial( { map: map } );

        this.material = material;
        this.position.copy(position);
        this.scale.set(0.3, 0.3, 1);

        parent.addToUpdateList(this);

        // We can have another object dedicated to shot patterns
        // This way each shot pattern of an enemy does not need a unique object
        //this.generate();
    }

    // Random movement for enemy?
    update() {
    
    }

    // Function that creates bullets using the object dedicated to shot patterns
    // For testing purposes, Hard code patterns within the Enemy object, with a parameter that selects patterns
    // Preferably an object will be used in the future
    generate() {
        //var direction = new THREE.Vector3(0, 1, 0);
        //var rotation = new THREE.Euler(1, 1, 0);
        //while (true) {
        setInterval(this.pattern1, 1000);
        //}
    }

    pattern1(direction, rotation) {
        console.log("HI");
    }
}

export default Enemy;
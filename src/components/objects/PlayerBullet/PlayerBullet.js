import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'
import PLAYER from './player1.png';


class PlayerBullet extends Sprite {
    constructor(parent, playerPosition, direction, speed = 0.05) {
        super();

        // Set Texture and Starting Position
        const map = new TextureLoader().load( PLAYER );
        const material = new SpriteMaterial( { map: map } );
        this.material = material;
        this.position.copy(playerPosition);
        this.scale.set(0.05, 0.05, 1);

        // Parameters
        this.direction = direction.clone();          // Direction of bullet
        this.speed = speed;                           // Movement Speed
        this.startPosition = playerPosition.clone(); // Position
        this.maxDistance = 5; // Distance that the bullet covers before disappearing

        // Not entirely sure how the scale of the scene works
        // A function that defines it is better than magic numbers

        // Parent (scene) interaction
        parent.addToUpdateList(this, "playerBullet");

        // Damage parameter
        this.damage = 1;  // Hard code damage since there's only one shot type

        // Hitbox calculation
        this.radius = 0.025;
    }

    update() {
        this.position.add(this.direction.clone().multiplyScalar(this.speed));
        if (this.position.distanceToSquared(this.startPosition) > this.maxDistance * this.maxDistance) {
            // Call a remove function
            this.parent.removeFromUpdateList(this, "playerBullet");
        }
    }
}

export default PlayerBullet;
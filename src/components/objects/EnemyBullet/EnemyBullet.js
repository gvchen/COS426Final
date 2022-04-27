import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'

class EnemyBullet extends Sprite {
    constructor(parent, enemyPosition, direction) {
        super();

        const map = new TextureLoader().load( 'https://blog.fastforwardlabs.com/images/2018/02/circle_aa-1518730700478.png' );
        const material = new SpriteMaterial( { map: map } );

        this.material = material;
        this.position.copy(enemyPosition);
        this.scale.set(0.05, 0.05, 1);

        // Vector for direction of bullet
        this.direction = direction;

        // Parameters
        this.speed = 0.05;
        this.startPosition = enemyPosition.clone();
        this.maxDistance = 5; // Distance that the bullet covers before disappearing
        // Not entirely sure how the scale of the scene works
        // A function that defines it is better than magic numbers

        parent.addToUpdateList(this);
    }

    update() {
        this.position.add(this.direction.clone().multiplyScalar(this.speed));
        if (this.position.distanceToSquared(this.startPosition) > this.maxDistance * this.maxDistance) {
            // Call a remove function
            this.parent.removeFromUpdateList(this);
        }
    }
}

export default EnemyBullet;
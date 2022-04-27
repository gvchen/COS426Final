import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'
import TEXTURE from './arrow.png';

class EnemyBullet extends Sprite {
    constructor(parent, enemyPosition, direction, speed, angularSpeed, bulletType = "base") {
        super();

        var map;
        var material;
        if (bulletType == "base") {
            map = new TextureLoader().load( 'https://blog.fastforwardlabs.com/images/2018/02/circle_aa-1518730700478.png' );
            material = new SpriteMaterial( { map: map } );
            this.scale.set(0.05, 0.05, 1);
            // Set hitbox here
        }
        if (bulletType == "arrow") {
            var loader = new THREE.TextureLoader();
            loader.setCrossOrigin('anonymous');
            map = loader.load( TEXTURE );
            //console.log(map);
            //console.log(direction);
            //console.log(direction.clone().angleTo(new THREE.Vector3(1, 0, 0)));
            map.center.set(.5, .5);
            var angle = new THREE.Vector2(direction.x, direction.y);
            map.rotation = angle.angle();
            material = new SpriteMaterial( { map: map } );
            //this.scale.set(0.5, 0.5, 1);
        }

        this.material = material;
        this.position.copy(enemyPosition);
        

        // Vector for direction of bullet
        this.direction = direction.clone();

        // Parameters
        this.speed = speed;
        this.angularSpeed = angularSpeed;
        

        this.startPosition = enemyPosition.clone();

        this.lifetime = 0;
        this.maxLifetime = 750;
        this.maxDistance = 5; // Distance that the bullet covers before disappearing
        // Not entirely sure how the scale of the scene works
        // A function that defines it is better than magic numbers

        parent.addToUpdateList(this);
    }

    // This needs to be able to do non linear movement as well
    update() {
        this.position.add(this.direction.clone().multiplyScalar(this.speed));
        var axis = new THREE.Vector3(0, 0, 1); // Z AXIS
        this.direction.applyAxisAngle(axis, this.angularSpeed).normalize();
        if (this.position.distanceToSquared(this.startPosition) > this.maxDistance * this.maxDistance) {
            // Call a remove function
            this.parent.removeFromUpdateList(this);
        }
        if (this.lifetime > this.maxLifetime) {
            this.parent.removeFromUpdateList(this);
        }
        this.lifetime++;
    }
}

export default EnemyBullet;
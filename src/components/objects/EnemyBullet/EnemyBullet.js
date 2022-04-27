import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'
import TEXTURE from './arrow.png';

class EnemyBullet extends Sprite {
    constructor(parent, enemy, direction, speed, angularSpeed, bulletType = "base") {
        super();

        this.position.copy(enemy.position);

        var map;
        var material;

        // Notes on hitboxes:
        // Sometimes bullets may be better represented by rectangles, and sometimes by circles
        // It is probably best to make everything represented by a fully enclosed square 
        // (since traditionally hitboxes are smaller than they appear)
        // Therefore, since player has a radius parameter, we can calculate the bounding box from that 
        // Then we just check if it intersects the bullet's bounding box

        if (bulletType == "base") {
            map = new TextureLoader().load( 'https://blog.fastforwardlabs.com/images/2018/02/circle_aa-1518730700478.png' );
            material = new SpriteMaterial( { map: map } );
            this.scale.set(0.05, 0.05, 1);
            // Set hitbox here
            var rad = 0.025;
            this.hitbox = this.createBoundingBox(this.position, rad);
        }
        if (bulletType == "arrow") {
            var loader = new THREE.TextureLoader();
            loader.setCrossOrigin('anonymous');
            map = loader.load( TEXTURE );
            map.center.set(.5, .5);
            var angle = new THREE.Vector2(direction.x, direction.y);
            map.rotation = angle.angle();
            material = new SpriteMaterial( { map: map } );
            this.scale.set(0.5, 0.5, 1);
            // CREATE A HITBOX
        }

        this.material = material;
        
        // Vector for direction of bullet
        this.direction = direction.clone();

        // Parameters
        this.speed = speed;
        this.angularSpeed = angularSpeed;
        
        // Enemy is the source enemy of the bullet
        // It holds the "player" parameter for collision detection
        // For some reason I can't pass in the player parameter
        this.enemy = enemy;

        this.startPosition = enemy.position.clone();

        this.lifetime = 0;
        this.maxLifetime = 750;
        this.maxDistance = 5; // Distance that the bullet covers before disappearing
        // Not entirely sure how the scale of the scene works
        // A function that defines it is better than magic numbers

        parent.addToUpdateList(this);
    }

    // This needs to be able to do non linear movement as well
    update() {
        var offset = this.direction.clone().multiplyScalar(this.speed);
        this.position.add(offset);
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

        // Update bounding box
        this.hitbox.translate(new THREE.Vector2(offset.x, offset.y));

        // Collision Detection
        var playerBoundingBox = this.createBoundingBox(this.enemy.player.position, this.enemy.player.radius);
        if (playerBoundingBox.intersectsBox(this.hitbox)) {
            this.parent.removeAllFromUpdateList();
        }
    }

    // Create a Box2 representing the bounding box of a circular entity with given radius and center
    createBoundingBox(center, rad) {
        var temp = center.clone();
        var min = new THREE.Vector2(temp.x - (rad*Math.sqrt(2)/2), temp.y - (rad*Math.sqrt(2)/2));
        var max = new THREE.Vector2(temp.x + (rad*Math.sqrt(2)/2), temp.y + (rad*Math.sqrt(2)/2));
        var out = new THREE.Box2(min, max);
        return out;
    }
}

export default EnemyBullet;
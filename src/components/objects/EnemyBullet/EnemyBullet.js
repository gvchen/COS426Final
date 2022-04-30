import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'
import ARROW from './arrow1.png';
import TRIANGLE from './triangle11.png';

class EnemyBullet extends Sprite {
    constructor(parent, enemy, direction, speed, angularSpeed, bulletType = "base", position) {
        super();

        // Needed earlier for hitbox calculation
        this.position.copy(enemy.position);
        if (position !== undefined) {
            this.position.copy(position);
        }

        // Set texture, starting position, orientation, etc
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
            map = loader.load( ARROW );
            map.center.set(.5, .5);
            var angle = new THREE.Vector2(direction.x, direction.y);
            map.rotation = angle.angle();
            material = new SpriteMaterial( { map: map } );
            this.scale.set(0.5, 0.5, 1);
            // Set hitbox here
            this.hitbox = new THREE.Box2(new THREE.Vector2(this.position.x - 0.015, this.position.y - 0.07), 
                                         new THREE.Vector2(this.position.x + 0.015, this.position.y + 0.07))
        }
        if (bulletType == "triangle") {
            var loader = new THREE.TextureLoader();
            loader.setCrossOrigin('anonymous');
            map = loader.load( TRIANGLE );
            this.scale.set(0.25, 0.25, 1);
            map.center.set(.5, .5);
            var angle = new THREE.Vector2(direction.x, direction.y);
            map.rotation = angle.angle() - Math.PI/2;
            material = new SpriteMaterial( { map: map } );
            
            // Set hitbox here
            this.hitbox = new THREE.Box2(new THREE.Vector2(this.position.x - 0.015, this.position.y - 0.18), 
            new THREE.Vector2(this.position.x + 0.015, this.position.y + 0.18))
        }
        this.material = material;
        
        // Parameters
        this.direction = direction.clone(); // Direction of bullet
        this.speed = speed;                 // Speed of bullet
        this.angularSpeed = angularSpeed;   // Angular Speed of bullet
        
        // Enemy is the source enemy of the bullet
        // It holds the "player" parameter for collision detection
        // For some reason I can't pass in the player parameter
        this.enemy = enemy;

        // Parameters for bullet lifetime
        this.startPosition = enemy.position.clone(); // If bullet is too far from source, delete it
        this.lifetime = 0;
        this.maxLifetime = 750;                      // If bullet has been active for too long, delete it
        this.maxDistance = 5;                        // Distance that the bullet covers before disappearing
        // Not entirely sure how the scale of the scene works
        // A function that defines it is better than magic numbers

        // Parent (scene) interaction
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
            console.log(this.hitbox);
            console.log(playerBoundingBox);
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

    // New Collision Detection:
    // Bounding box can be rotated for rectangular bullets fired at an angle
    // Collisions must be able to account for that
}

export default EnemyBullet;
import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'
import { EnemyBullet } from '../EnemyBullet';
import { EnemyPattern } from '../EnemyPattern';
import ENEMY from './enemy1.png';

class Enemy extends Sprite {
    constructor(parent, player, position) {
        super();

        // Set Texture and starting position
        const map = new TextureLoader().load( ENEMY );
        const material = new SpriteMaterial( { map: map } );
        this.material = material;
        this.position.copy(position);
        this.scale.set(0.3, 0.3, 1);

        // Parent and Player interaction
        this.player = player;
        this.parent = parent;
        parent.addToUpdateList(this, "enemy");

        // Lifetime is used as an internal timer with mods to calculate when to fire patterns
        this.lifetime = 0;

        // Health parameter
        // This is probably better as an input for enemies with different health
        this.health = 30;

        // Hitbox calculation
        this.radius = 0.15; // This along with this.scale() can also probably be dynamic

        // We can have another object dedicated to shot patterns
        // This way each shot pattern of an enemy does not need a unique object

        this.pattern = new EnemyPattern(parent, this, Math.floor(Math.random()*10));
    }

    takeDamage(damage){
        this.health = this.health - damage;
        if (this.health <= 0) {
            //console.log(this.patterns[0]);
            this.parent.enemiesKilled = this.parent.enemiesKilled + 1;
            this.parent.removeFromUpdateList(this, "enemy");
        }
    }

    // Use update in order to determine shooting intervals
    // Random movement for enemy?
    update() {
        this.pattern.step();
        /*
        // Use the update function instead of setinterval to create bullets
        // Use lifetime as a timer
        this.lifetime++;
        // I don't know how frequently the update() function is called
        // My guess is once per frame
        var timer1 = 3;
        if (this.lifetime % timer1 == 0) {
            this.patterns[2](this);
            //this.pattern2(this);
        }

        var timer2 = 150;
        if (this.lifetime % timer2 == 0) {
            this.pattern3(this);
        }
        /*var timer3 = 5;
        if (this.lifetime % timer3 == 0) {
            this.pattern4(this);
        }*/
    }

    // Patterns
    simple(enemy) {
        var direction = new THREE.Vector3(0, -1, 0);
        var speed = 0.005;
        var angularSpeed = 0;
        var enemyBullet = new EnemyBullet(enemy.parent, enemy, direction, speed, angularSpeed);
        enemy.parent.add(enemyBullet);
    }

    pattern1(enemy, direction, rotation) {
        direction.applyMatrix3(rotation).normalize();
        var speed = 0.005;
        var angularSpeed = 0.001;

        var enemyBullet = new EnemyBullet(enemy.parent, enemy, direction, speed, angularSpeed);
        enemy.parent.add(enemyBullet);
    }

    pattern2(enemy) {
        var direction = enemy.player.position.clone().sub(enemy.position).normalize();
        
        var speed = 0.05;
        var angularSpeed = 0;
        var axis = new THREE.Vector3(0, 0, 1); // Z AXIS
        var angularOffset = 0.4;
        var enemyBullet1 = new EnemyBullet(enemy.parent, enemy, direction, speed, angularSpeed);
        var enemyBullet2 = new EnemyBullet(enemy.parent, enemy, 
            direction.clone().applyAxisAngle(axis, angularOffset).normalize(), speed, angularSpeed);
        /*var enemyBullet2 = new EnemyBullet(enemy.parent, enemy.position, 
            direction.clone().applyAxisAngle(axis, angularOffset * -1).normalize(), speed, angularSpeed);*/

        enemy.parent.add(enemyBullet1);
        enemy.parent.add(enemyBullet2);
    }

    pattern3(enemy) {
        var direction = new THREE.Vector3(1, 0, 0);
        var speed = 0.015;
        var angularSpeed = 0;
        var axis = new THREE.Vector3(0, 0, 1); // Z AXIS
        var angularOffset = Math.PI/4;

        for (let i = 0; i < 8; i++) {
            var enemyBullet = new EnemyBullet(enemy.parent, enemy, direction.clone().applyAxisAngle(axis, angularOffset * i), speed, angularSpeed, "arrow");
            enemy.parent.add(enemyBullet);
        }
    }

    pattern4(enemy) {
        var direction = enemy.player.position.clone().sub(enemy.position).normalize();
        var speed = 0.07;
        var angularSpeed = 0;

        for (let i = 0; i < 3; i++) {
            var xOffset = (Math.random() * - 0.5);
            var yOffset = (Math.random() * - 0.5);
            var offset = new THREE.Vector3(xOffset, yOffset, 0);
            var enemyBullet = new EnemyBullet(enemy.parent, enemy, offset.add(direction).normalize(), speed, angularSpeed, "triangle");
            enemy.parent.add(enemyBullet);
        }
    }

    // GENERATE IS PROBABLY OUTDATED SINCE UPDATE() IS USED FOR SHOOTING INTERVALS
    // Function that creates bullets using the object dedicated to shot patterns
    // For testing purposes, Hard code patterns within the Enemy object, with a parameter that selects patterns
    // Preferably an object will be used in the future
    /*generate() {
        var direction = new THREE.Vector3(0, 1, 0);
        var theta = Math.PI/60;
        var rotation = new THREE.Matrix3();
        // Check matrix3 documentation 
        // Can use apply axis rotationda
        rotation.set(
            Math.cos(theta), Math.sin(theta), 0,
            Math.sin(theta) * -1, Math.cos(theta), 0,
            0, 0, 1
        )
        var timer = 500;
        setInterval(this.pattern1, timer, this, direction, rotation);
        setInterval(this.pattern1, timer, this, direction.clone().multiplyScalar(-1), rotation);
    }

    generate1() {
        var timer = 1000;
        setInterval(this.simple, timer, this);
    }

    generate2() {
        var timer1 = 50;
        setInterval(this.pattern2, timer1, this);
        var timer2 = 2500;
        setInterval(this.pattern3, timer2, this);
    }*/
}

export default Enemy;
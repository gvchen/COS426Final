import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'
import { EnemyBullet } from '../EnemyBullet';

class Enemy extends Sprite {
    constructor(parent, player, position) {
        super();

        const map = new TextureLoader().load( 'https://blog.fastforwardlabs.com/images/2018/02/circle_aa-1518730700478.png' );
        const material = new SpriteMaterial( { map: map } );

        this.material = material;
        this.position.copy(position);
        this.scale.set(0.3, 0.3, 1);
        this.player = player;
        this.parent = parent;

        parent.addToUpdateList(this);

        // We can have another object dedicated to shot patterns
        // This way each shot pattern of an enemy does not need a unique object
        this.generate2();
    }

    // Random movement for enemy?
    update() {
    
    }

    // Function that creates bullets using the object dedicated to shot patterns
    // For testing purposes, Hard code patterns within the Enemy object, with a parameter that selects patterns
    // Preferably an object will be used in the future
    generate() {
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
        var timer = 50;
        setInterval(this.pattern1, timer, this, direction, rotation);
        setInterval(this.pattern1, timer, this, direction.clone().multiplyScalar(-1), rotation);
    }

    pattern1(enemy, direction, rotation) {
        direction.applyMatrix3(rotation).normalize();
        var speed = 0.005;
        var angularSpeed = 0.001;
        var enemyBullet = new EnemyBullet(enemy.parent, enemy.position, direction, speed, angularSpeed);
        enemy.parent.add(enemyBullet);
    }

    generate2() {
        var timer1 = 50;
        setInterval(this.pattern2, timer1, this);
        var timer2 = 2500;
        setInterval(this.pattern3, timer2, this);
    }

    pattern2(enemy) {
        var direction = enemy.player.position.clone().sub(enemy.position).normalize();
        
        var speed = 0.05;
        var angularSpeed = 0;
        var axis = new THREE.Vector3(0, 0, 1); // Z AXIS
        var angularOffset = 0.4;
        var enemyBullet1 = new EnemyBullet(enemy.parent, enemy.position, direction, speed, angularSpeed);
        var enemyBullet2 = new EnemyBullet(enemy.parent, enemy.position, 
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
            var enemyBullet = new EnemyBullet(enemy.parent, enemy.position, direction.clone().applyAxisAngle(axis, angularOffset * i), speed, angularSpeed, "arrow");
            enemy.parent.add(enemyBullet);
        }
    }
}

export default Enemy;
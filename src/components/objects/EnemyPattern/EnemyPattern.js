import { Sprite } from 'three';
import { TextureLoader } from 'three';
import { SpriteMaterial } from 'three';
import * as THREE from 'three'
import { EnemyBullet } from '../EnemyBullet';

class EnemyPattern {
    constructor(parent, parentEnemy, patternNumber) {
        this.parent = parent;
        this.enemy = parentEnemy;
        this.lifetime = 0;

        this.patternNumber = patternNumber;

        this.patterns = [
            //this.simple,
            this.pattern1,
            this.pattern2,
            this.pattern3,
            this.pattern4,
            this.pattern5,
            this.pattern6,
            this.pattern7,
            this.pattern8,
            this.pattern9,
            this.pattern10
        ];

        this.direction = new THREE.Vector3(0, 1, 0); // Used in pattern1
        this.pattern5Data = {
            offset: new THREE.Vector3(0, 0, 0),
            angularOffset: 0,
        };
        this.bool = true;  // Used to switch directions in pattern 10
    }

    step(){
        this.lifetime = this.lifetime + 1;
        if (this.lifetime > 20) {
            this.patterns[this.patternNumber](this.enemy, this);
        }
    }

    // Super simple, shoot straight down
    simple(enemy) {
        var direction = new THREE.Vector3(0, -1, 0);
        var speed = 0.005;
        var angularSpeed = 0;
        var enemyBullet = new EnemyBullet(enemy.parent, enemy, direction, speed, angularSpeed);
        enemy.parent.add(enemyBullet);
    }

    // Easy, just a fixed spiral with lots of room
    pattern1(enemy, enemyPattern) {
        var timer = 5;
        if (enemyPattern.lifetime % timer == 0) {
            var theta = Math.PI/10;
            var rotation = new THREE.Matrix3();
            // Check matrix3 documentation 
            // Can use apply axis rotationda
            rotation.set(
                Math.cos(theta), Math.sin(theta), 0,
                Math.sin(theta) * -1, Math.cos(theta), 0,
                0, 0, 1
            )
            enemyPattern.direction.applyMatrix3(rotation).normalize();
            var speed = 0.05;
            var angularSpeed = 0.01;

            var enemyBullet = new EnemyBullet(enemy.parent, enemy, enemyPattern.direction, speed, angularSpeed);
            enemy.parent.add(enemyBullet);
            var enemyBullet1 = new EnemyBullet(enemy.parent, enemy, enemyPattern.direction.clone().multiplyScalar(-1), speed, angularSpeed);
            enemy.parent.add(enemyBullet1);
        }
    }

    // Easy, two aimed streams + 8 directional arrows
    pattern2(enemy, enemyPattern) {
        var timer1 = 3;
        if (enemyPattern.lifetime % timer1 == 0) {
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
        var timer2 = 150;
        if (enemyPattern.lifetime % timer2 == 0) {
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
    }

    // Easy - medium, Fast aimed triangle shots
    pattern3(enemy, enemyPattern) {
        var timer3 = 20;
        if (enemyPattern.lifetime % timer3 == 0) {
            var direction = enemy.player.position.clone().sub(enemy.position).normalize();
            var speed = 0.05;
            var angularSpeed = 0;
    
            for (let i = 0; i < 3; i++) {
                var xOffset = (Math.random() * - 0.5);
                var yOffset = (Math.random() * - 0.5);
                var offset = new THREE.Vector3(xOffset, yOffset, 0);
                var enemyBullet = new EnemyBullet(enemy.parent, enemy, offset.add(direction).normalize(), speed, angularSpeed, "triangle");
                enemy.parent.add(enemyBullet);
            }
        }
    }

    // Easy - medium Omnidirectional arrows
    // Can be difficult to get into if out of position
    pattern4(enemy, enemyPattern) {
        var timer = 21;
        if (enemyPattern.lifetime % timer == 0) {
            var direction = new THREE.Vector3(1, 0, 0);
            var speed = 0.035;
            var angularSpeed = 0;
            var axis = new THREE.Vector3(0, 0, 1); // Z AXIS
            var shots = 24;
            var angularOffset = Math.PI/(shots/2);
    
            for (let i = 0; i < shots; i++) {
                var dir = direction.clone().applyAxisAngle(axis, angularOffset * i);
                if (enemyPattern.lifetime % 2 == 0) {
                    dir.applyAxisAngle(axis, angularOffset / 2);
                }
                var enemyBullet = new EnemyBullet(enemy.parent, enemy, dir, speed, angularSpeed, "arrow");
                enemy.parent.add(enemyBullet);
            }
        }
    }

    pattern5(enemy, enemyPattern) {
        var timer2 = 50;
        if (enemyPattern.lifetime % timer2 == 0) {
            enemyPattern.pattern5Data['offset'].x = (Math.random() - 0.5);
            enemyPattern.pattern5Data['offset'].y = (Math.random() - 0.5);
            enemyPattern.pattern5Data['angularOffset'] = Math.random() * Math.PI/8;
        }
        if (enemyPattern.lifetime % timer2 == 0 || (enemyPattern.lifetime - 10) % timer2 == 0 || (enemyPattern.lifetime - 20) % timer2 == 0) {
            var direction = new THREE.Vector3(1, 0, 0);
            var speed = 0.035;
            var angularSpeed = 0;
            var axis = new THREE.Vector3(0, 0, 1); // Z AXIS
            var angularOffset = Math.PI/8;
    
            for (let i = 0; i < 16; i++) {
                var dir = direction.clone().applyAxisAngle(axis, angularOffset * i);
                dir.applyAxisAngle(axis, enemyPattern.pattern5Data['angularOffset']);
                var enemyBullet = new EnemyBullet(enemy.parent, enemy, dir, 
                                                  speed, angularSpeed, "base", enemy.position.clone().add(enemyPattern.pattern5Data['offset']));
                enemy.parent.add(enemyBullet);
            }
        }
    }

    pattern6(enemy, enemyPattern) {
        var timer = 20;
        if (enemyPattern.lifetime % timer == 0) {
            var direction = new THREE.Vector3(1, 0, 0);
            var speed = 0.035;
            var angularSpeed = 0;
            var axis = new THREE.Vector3(0, 0, 1); // Z AXIS
            var angularOffset = Math.PI/8;

            for (let j = 0; j < 3; j++) {
                var offset = new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), 0);
                for (let i = 0; i < 16; i++) {
                    var enemyBullet = new EnemyBullet(enemy.parent, enemy, direction.clone().applyAxisAngle(axis, angularOffset * i), 
                        speed, angularSpeed, "base", enemy.position.clone().add(offset));
                    enemy.parent.add(enemyBullet);
                }
            }
        }
    }

    pattern7(enemy, enemyPattern) {
        var direction = enemy.player.position.clone().sub(enemy.position).normalize();
        var perpDir = new THREE.Vector3(direction.y, -direction.x, 0);
        var speed = 0.035;
        var angularSpeed = 0;
        var timer = 15;
        if (enemyPattern.lifetime % timer == 0) {
            for (let j = -10; j <= -5; j++) {
                var offset = new THREE.Vector3(j * perpDir.x * 0.2, j * perpDir.y * 0.2, 0);
                var enemyBullet = new EnemyBullet(enemy.parent, enemy, direction.clone(), 
                        speed, angularSpeed, "base", enemy.position.clone().add(offset));
                    enemy.parent.add(enemyBullet);
            }

            for (let j = 5; j <= 10; j++) {
                var offset = new THREE.Vector3(j * perpDir.x * 0.2, j * perpDir.y * 0.2, 0);
                var enemyBullet = new EnemyBullet(enemy.parent, enemy, direction.clone(), 
                        speed, angularSpeed, "base", enemy.position.clone().add(offset));
                    enemy.parent.add(enemyBullet);
            }
        }

        var timer2 = 50;
        if (enemyPattern.lifetime % timer2 == 0) { 
            for (let j = -1; j <= 1; j++) {
                var offset = new THREE.Vector3(j * perpDir.x * 0.3, j * perpDir.y * 0.3, 0);
                direction = enemy.player.position.clone().sub(enemy.position.clone().add(offset)).normalize();
                speed = 0.05;
                enemyBullet = new EnemyBullet(enemy.parent, enemy, direction.clone(), 
                        speed, angularSpeed, "triangle", enemy.position.clone().add(offset));
                enemy.parent.add(enemyBullet);
            }
        }
    }

    pattern8(enemy, enemyPattern) {
        var timer = 60;
        if (enemyPattern.lifetime % timer == 0) {
            var direction = enemy.player.position.clone().sub(enemy.position).normalize();
            var speed = 0.035;
            var angularSpeed = 0;
            var axis = new THREE.Vector3(0, 0, 1); // Z AXIS
            var shots = 24;
            var angularOffset = Math.PI/(shots/2);
    
            for (let i = 0; i < shots; i++) {
                var dir = direction.clone().applyAxisAngle(axis, angularOffset * i);
                if (enemyPattern.lifetime % 2 == 0) {
                    dir.applyAxisAngle(axis, angularOffset / 2);
                }
                var enemyBullet = new EnemyBullet(enemy.parent, enemy, dir, speed, angularSpeed, "base", undefined, 6);
                enemy.parent.add(enemyBullet);
            }
        }

        var timer1 = 80;
        if (enemyPattern.lifetime % timer1 == 30) {
            enemyPattern.direction = enemy.player.position.clone().sub(enemy.position).normalize();
        }

        var perpDir = new THREE.Vector3(enemyPattern.direction.y, -enemyPattern.direction.x, 0);
        var speed = 0.065;
        var angularSpeed = 0;
        if ([33, 36, 39, 42, 45, 48, 51, 54].includes(enemyPattern.lifetime % timer1)) {
            for (let j = -4; j <= 4; j++) {
                var offset = new THREE.Vector3(j * perpDir.x * 0.1, j * perpDir.y * 0.1, 0);
                var enemyBullet = new EnemyBullet(enemy.parent, enemy, enemyPattern.direction.clone(), 
                        speed, angularSpeed, "arrow", enemy.position.clone().add(offset));
                    enemy.parent.add(enemyBullet);
            }
        }
    }

    // Spiral shots that alternate rotational direction
    pattern9(enemy, enemyPattern) {
        var timer = 15;
        if (enemyPattern.lifetime % timer == 0) {
            var bool = false;
            if (enemyPattern.lifetime % 2 == 0) {
                bool = true;
            }
            var theta = Math.PI/10;
            var rotation = new THREE.Matrix3();
            // Check matrix3 documentation 
            // Can use apply axis rotationda
            rotation.set(
                Math.cos(theta), Math.sin(theta), 0,
                Math.sin(theta) * -1, Math.cos(theta), 0,
                0, 0, 1
            )
            enemyPattern.direction.applyMatrix3(rotation).normalize();
            var speed = 0.05;
            var angularSpeed = 0.02;

            if (bool == true) {
                angularSpeed = -0.02;
            }

            var axis = new THREE.Vector3(0, 0, 1); // Z AXIS
            var shots = 6;
            var angularOffset = Math.PI/(shots/2);
        
            for (let i = 0; i < shots; i++) {
                var enemyBullet = new EnemyBullet(enemy.parent, enemy, enemyPattern.direction.clone().applyAxisAngle(axis, angularOffset * i), 
                                                  speed, angularSpeed, "base", enemy.position.clone(), 3);
                enemy.parent.add(enemyBullet);
            }
        }
    }

    pattern10(enemy, enemyPattern) {
        var timer = 5;
        if (enemyPattern.lifetime % timer == 0) {
            //var direction = new THREE.Vector3(1, 0, 0);
            var speed = 0.035;
            var angularSpeed = 0;
            var axis = new THREE.Vector3(0, 0, 1); // Z AXIS
            var shots = 16;
            var angularOffset = Math.PI/(shots/2);
    
            for (let i = 0; i < shots; i++) {
                var dir = enemyPattern.direction.clone().applyAxisAngle(axis, angularOffset * i);
                var enemyBullet = new EnemyBullet(enemy.parent, enemy, dir, speed, angularSpeed, "base");
                enemy.parent.add(enemyBullet);
            }
            if (this.bool == true) {
                enemyPattern.direction.applyAxisAngle(axis, 0.035);
            } else {
                enemyPattern.direction.applyAxisAngle(axis, -0.035);
            }

            if (enemyPattern.direction.x < -0.5) {
                this.bool = false;
            }
            if (enemyPattern.direction.x > 0) {
                this.bool = true;
            }
            
        }
    }
}

export default EnemyPattern;
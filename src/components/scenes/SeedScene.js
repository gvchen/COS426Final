import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';
import { Player } from '../objects';
import * as THREE from 'three'

class SeedScene extends Scene {
    constructor(camera) {
        // Call parent Scene() constructor
        super();

        // Need this to convert mouse coordinates to scene coordinates
        this.camera = camera;

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        const player = new Player(this);
        this.add(player);

        // Add meshes to scene
        //const land = new Land();
        //const flower = new Flower(this);
        //const lights = new BasicLights();
        //this.add(land, flower, lights);

        // Populate GUI
        //this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    removeFromUpdateList(object) {
        this.remove(object);
        var index = this.state.updateList.indexOf(object);
        this.state.updateList.splice(index, 1);
    }

    convertMouseToSceneCoords(mouseLocationX, mouseLocationY) {
        var vec = new THREE.Vector3(); // create once and reuse
        var pos = new THREE.Vector3(); // create once and reuse
        
        vec.set(
            ( mouseLocationX / window.innerWidth ) * 2 - 1,
            - ( mouseLocationY / window.innerHeight ) * 2 + 1,
            0.5 );
        
        vec.unproject(this.camera);
        vec.sub(this.camera.position).normalize();
        
        var distance = - this.camera.position.z / vec.z;
        
        pos.copy(this.camera.position).add(vec.multiplyScalar(distance));
        return pos;
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        //console.log(updateList);
        //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;

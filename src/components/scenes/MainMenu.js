import { Scene, Color } from 'three';
import * as THREE from 'three';
import { SeedScene } from 'scenes';

const KEY_SPACE = 32; 

class MainMenu {
    constructor(camera) {
        this.camera = camera;
        window.addEventListener("keydown", (evt) => this.handleKeyEvent(evt) )
        
        this.scene = new THREE.Scene();
        // Set background to a nice color
        this.scene.background = new Color(0x7ec0ee);

    }

    handleKeyEvent(evt) {
        if (evt.keyCode == KEY_SPACE) {
            this.scene = new SeedScene(this.camera);
        }
    }
}

export default MainMenu;

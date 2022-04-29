import { Scene, Color } from 'three';
import * as THREE from 'three';
import { SeedScene } from 'scenes';

class MainMenu {
    constructor(camera) {
        this.camera = camera;
        window.addEventListener("mousedown", (evt) => this.handleMouseDownEvent() )
        
        this.scene = new THREE.Scene();
        // Set background to a nice color
        this.scene.background = new Color(0x7ec0ee);

    }

    handleMouseDownEvent() {
        this.scene = new SeedScene(this.camera);
    }
}

export default MainMenu;

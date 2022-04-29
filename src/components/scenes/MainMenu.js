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
        const loader = new THREE.FontLoader();
        var scene = this.scene;

        var pos = this.camera.position.clone()

        loader.load('https://components.ai/api/v1/typefaces/geostar/normal/400', function (font) {
            const textObj = new THREE.TextGeometry('PRESS SPACE TO BEGIN', {
                font: font,
                size: 0.2,
                height: 0.1,
                bevelEnabled: false,
            });
            const material = new THREE.MeshBasicMaterial({color: 'black'});
            const mesh = new THREE.Mesh(textObj, material);

            var bbox = new THREE.Box3().setFromObject(mesh);

            var xLen = (bbox.max.x - bbox.min.x)/2;
            var yLen = (bbox.max.y - bbox.min.y)/2;

            mesh.position.set(pos.x -xLen, pos.y - yLen, 0);

            scene.add(mesh);
        });

    }

    handleKeyEvent(evt) {
        if (evt.keyCode == KEY_SPACE) {
            this.camera.position.set(0, 0, 10);
            if (!this.scene.hasOwnProperty('active') || this.scene.active == false){
                this.scene = new SeedScene(this.camera);
            }
        }
    }
}

export default MainMenu;

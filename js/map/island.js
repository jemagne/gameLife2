import * as THREE from '../../node_modules/three/build/three.module.js';

export function island(scene) {
    var pi = Math.PI;

    let mat_orange = new THREE.MeshLambertMaterial({ color: 0xff8c75 });
    //-------------------------------------ground-------------------------------------
    let layers = [];
    let ground = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        let h = 0.5;
        let geometry = new THREE.CylinderGeometry(8 - i - 0.01, 8 - i, h, 9);
        layers.push(new THREE.Mesh(geometry, mat_orange));
        layers[i].position.y = h * i;
        layers[i].receiveShadow = true;
        ground.add(layers[i]);
    }
    layers[0].scale.x = 0.8;
    layers[1].scale.set(0.77, 1, 0.91);
    layers[1].rotation.y = ((2 * pi) / 9) * 0.6;
    layers[2].scale.set(0.8, 1, 0.91);
    layers[2].rotation.y = ((2 * pi) / 9) * 0.3;

    ground.scale.set(50,50,50);
    scene.add(ground);
}
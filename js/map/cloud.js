import * as THREE from '../../node_modules/three/build/three.module.js';
import { FBXLoader } from '../../node_modules/three/examples/jsm/loaders/FBXLoader.js';

export function loadCloud(scene) {

    const fbxLoader = new FBXLoader()
    let clouds = [];

    fbxLoader.load('./assets/model/cloud/Cloud_1.fbx', function(cloudModel) {
        for (var i = 0; i < 20; i++) {
            let cloud = cloudModel.clone()
            cloud.scale.set(0.3,0.3, 0.3);
            cloud.position.x = Math.random() * 800;
            cloud.position.y = 200 + Math.random() * 100;
            cloud.position.z = Math.random() * 800 - 400;
            scene.add(cloud);
            clouds.push(cloud);
        }
    });
    return clouds;
}
import * as THREE from '../../node_modules/three/build/three.module.js';
import { FBXLoader } from '../../node_modules/three/examples/jsm/loaders/FBXLoader.js';

export function island(scene) {
    let pi = Math.PI;

    let mat_orange = new THREE.MeshLambertMaterial({ color: 0xff8c75 });
    //-------------------------------------ground-------------------------------------
    let layers = [];
    let ground = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        let h = 0.25;
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

    //island(scene);
    const fbxLoader = new FBXLoader()
    let trees = [];

    fbxLoader.load('./assets/model/FirTree01.fbx', function(treeModel) {
        let radius = layers[2].geometry.parameters.radiusTop - 10.3;
        let segments = 100;
        // Créez des petits cubes
        let Model = treeModel.clone();

        for (let i = 0; i < segments; i++) {
            let tree = generateTree(Model, trees, radius, 0.12);
            if (tree !== undefined) {
                trees.push(tree);
                layers[2].add(tree);
            }
        }
        //layers[2].add(trees);
    });

}
function generateTree(newTreeModel, trees, radius, height) {
    let newTree = undefined
    if (newTreeModel !== undefined) {
        let newTree = newTreeModel.clone();
        newTree.scale.set(0.001, 0.001, 0.001);
        let angle = (Math.random() * Math.PI * 2);
        newTree.position.x = radius * Math.cos(angle) + (Math.random() * 1 - 0.5);
        newTree.position.y = height;
        newTree.position.z = radius * Math.sin(angle) + (Math.random() * 1 - 0.5);
        let minDistance = 0.5;
        for (let i = 0; i < trees.length; i++) {
            let distance = newTree.position.distanceTo(trees[i].position);
            if (distance < minDistance) {
                return generateTree(newTreeModel, trees, radius, height);
            }
        }
        return newTree;
    }

}
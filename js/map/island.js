import * as THREE from '../../node_modules/three/build/three.module.js';
import { FBXLoader } from '../../node_modules/three/examples/jsm/loaders/FBXLoader.js';

export function island(scene) {
    var pi = Math.PI;

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

    console.log(layers[2])

    ground.scale.set(50,50,50);
    scene.add(ground);

    //island(scene);
    const fbxLoader = new FBXLoader()
    var raycaster = new THREE.Raycaster();
    fbxLoader.load('./assets/model/FirTree01.fbx', function(treeModel) {
        /*let trees = new THREE.Object3D();

        for (let i = 0; i < 30; i++) {
            var position = new THREE.Vector3(
                Math.random() * 200 - 100,
                50,
                Math.random() * 200 - 100
            );

          


            if (intersects.length > 0) {
                console.log(intersects[0])
                let point = intersects[0].point;
                
            }
        }*/
     
        // Créez des petits cubes
        
        for (var i = 0; i < 80; i++) {
            let tree = treeModel.clone();
                tree.scale.set(0.001, 0.001, 0.001);
                let rand = Math.random();
                let etatx = 1;
                if (rand < 0.5) {
                    etatx = -1
                }
                let randy = Math.random();

                let etaty = 1;
                if (randy < 0.5) {
                    etaty = -1
                }
                tree.position.set(
                    (Math.random()*1 - 1)*2 + 6 * etatx, 
                    0.1,
                    (Math.random()*1 - 1)*3 + 6 * etaty)
                
                layers[2].add(tree);
         
        }

        //layers[2].add(trees);
    });

}
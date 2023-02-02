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

    ground.scale.set(50,50,50);
    scene.add(ground);

    //island(scene);
    let trees = new THREE.Object3D();
    const fbxLoader = new FBXLoader()
    var raycaster = new THREE.Raycaster();
    fbxLoader.load('./assets/model/Tree_Spruce_small_02.fbx', function(treeModel) {
        let trees = new THREE.Object3D();

        for (let i = 0; i < 30; i++) {
            var position = new THREE.Vector3(
                Math.random() * 200 - 100,
                50,
                Math.random() * 200 - 100
            );

            // Affichage des rayons du raycaster
            var lineGeometry = new THREE.BufferGeometry();
            var lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
            var linePositions = new Float32Array([position.x, position.y, position.z, position.x, -1, position.z]);
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
            var line = new THREE.Line(lineGeometry, lineMaterial);

            scene.add( line );

            raycaster.set(position, new THREE.Vector3(0, -1, 0));
            let intersects = raycaster.intersectObject(layers[2]);


            if (intersects.length > 0) {
                console.log(intersects[0])
                let point = intersects[0].point;
                let tree = treeModel.clone();
                tree.scale.set(0.1, 0.1, 0.1);
                tree.position.copy(point.x,0.5,point.z);
                trees.add(tree);
            }
        }

        layers[2].add(trees);
    });
   /* for (let i = 0; i < 30; i++) {
        var tree;
        var position = new THREE.Vector3(
            Math.random() * 2 - 1,
            5,
            Math.random() * 2 - 1
        );
        console.log(position)
        raycaster.set( position, new THREE.Vector3( 0, -1, 0 ) );
        var intersects = raycaster.intersectObject( layers[2] );
        console.log(layers[2],intersects)

        if ( intersects.length > 0 ) {
            var point = intersects[ 0 ].point;
            fbxLoader.load( './assets/model/Tree_Spruce_small_02.fbx', function ( object ) {
                tree = object;
                tree.scale.set(0.1, 0.1, 0.1);
                tree.position.copy(point);
                trees.add( tree );
            } );
        }
    }*/

    layers[2].add( trees );
}
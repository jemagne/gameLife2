import * as THREE from '../../node_modules/three/build/three.module.js';
import { FBXLoader } from '../../node_modules/three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js';

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let HouseLoad = undefined
const fbxLoader = new FBXLoader()
fbxLoader.load(
    './assets/house/taverne.fbx',
    (object) => {
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                const texture = new THREE.TextureLoader().load( './assets/house/base_color.png' );
                child.material.map = texture; // assign your diffuse texture here
            }
        } );
        HouseLoad = object;
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')

    },
    (error) => {
        console.log(error)
    }
)

export function map0_data() {
    let data = [];
    for (let y = 0; y < 25; y++) {
        let xrow = []
        for (let x = 0; x < 25; x++) {
            let bloc = [];
            bloc['etat'] =  getRandomInt(2);
            bloc['object'] = undefined;
            bloc['house'] = undefined;
            xrow.push(bloc);
        }
        data.push(xrow)
    }
    return {'data': data};
}

export function loadMap(mapdata, scene, clickableObjs) {
    var size_Y = mapdata.data.length;
    var size_X = mapdata.data[0].length;

    const geometry = new THREE.BoxGeometry(8, 2, 8);

    for (var x = 0; x < size_X; x++) {
        for (var y = 0; y < size_Y; y++) {
             var posx = (x*8) - (size_X/2)*8;
             var posy = (y*8) - (size_Y/2)*8;
            /*var posx = x;
            var posy = y;*/
            let colorFloor = 'rgb(54,169,139)';


            if (mapdata.data[y][x]['object'] === undefined) {
                let color = undefined;
                if ( mapdata.data[y][x]['etat'] === 1) {
                   color = 0x2c3e50;

                } else {
                    color = colorFloor;
                }
                let material = new THREE.MeshLambertMaterial({color:	color});
                let cube = new THREE.Mesh(geometry, material);
                cube.name = "floor";
                clickableObjs.push(cube);
                cube.position.set(posx, 40, posy);
                cube.gridPos =  {'x':x, 'y':y};
                scene.add(cube);

                mapdata.data[y][x]['object'] = cube;
            } else {
                if ( mapdata.data[y][x]['etat'] === 1) {
                    mapdata.data[y][x]['object'].material.color.setHex(0x2c3e50);

                    if (mapdata.data[y][x]['house'] === undefined) {
                        let houseClone = HouseLoad.clone()
                        houseClone.position.copy(mapdata.data[y][x]['object'].position)
                        houseClone.position.y = 41.2;
                        scene.add(houseClone);
                        mapdata.data[y][x]['house'] = houseClone;
                        houseClone.scale.setY(0.1);
                        houseClone.scale.setX(0.1);
                        houseClone.scale.setZ(0.1);
                    } else {
                        mapdata.data[y][x]['house'].visible = true;
                    }

                } else if (mapdata.data[y][x]['etat'] === 0) {
                    mapdata.data[y][x]['object'].material.color.set(colorFloor);
                    if (mapdata.data[y][x]['house'] !== undefined) {
                        mapdata.data[y][x]['house'].visible = false;
                    }
                }
            }
        }
    }
}

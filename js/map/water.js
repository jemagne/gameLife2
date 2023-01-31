import * as THREE from '../../node_modules/three/build/three.module.js';
import { Water } from '../../node_modules/three/examples/jsm/objects/Water.js';
const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

export function loadWater(scene) {
    let water;
    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( '../../assets/waternormals.jpeg', function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            } ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.x = - Math.PI / 2;

    scene.add( water );
    return water;
}


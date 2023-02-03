import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { Sky } from '../node_modules/three/examples/jsm/objects/Sky.js';
import { FBXLoader } from '../node_modules/three/examples/jsm/loaders/FBXLoader.js';

import {map0_data, loadMap} from './map/map.js';
import {loadWater} from "./map/water.js";
import Stats from '../node_modules/stats.js/src/Stats.js'
import {island} from "./map/island.js";



// letiables
let scene;
let renderer;
let clock;
let controls;
let water, sun;
const stats = Stats()
const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 40000 );


let raycaster;
let mouse = new THREE.Vector2();
let clickableObjs = new Array();
let cursor_cube = undefined;
let map = map0_data();
let newmapLoad = []
for (let i = 0; i < map.data.length; i++)
    newmapLoad[i] = map.data[i].slice();
let mapdata = {'data':newmapLoad.slice()} ;
// for convenience
var pi = Math.PI;

function init()
{

    clock = new THREE.Clock();
    scene = new THREE.Scene();
    raycaster = new THREE.Raycaster();
    const axesHelper = new THREE.AxesHelper( 500 );
scene.add( axesHelper );
    //renderer
    renderer = new THREE.WebGLRenderer({antialias : true, alpha : true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    document.body.appendChild(renderer.domElement) ;
    controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;


    //event
    document.querySelector('canvas').addEventListener('pointerdown', onMouseDown, false);

    //light
    let ambientLight = new THREE.AmbientLight('rgb(243,158,36)', 0.6);
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 0.9, 0.4);
    scene.add(directionalLight);

    loadMap(mapdata, scene, clickableObjs);

    water = loadWater(scene);

    sun = new THREE.Vector3();

    island(scene);


    //materials
    var mat_grey = new THREE.MeshLambertMaterial({ color: 0xf3f2f7 });
    let mat_yellow = new THREE.MeshLambertMaterial({ color: 0xfeb42b });
    let mat_dark = new THREE.MeshLambertMaterial({ color: 0x5a6e6c });
    let mat_brown = new THREE.MeshLambertMaterial({ color: 0xa3785f });
    let mat_stone = new THREE.MeshLambertMaterial({ color: 0x9eaeac });


    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    let renderTarget;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };
    function updateSun() {

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        if ( renderTarget !== undefined ) renderTarget.dispose();

        renderTarget = pmremGenerator.fromScene( sky );

        scene.environment = renderTarget.texture;

    }

    updateSun();

    const button = document.getElementById("start");

    button.addEventListener('click', event => {
        round(mapdata);
    });
    document.getElementById('stats').appendChild(stats.dom)
    // loop
    camera.position.y = 200;
    camera.position.z = 25;
    camera.position.x = 200;
    camera.lookAt(0, 0, 0);
    controls.update();
    setInterval( function(){
         water.material.uniforms[ 'time' ].value += 1/ 60.0;
     }, 25);

    render();

}



function render()
{
    requestAnimationFrame(render);

    stats.update()
    controls.update();
    renderer.render(scene, camera);

}

function onMouseUp(event)
{
    cursor_cube.material.emissive.g = 0;
}

function onMouseDown(event)
{
    event.preventDefault()
    mouse.x = (event.clientX / window.innerWidth) * 2 -1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 +1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(clickableObjs);
    if(intersects.length > 0)
    {
        //if ()
        let selectedBloc = intersects[0].object;
        if (mapdata.data[selectedBloc.gridPos.y][selectedBloc.gridPos.x]['etat'] === 0 ) {
            mapdata.data[selectedBloc.gridPos.y][selectedBloc.gridPos.x]['etat'] = 1;
            selectedBloc.material.color.setHex( 0x333333 );
        } else {
            mapdata.data[selectedBloc.gridPos.y][selectedBloc.gridPos.x]['etat'] = 0;
            selectedBloc.material.color.set('rgb(54,169,139)');
        }
    }
}

function round(mapdata) {
    let newMap = [];
    for (let  index = 0; index < mapdata.data[0].length; index++) {
        newMap[index] = [];
    }
    mapdata.data.forEach((row, indexy) => {
        row.forEach((col,index) => {
            newMap[indexy][index] = [];
            let neighbours = countNeighbours(index,indexy,mapdata);
            if(neighbours === 3 ){
                newMap[indexy][index]['etat'] = 1;
                newMap[indexy][index]['object'] = col['object'];
                newMap[indexy][index]['house'] = col['house'];
            }
            else if(neighbours === 2) {
                newMap[indexy][index]['etat'] = col['etat'];
                newMap[indexy][index]['object'] = col['object'];
                newMap[indexy][index]['house'] = col['house'];
            } else {
                newMap[indexy][index]['etat'] = 0;
                newMap[indexy][index]['object'] = col['object'];
                newMap[indexy][index]['house'] = col['house'];
            }
        })
    })

    mapdata.data = newMap;

    loadMap(mapdata, scene, clickableObjs);

}
function countNeighbours(posx,posy,mapdata) {

    let Neighbours = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            // Check if the current neighbor is within the grid boundaries
            if (posy + i >= 0 && posy + i < mapdata.data[0].length && posx + j >= 0 && posx + j < mapdata.data[0].length) {
                Neighbours += mapdata.data[posy + i][posx + j]['etat'];
            }
        }
    }
    Neighbours -= mapdata.data[posy][posx]['etat']
    return Neighbours;
}

init();


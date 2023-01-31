import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { Sky } from '../node_modules/three/examples/jsm/objects/Sky.js';

import {map0_data, loadMap} from './map/map.js';
import {loadWater} from "./map/water.js";
import Stats from '../node_modules/stats.js/src/Stats.js'



// variables
let scene;
let renderer;
let clock;
let controls;
let water, sun;
const stats = Stats()
const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );


var raycaster;
var mouse = new THREE.Vector2();
var clickableObjs = new Array();
var cursor_cube = undefined;
let map = map0_data();
let newmapLoad = []
for (var i = 0; i < map.data.length; i++)
    newmapLoad[i] = map.data[i].slice();
let mapdata = {'data':newmapLoad.slice()} ;


function init()
{

    clock = new THREE.Clock();
    scene = new THREE.Scene();
    raycaster = new THREE.Raycaster();


    //renderer
    renderer = new THREE.WebGLRenderer({antialias : true, alpha : true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    document.body.appendChild(renderer.domElement) ;
    controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;


    //cursor
    const corsor_material = new THREE.MeshLambertMaterial({transparent : true, opacity : 0 , color : 0xc0392b});
    const cursor_geometry = new THREE.BoxGeometry(0.5, 4, 0.5);
    cursor_cube = new THREE.Mesh(cursor_geometry, corsor_material);
    scene.add(cursor_cube);

    //event
    document.querySelector('canvas').addEventListener('pointerdown', onMouseDown, false);

    //light
    var ambientLight = new THREE.AmbientLight('rgb(243,158,36)', 0.6);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 0.9, 0.4);
    scene.add(directionalLight);
    console.log(directionalLight)

    loadMap(mapdata, scene, clickableObjs);

    water = loadWater(scene);

    sun = new THREE.Vector3();

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
    camera.position.y = 5;
    camera.position.z = 25;
    camera.position.x = 5
    camera.lookAt(0, 0, 0);
    controls.update();

    render();

}



function render()
{
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    stats.update()
    controls.update();

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
        var selectedBloc = intersects[0].object;
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
            if (posy + i >= 0 && posy + i < 60 && posx + j >= 0 && posx + j < 60) {
                Neighbours += mapdata.data[posy + i][posx + j]['etat'];
            }
        }
    }
    Neighbours -= mapdata.data[posy][posx]['etat']
    return Neighbours;
}

init();

window.requestAnimationFrame(render);
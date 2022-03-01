// python -m SimpleHTTPServer

import * as THREE from "https://cdn.skypack.dev/three@0.126.1";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
// import Stats from 'https://github.com/mrdoob/stats.js/blob/master/build/stats.min.js';
import dat from "https://cdn.skypack.dev/dat.gui";



// // Ski resort data
// const skiResortData = require("./sciResortData.json")
// console.log(skiResortData)


const mapCanvas = document.getElementById("mapCanvas");

const mapCanvasSize = {
    mapCanvasWidth: window.innerWidth,
    mapCanvasHeight: window.innerHeight
};

const cameraControlsPoints = {
    cameraPosition: {
        cameraPositionX: 2,
        cameraPositionY: 1000,
        cameraPositionZ: 1000
    },

    cameraFocalPointPosition: {
        cameraFocalPointPositionX: 0,
        cameraFocalPointPositionY: 0,
        cameraFocalPointPositionZ: 0 
    }
};



// Loaders
// Texture loader
const textureLoader = new THREE.TextureLoader().setPath("./img/textures/")
const mountainsTexture = textureLoader.load("mountainsTexture.png")

// Height maps loader
const heightMapLoader = new THREE.TextureLoader().setPath("./img/heightMaps/")
const heightMap = heightMapLoader.load("heightMap.png")
const heightMap1 = heightMapLoader.load("heightMap1.png")

// Normal map loader
const normalMapLoader = new THREE.TextureLoader().setPath("./img/normalMaps/")
const mountainsNormalMapTexture = normalMapLoader.load("mountainsNormalMap.png")

// Cube texture loader
const cubeTextureLoader = new THREE.CubeTextureLoader().setPath("./img/backgroundCubeTextures/");
const backgroundCubeTextures = cubeTextureLoader.load(["firstSkybox/firstSkyboxNX.jpg", 
                                                       "firstSkybox/firstSkyboxNY.jpg",
                                                       "firstSkybox/firstSkyboxNZ.jpg",
                                                       "firstSkybox/firstSkyboxPX.jpg",
                                                       "firstSkybox/firstSkyboxPY.jpg", 
                                                       "firstSkybox/firstSkyboxPZ.jpg"]);



// Converting angle types functions
const convertDegreesToRadians = (angle) => {
    return (angle * Math.PI / 180);
}

const convertRadiansToDegrees = (angle) => {
    return (angle / Math.PI * 180);
}



// Creating a scene for a map
const scene = new THREE.Scene();
scene.background = backgroundCubeTextures;


// Creating a main camera
const mainCamera = new THREE.PerspectiveCamera(75, mapCanvasSize.mapCanvasWidth / mapCanvasSize.mapCanvasHeight, 0.1, 1000000)
mainCamera.position.x = cameraControlsPoints.cameraPosition.cameraPositionX;
mainCamera.position.y = cameraControlsPoints.cameraPosition.cameraPositionY;
mainCamera.position.z = cameraControlsPoints.cameraPosition.cameraPositionZ;
scene.add(mainCamera);


// Controls
const controls = new OrbitControls(mainCamera, mapCanvas);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.maxPolarAngle = convertDegreesToRadians(75);


// Lights
const pointLight = new THREE.PointLight()
pointLight.position.set(0, 5000, 0);
pointLight.lookAt(0, 0, 0)
pointLight.intensity = 1
pointLight.color = new THREE.Color(0xFFFFFF);
scene.add(pointLight)

// Objects
// const planeGeometry = new THREE.PlaneGeometry(5, 7.5, 1000, 1500);
const planeGeometry = new THREE.PlaneGeometry(10000, 10000, 1000, 1000);


// Materials
const planeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xFFFFFF),
    displacementMap: heightMap,
    displacementScale: 1000,
    normalMap: mountainsNormalMapTexture,
    // map: heightMap,
    side: THREE.DoubleSide
});


// Meshes
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -90 * Math.PI / 180
scene.add(plane)


// GUI
const GUI = new dat.GUI()

const heightMapSettings = GUI.addFolder("Height map settings")
heightMapSettings.add(planeMaterial, "displacementScale", 0, 4000)
// heightMapSettings.add(planeMaterial, "displacementMap", )

const lightSettings = GUI.addFolder("Light settings")
lightSettings.add(pointLight.position, "x").min(-10000).max(10000).step(0.01);
lightSettings.add(pointLight.position, "z").min(-10000).max(10000).step(0.01);
lightSettings.add(pointLight.position, "y").min(0).max(5000).step(0.01);
lightSettings.add(pointLight, "intensity").min(0).max(10).step(0.005);



// Helpers 
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);


// Window resize handle
window.addEventListener('resize', () =>
{
    // Update mapCanvasSize
    mapCanvasSize.mapCanvasWidth = window.innerWidth
    mapCanvasSize.mapCanvasHeight = window.innerHeight

    // Update camera
    mainCamera.aspect = mapCanvasSize.mapCanvasWidth/ mapCanvasSize.mapCanvasHeight
    mainCamera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(mapCanvasSize.mapCanvasWidth, mapCanvasSize.mapCanvasHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: mapCanvas
})
renderer.setSize(mapCanvasSize.mapCanvasWidth, mapCanvasSize.mapCanvasHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// Animation
const clock = new THREE.Clock()
const animationFrame = () =>
{
    // Getting different time values
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = clock.getDelta()

    // Camera controls    
    controls.update()

    // Render frame
    renderer.render(scene, mainCamera)

    // Call animationFrame() function on the next frame
    window.requestAnimationFrame(animationFrame)
}
animationFrame()

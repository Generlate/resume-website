import './style.css'

import * as THREE from './three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.d.ts';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.d.ts';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.1, 1000000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias:true
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0px';
renderer.domElement.style.left = '0px';


renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.0;

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

const studioLight = new THREE.SpotLight(0xFFF8DE, 0.3)
studioLight.position.set(-12.1, 3, -2.5)
studioLight.target.position.set(-12.1, 0, -6.5);
studioLight.angle = Math.PI / 8.3;
studioLight.exponent = 50;
studioLight.distance = 10;
studioLight.decay = 0.75;
studioLight.castShadow = true;

const studioLight2 = new THREE.SpotLight(0xFFFDBE, 0.2)
studioLight2.position.set(-12.1, 2.5, 2.5)
studioLight2.target.position.set(-12.1, 0.9, -6.5);
studioLight2.angle = Math.PI / 8.3;
studioLight2.exponent = 5;
studioLight2.distance = 20;
studioLight2.decay = 0.75;
studioLight2.castShadow = true;

const directionalLight = new THREE.DirectionalLight(0xFFF8DE, 0.2);
directionalLight.position.set(2, 2, 5)

const ambientLight = new THREE.AmbientLight(0xFFF8DE, 0.5)

scene.add(studioLight, directionalLight, ambientLight)

const lightHelper = new THREE.SpotLightHelper(studioLight)
const lightHelper2 = new THREE.SpotLightHelper(studioLight2)
// const gridHelper = new THREE.GridHelper(2000, 200);
// gridHelper.position.set(0, 0.1, 0);
scene.add()

const controls = new OrbitControls(camera, renderer.domElement);


camera.position.set(-12, 0.5, 0);
controls.target.set(20, 16, -150);
// controls.enablePan = false;




















// make sky

const skyTexture = new THREE.TextureLoader().load('./assets/sky.png');

const sky = new THREE.Mesh(
  new THREE.SphereGeometry(900, 32, 32),
  new THREE.MeshStandardMaterial({
    map: skyTexture,
    side: THREE.BackSide
  })
);

scene.add(sky);

sky.position.z = 30;
sky.position.setX(-10);













// make floor

const floorMaterial = {
  clearcoat: 1.0,
  clearcoatRoughness: 0.15,
  metalness: 1,
  roughness: 0.05, 
  color: 0xffffff,
};

const floorGeo = new THREE.BoxGeometry(3000, 4, 3000)
const floorMat = new THREE.MeshPhysicalMaterial(floorMaterial);
const floorMesh = new THREE.Mesh(floorGeo, floorMat);
scene.add(floorMesh);
floorMesh.position.set(-2, -1.9, -5);



























// load buildings 

const loader = new GLTFLoader();

loader.load('./assets/Building.glb', function ( glb ) {
  console.log(glb)
  const root = glb.scene;
  const glassMesh = glb.scene.getObjectByName('KB3D_EVC_BldgLG_B_Main')
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x818181,
    opacity: 0.75,
    transparent: true,
    metalness: 1,
    roughness: 0
  })
  glassMesh.material = glassMaterial;
  root.scale.set(1, 1, 1)
  root.rotateY(1.57)

  scene.add(root);

  const loader = document.querySelector(".loader");
  loader.classList.add("loader--hidden");
  loader.addEventListener("transitionend", () => {
    document.body.removeChild(document.querySelector(".loader"));
  });
});


























// make ring floor light 

const ringGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.02, 128);
const glassLoader = new THREE.TextureLoader();
const ringMaterial = new THREE.MeshStandardMaterial({ map: glassLoader.load('./assets/platform.jpg') });
const ringLight = new THREE.SpotLight( 0xB9B794, 4);
ringLight.position.set(-12.025, -5, -6.5);
ringLight.target.position.set(-12.025, 15, -6.5);
ringLight.angle = Math.PI / 32;
ringLight.exponent = 5;
ringLight.distance = 7;
ringLight.decay = 0.5;
ringLight.castShadow = true;
const ringLightHelper = new THREE.SpotLightHelper(ringLight)
const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
ringMesh.position.set(-12.025, 0.1, -6.5)
scene.add(ringMesh, ringLight);























// load character
const characterLoader = new GLTFLoader();

characterLoader.load('./assets/Avatar.glb', function ( glb ) {
  console.log(glb)
  const root = glb.scene;
  root.scale.set(0.95, 0.95, 0.95)
  root.position.set( -12.025, 0.1, -6.5)
  root.rotation.set(0, Math.PI, 0)

  root.traverse(function (object) {
    if (object.isMesh) {
      object.receiveShadow = true;
    }
  });

  scene.add(root);
}, function(xhr){
  console.log((xhr.loaded/xhr.total * 100) + "% loaded")
}, function(error){
  console.log('An error occurred')
} )












































// add fog
scene.fog = new THREE.FogExp2(0x1C1C0E, 0.0016);













//add particle effect
const boxGeometry = new THREE.BoxGeometry(0.012, 0.012, 0.012);

const boxMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffe500,
  roughness: 0.35,
  metalness: 1,
  transparent: true,
  opacity: 0.57,
  emissive: 0xffe500,
  emissiveIntensity: 0.85,
  clearcoat: 1
});

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffed4a });
const edges = new THREE.EdgesGeometry(boxGeometry);

const yMax = 4;
const boxes = [];

const createMesh = (() => {
  
  return () => {
    const r = 0.6 * Math.random();
    const theta = Math.random() * Math.PI;
    
    const x = r * 0.6 * Math.cos(theta) - 12.025;
    const z = r * 0.6 * Math.sin(theta) - 6.5;

    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(x, 0, z);
    
    scene.add(boxMesh);

    const lines = new THREE.LineSegments(edges, lineMaterial);
    boxMesh.add(lines);

    boxes.push({
      mesh: boxMesh,
      maxPosY: yMax * Math.random(),
      currPosY: 0,
      rotationSpeed: Math.random() * 0.015 + 0.0025,
      rotationAngle: new THREE.Vector2(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)
    });
  };
})();

const animate = (() => {
  let frameCounter = 0;

  return () => {
    controls.update();
    requestAnimationFrame(animate);

    frameCounter++;

    if (frameCounter % 10 === 0) {
      createMesh();
    }

    boxes.forEach((box, index) => {
      box.currPosY += 0.002;

      if (box.mesh.scale.y <= 0.02) {
        scene.remove(box.mesh);
        boxes.splice(index, 1);
      } else {
        const scaleFactor = Math.max(0.02, (2 - box.currPosY / box.maxPosY * 4));
        box.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        box.rotationAngle.addScalar(box.rotationSpeed);
        box.mesh.rotation.set(box.rotationAngle.x, 0, box.rotationAngle.y);
      }

      const angle = box.currPosY / box.maxPosY * Math.PI * 8;
      const x = box.mesh.position.x + Math.cos(angle + box.rotationAngle.x) * 0.003;
      const z = box.mesh.position.z + Math.sin(angle + box.rotationAngle.y) * 0.003;

      box.mesh.position.set(x, box.currPosY, z);
    });

    renderer.render(scene, camera);
  };
})();

animate();


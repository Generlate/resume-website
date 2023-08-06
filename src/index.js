"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var OrbitControls_js_1 = require("three/addons/controls/OrbitControls.js");
var GLTFLoader_js_1 = require("three/addons/loaders/GLTFLoader.js");
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(20, (window.innerWidth / 2.9) / window.innerHeight, 0.1, 1000000);
var renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth / 2.9, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.0;
var onWindowResize = function () {
    camera.aspect = (window.innerWidth / 2.9) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize((window.innerWidth / 2.9), window.innerHeight);
};
window.addEventListener('resize', onWindowResize, false);
var studioLight = new THREE.SpotLight(0xFFF8DE, 0.3);
studioLight.position.set(-12.1, 3, -2.5);
studioLight.target.position.set(-12.1, 0, -6.5);
studioLight.angle = Math.PI / 8.3;
studioLight.exponent = 50;
studioLight.distance = 10;
studioLight.decay = 0.75;
studioLight.castShadow = true;
var studioLight2 = new THREE.SpotLight(0xFFFDBE, 0.2);
studioLight2.position.set(-12.1, 2.5, 2.5);
studioLight2.target.position.set(-12.1, 0.9, -6.5);
studioLight2.angle = Math.PI / 8.3;
studioLight2.exponent = 5;
studioLight2.distance = 20;
studioLight2.decay = 0.75;
studioLight2.castShadow = true;
var directionalLight = new THREE.DirectionalLight(0xFFF8DE, 0.2);
directionalLight.position.set(2, 2, 5);
var ambientLight = new THREE.AmbientLight(0xFFF8DE, 0.5);
scene.add(studioLight, directionalLight, ambientLight);
var lightHelper = new THREE.SpotLightHelper(studioLight);
var lightHelper2 = new THREE.SpotLightHelper(studioLight2);
scene.add();
var controls = new OrbitControls_js_1.OrbitControls(camera, renderer.domElement);
camera.position.set(-12, 0.5, 0);
controls.target.set(-12.5, 16, -150);
var skyTexture = new THREE.TextureLoader().load('../public/sky.png');
var sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 32), new THREE.MeshStandardMaterial({
    map: skyTexture,
    side: THREE.BackSide
}));
scene.add(sky);
sky.position.z = 30;
sky.position.setX(-10);
var floorMaterial = {
    clearcoat: 1.0,
    clearcoatRoughness: 0.15,
    metalness: 1,
    roughness: 0.05,
    color: 0xffffff,
};
var floorGeo = new THREE.BoxGeometry(3000, 4, 3000);
var floorMat = new THREE.MeshPhysicalMaterial(floorMaterial);
var floorMesh = new THREE.Mesh(floorGeo, floorMat);
scene.add(floorMesh);
floorMesh.position.set(-2, -1.9, -5);
var loader = new GLTFLoader_js_1.GLTFLoader();
loader.load('../public/Building.glb', function (glb) {
    console.log(glb);
    var root = glb.scene;
    var glassMesh = glb.scene.getObjectByName('KB3D_EVC_BldgLG_B_Main');
    var glassMaterial = new THREE.MeshStandardMaterial({
        color: 0x818181,
        opacity: 0.75,
        transparent: true,
        metalness: 1,
        roughness: 0
    });
    glassMesh.material = glassMaterial;
    root.scale.set(1, 1, 1);
    root.rotateY(1.57);
    scene.add(root);
    var loader = document.querySelector(".loader");
    loader.classList.add("loader--hidden");
    loader.addEventListener("transitionend", function () {
        document.body.removeChild(document.querySelector(".loader"));
    });
});
var ringGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.02, 128);
var glassLoader = new THREE.TextureLoader();
var ringMaterial = new THREE.MeshStandardMaterial({ map: glassLoader.load('../public/platform.jpg') });
var ringLight = new THREE.SpotLight(0xB9B794, 4);
ringLight.position.set(-12.025, -5, -6.5);
ringLight.target.position.set(-12.025, 15, -6.5);
ringLight.angle = Math.PI / 32;
ringLight.exponent = 5;
ringLight.distance = 7;
ringLight.decay = 0.5;
ringLight.castShadow = true;
var ringLightHelper = new THREE.SpotLightHelper(ringLight);
var ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
ringMesh.position.set(-12.025, 0.1, -6.5);
scene.add(ringMesh, ringLight);
var characterLoader = new GLTFLoader_js_1.GLTFLoader();
characterLoader.load('../public/Avatar.glb', function (glb) {
    console.log(glb);
    var root = glb.scene;
    root.scale.set(0.95, 0.95, 0.95);
    root.position.set(-12.025, 0.1, -6.5);
    root.rotation.set(0, Math.PI, 0);
    root.traverse(function (object) {
        if (object.isMesh) {
            object.receiveShadow = true;
        }
    });
    scene.add(root);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "% loaded");
}, function (error) {
    console.log('An error occurred');
});
scene.fog = new THREE.FogExp2(0x1C1C0E, 0.0016);
var boxGeometry = new THREE.BoxGeometry(0.012, 0.012, 0.012);
var boxMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffe500,
    roughness: 0.35,
    metalness: 1,
    transparent: true,
    opacity: 0.57,
    emissive: 0xffe500,
    emissiveIntensity: 0.85,
    clearcoat: 1
});
var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffed4a });
var edges = new THREE.EdgesGeometry(boxGeometry);
var yMax = 4;
var boxes = [];
var createMesh = (function () {
    return function () {
        var r = 0.6 * Math.random();
        var theta = Math.random() * Math.PI;
        var x = r * 0.6 * Math.cos(theta) - 12.025;
        var z = r * 0.6 * Math.sin(theta) - 6.5;
        var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.position.set(x, 0, z);
        scene.add(boxMesh);
        var lines = new THREE.LineSegments(edges, lineMaterial);
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
var animate = (function () {
    var frameCounter = 0;
    return function () {
        controls.update();
        requestAnimationFrame(animate);
        frameCounter++;
        if (frameCounter % 10 === 0) {
            createMesh();
        }
        boxes.forEach(function (box, index) {
            box.currPosY += 0.002;
            if (box.mesh.scale.y <= 0.02) {
                scene.remove(box.mesh);
                boxes.splice(index, 1);
            }
            else {
                var scaleFactor = Math.max(0.02, (2 - box.currPosY / box.maxPosY * 4));
                box.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
                box.rotationAngle.addScalar(box.rotationSpeed);
                box.mesh.rotation.set(box.rotationAngle.x, 0, box.rotationAngle.y);
            }
            var angle = box.currPosY / box.maxPosY * Math.PI * 8;
            var x = box.mesh.position.x + Math.cos(angle + box.rotationAngle.x) * 0.003;
            var z = box.mesh.position.z + Math.sin(angle + box.rotationAngle.y) * 0.003;
            box.mesh.position.set(x, box.currPosY, z);
        });
        renderer.render(scene, camera);
    };
})();
animate();
//# sourceMappingURL=index.js.map
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const scene = new THREE.Scene();
const rendererCanvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({
    canvas: rendererCanvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
const initialCanvasWidth = window.innerWidth > 1375 ? window.innerWidth / 2.9 : window.innerWidth;
renderer.setSize(initialCanvasWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.0;
// Define a function to calculate the aspect ratio
const calculateAspectRatio = () => {
    return (window.innerWidth > 1375)
        ? window.innerWidth / (2.9 * window.innerHeight)
        : window.innerWidth / window.innerHeight;
};
// Initialize the camera with the initial aspect ratio
const initialAspectRatio = calculateAspectRatio();
const camera = new THREE.PerspectiveCamera(20, initialAspectRatio, 0.1, 1000);
// Define a function to update the camera and renderer
const updateCameraAndRenderer = () => {
    const aspectRatio = calculateAspectRatio();
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    const canvasWidth = (window.innerWidth > 1375) ? window.innerWidth / 2.9 : window.innerWidth;
    const canvasHeight = window.innerHeight;
    renderer.setSize(canvasWidth, canvasHeight);
};
// Call the update function initially
updateCameraAndRenderer();
// Add an event listener for window resize
window.addEventListener('resize', updateCameraAndRenderer, false);
const studioLight = new THREE.SpotLight(0xFFF8DE, 0.3);
studioLight.position.set(-12.1, 3, -2.5);
studioLight.target.position.set(-12.1, 0, -6.5);
studioLight.angle = Math.PI / 8.3;
studioLight.penumbra = 50;
studioLight.distance = 10;
studioLight.decay = 0.75;
studioLight.castShadow = true;
const studioLight2 = new THREE.SpotLight(0xFFFDBE, 0.2);
studioLight2.position.set(-12.1, 2.5, 2.5);
studioLight2.target.position.set(-12.1, 0.9, -6.5);
studioLight2.angle = Math.PI / 8.3;
studioLight2.penumbra = 5;
studioLight2.distance = 20;
studioLight2.decay = 0.75;
studioLight2.castShadow = true;
const directionalLight = new THREE.DirectionalLight(0xFFF8DE, 0.2);
directionalLight.position.set(2, 2, 5);
const ambientLight = new THREE.AmbientLight(0xFFF8DE, 0.5);
scene.add(studioLight, directionalLight, ambientLight);
// const lightHelper = new THREE.SpotLightHelper(studioLight)
// const lightHelper2 = new THREE.SpotLightHelper(studioLight2)
// const gridHelper = new THREE.GridHelper(2000, 200);
// gridHelper.position.set(0, 0.1, 0);
scene.add();
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-12, 0.5, 0);
controls.target.set(-12.5, 16, -150);
// make sky
const skyTexture = new THREE.TextureLoader().load('../public/sky.png');
const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 32), new THREE.MeshStandardMaterial({
    map: skyTexture,
    side: THREE.BackSide
}));
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
const floorGeo = new THREE.BoxGeometry(3000, 4, 3000);
const floorMat = new THREE.MeshPhysicalMaterial(floorMaterial);
const floorMesh = new THREE.Mesh(floorGeo, floorMat);
scene.add(floorMesh);
floorMesh.position.set(-2, -2, -5);
// load buildings 
const loader = new GLTFLoader();
loader.load('../public/building.glb', function (glb) {
    console.log(glb);
    const root = glb.scene;
    const glassMesh = root.getObjectByName('KB3D_EVC_BldgLG_B_Main');
    const glassMaterial = new THREE.MeshStandardMaterial({
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
    const loaderElement = document.querySelector(".loader");
    loaderElement?.classList.add("loader--hidden");
    loaderElement?.addEventListener("transitionend", () => {
        loaderElement.parentNode?.removeChild(loaderElement);
    });
});
// make ring floor light 
const lightGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.02, 128);
const glassLoader = new THREE.TextureLoader();
const ringMaterial = new THREE.MeshStandardMaterial({ map: glassLoader.load('../public/platform.jpg') });
const ringLight = new THREE.SpotLight(0xB9B794, 4);
ringLight.position.set(-12.025, -5, -6.5);
ringLight.target.position.set(-12.025, 15, -6.5);
ringLight.angle = Math.PI / 32;
ringLight.penumbra = 5;
ringLight.distance = 7;
ringLight.decay = 0.5;
ringLight.castShadow = true;
// const ringLightHelper = new THREE.SpotLightHelper(ringLight)
// load character
const characterLoader = new GLTFLoader();
characterLoader.load('../public/avatar.glb', function (glb) {
    console.log(glb);
    const root = glb.scene;
    root.scale.set(0.95, 0.95, 0.95);
    root.position.set(-12.025, 0.1, -6.5);
    root.rotation.set(0, Math.PI, 0);
    root.traverse(function (object) {
        if (object instanceof THREE.Mesh) {
            object.receiveShadow = true;
        }
    });
    scene.add(root);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "% loaded");
}, function (error) {
    console.log('An error occurred');
});
// add fog
scene.fog = new THREE.FogExp2(0x1C1C0E, 0.0016);
// add portal edge
const circleRadius = 0.5;
const circleSegments = 256;
let circleVertices = [];
const OFFSET_X = -12.025;
const OFFSET_Z = -6.5;
const ringGeometry = new THREE.CircleGeometry(circleRadius, circleSegments);
const textureLoader = new THREE.TextureLoader();
const circleAngleInRadians = 2 * Math.PI;
const quarterCircleAngleInRadians = Math.PI / 2;
for (let i = 0; i <= circleSegments; i++) {
    const angle = (i / circleSegments) * circleAngleInRadians;
    const x = Math.cos(angle) * circleRadius;
    const z = Math.sin(angle) * circleRadius;
    circleVertices.push(new THREE.Vector3(x, 0, z));
}
const portalEdgeGeometry = new THREE.BufferGeometry().setFromPoints(circleVertices);
const portalEdgeMaterial = new THREE.LineBasicMaterial({ color: 0xffe500 });
const portalEdgeMesh = new THREE.LineLoop(portalEdgeGeometry, portalEdgeMaterial);
portalEdgeMesh.position.set(OFFSET_X, 0.1, OFFSET_Z);
scene.add(portalEdgeMesh);
// add fuzzy ring
const fuzzyRingTexture = textureLoader.load('public/ring.jpg');
const fuzzyRingMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: fuzzyRingTexture,
    transparent: true,
    opacity: 1,
    color: new THREE.Color(0xFFF282),
    depthWrite: false,
    blending: THREE.AdditiveBlending
});
const fuzzyRingMesh = new THREE.Mesh(ringGeometry, fuzzyRingMaterial);
fuzzyRingMesh.position.set(OFFSET_X, 0.1, OFFSET_Z);
fuzzyRingMesh.rotation.x = quarterCircleAngleInRadians;
fuzzyRingMesh.scale.set(1.9, 1.4, 1.4);
scene.add(fuzzyRingMesh);
// add gradient fill
const gradientCanvas = document.createElement('canvas');
gradientCanvas.width, gradientCanvas.height = circleRadius * 426.67;
const gradientCtx = gradientCanvas.getContext('2d');
const gradient = gradientCtx.createRadialGradient(gradientCanvas.width / 2, gradientCanvas.height / 2, 0, gradientCanvas.width / 2, gradientCanvas.height / 2, gradientCanvas.width / 2);
gradient.addColorStop(0, 'rgb(168, 159, 82)');
gradient.addColorStop(1, 'rgb(0, 0, 0)');
gradientCtx.fillStyle = gradient;
gradientCtx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
const fillGradientTexture = new THREE.CanvasTexture(gradientCanvas);
const fillGradientMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: fillGradientTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true
});
const fillGradientMesh = new THREE.Mesh(ringGeometry, fillGradientMaterial);
fillGradientMesh.position.set(OFFSET_X, 0.1, OFFSET_Z);
fillGradientMesh.rotation.x = quarterCircleAngleInRadians;
scene.add(fillGradientMesh);
// add smoke
const smokeInstances = 15;
const smokeTexture = textureLoader.load('public/smoke.png');
const portalSmokeMaterial = new THREE.MeshBasicMaterial({
    map: smokeTexture,
    color: 0xFFF282,
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false // Prevent sorting issues with transparency
});
const smokeGroup = new THREE.Group();
const smokeAngleIncrement = circleAngleInRadians / smokeInstances;
// Position smoke meshes evenly around the circle's edge
for (let i = 0; i < smokeInstances; i++) {
    const angle = i * smokeAngleIncrement;
    const smokeMesh = new THREE.Mesh(ringGeometry, portalSmokeMaterial);
    const x = circleRadius * Math.cos(angle) + OFFSET_X;
    const z = circleRadius * Math.sin(angle) + OFFSET_Z;
    smokeMesh.position.set(x, 0.1, z);
    smokeMesh.rotation.x = quarterCircleAngleInRadians;
    smokeMesh.scale.set(0.25, 0.25, 0.25);
    smokeGroup.add(smokeMesh);
}
scene.add(smokeGroup);
// add lightning
const lightningInstances = 8;
const lightningTexture = textureLoader.load('public/lightning.png');
const portalLightningMaterial = new THREE.MeshBasicMaterial({
    map: lightningTexture,
    color: 0xFFF282,
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false // Prevent sorting issues with transparency
});
const lightningGroup = new THREE.Group();
// Position lightning meshes evenly around the circle's edge
for (let i = 0; i < lightningInstances; i++) {
    const lightningAngleIncrement = circleAngleInRadians / lightningInstances;
    const angle = i * lightningAngleIncrement;
    const depth = 0.15;
    const x = (circleRadius - depth) * Math.cos(angle) + OFFSET_X;
    const z = (circleRadius - depth) * Math.sin(angle) + OFFSET_Z;
    const lightningMesh = new THREE.Mesh(ringGeometry, portalLightningMaterial);
    lightningMesh.position.set(x, 0.1, z);
    lightningMesh.rotation.x = quarterCircleAngleInRadians;
    lightningMesh.scale.set(0.45, 0.45, 0.45);
    lightningGroup.add(lightningMesh);
}
scene.add(lightningGroup);
//add particles
const randomHalfCircleAngle = Math.random() * Math.PI;
const yMax = 4;
function createInteriorParticleMesh() {
    const particleGeometry = new THREE.BoxGeometry(0.004, 0.004, 0.004);
    const particleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffe500,
        roughness: 0.35,
        metalness: 1,
        transparent: true,
        opacity: 0.57,
        emissive: 0xffe500,
        emissiveIntensity: 0.85,
        clearcoat: 1,
        blending: THREE.AdditiveBlending
    });
    const edges = new THREE.EdgesGeometry(particleGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xFFEC43
    });
    const particleMesh = new THREE.Mesh(particleGeometry, particleMaterial);
    particleMesh.add(new THREE.LineSegments(edges, lineMaterial));
    return particleMesh;
}
function createInteriorParticleInstance(particles) {
    const angle = Math.random() * circleAngleInRadians;
    const x = Math.random() * Math.cos(angle) * circleRadius + OFFSET_X;
    const z = Math.random() * Math.sin(angle) * circleRadius + OFFSET_Z;
    const particleMesh = createInteriorParticleMesh();
    particleMesh.position.set(x, 0, z);
    particles.push({
        mesh: particleMesh,
        maxPosY: yMax * Math.random(),
        currPosY: 0.1,
        rotationSpeed: Math.random() * 0.016,
        rotationAngle: new THREE.Vector2(randomHalfCircleAngle, randomHalfCircleAngle),
    });
    scene.add(particleMesh);
}
// Interior particles
const interiorBoxes = [];
function createInteriorMeshInstance() {
    createInteriorParticleInstance(interiorBoxes);
}
// animations
let frameCounter = 0;
function updateOpacityAnimation(material) {
    const opacitySpeed = 0.01;
    const minOpacity = 0.5;
    const maxOpacity = 1.0;
    const opacityRange = maxOpacity - minOpacity;
    const opacityValue = minOpacity + opacityRange * (Math.sin(frameCounter * opacitySpeed) + 1) / 2;
    material.opacity = opacityValue;
}
function updateSmokeScaling(smokeMesh, frameCounter) {
    const smokeMinScale = 0.25;
    const smokeMaxScale = 0.35;
    const scalingSpeed = 0.005;
    const scalingFactor = smokeMinScale + (smokeMaxScale - smokeMinScale) * (Math.sin(frameCounter * scalingSpeed) + 1) / 2;
    smokeMesh.scale.set(scalingFactor, scalingFactor, scalingFactor);
}
function updateSmokeOpacity(smokeMesh) {
    const smokeOpacitySpeed = 0.01;
    const smokeMinOpacity = 0.2;
    const smokeMaxOpacity = 0.8;
    const smokeOpacityRange = smokeMaxOpacity - smokeMinOpacity;
    const smokeOpacityValue = smokeMinOpacity + (smokeOpacityRange) * (Math.sin(frameCounter * smokeOpacitySpeed) + 1) / 2;
    smokeMesh.material.opacity = smokeOpacityValue;
}
function updateSmokeRotation(smokeMesh) {
    const smokeRotationSpeed = 0.004;
    const randomValue = Math.random();
    if (randomValue < 0.3) {
        smokeMesh.rotation.z -= smokeRotationSpeed;
    }
    else {
        smokeMesh.rotation.z += smokeRotationSpeed;
    }
}
function updateSmokeAnimation(smokeGroup, frameCounter) {
    smokeGroup.children.forEach(function (smokeMesh) {
        updateSmokeRotation(smokeMesh);
        updateSmokeOpacity(smokeMesh);
        updateSmokeScaling(smokeMesh, frameCounter);
    });
}
// add lightning animation
let lightningOpacityLoopCounter = 0;
function updateLightningOpacityLoop() {
    const lightningOpacityMax = 1;
    const opacityDecayRate = 0.0019;
    for (let i = 0; i < lightningGroup.children.length; i++) {
        const lightningMesh = lightningGroup.children[i];
        const opacityValue = lightningOpacityMax - (lightningOpacityLoopCounter * opacityDecayRate);
        if (lightningMesh instanceof THREE.Mesh) {
            const material = lightningMesh.material;
            material.opacity = opacityValue;
        }
    }
    lightningOpacityLoopCounter++;
}
function calculateNumVisibleLightning() {
    const minVisibleLightning = 2;
    const maxVisibleLightning = 5;
    const visibleLightningRange = maxVisibleLightning - minVisibleLightning;
    const numVisibleLightning = Math.floor(Math.random() * (visibleLightningRange + 1)) + minVisibleLightning;
    return numVisibleLightning;
}
function generateShuffledIndices(length) {
    const indices = Array.from({ length: length }, function (_, i) {
        return i;
    });
    const shuffledIndices = indices.sort(function () {
        return Math.random() - 0.5;
    });
    return shuffledIndices;
}
function setVisibleLightningIndices(lightningGroup, visibleIndices) {
    for (let i = 0; i < lightningInstances; i++) {
        lightningGroup.children[i].visible = visibleIndices.includes(i);
    }
}
const startingPositions = [];
lightningGroup.children.forEach(function (lightningMesh) {
    startingPositions.push(lightningMesh.position.clone());
});
function resetLightningPositions() {
    lightningGroup.children.forEach(function (lightningMesh, index) {
        lightningMesh.position.copy(startingPositions[index]);
    });
}
function moveLightningMeshes() {
    const movementSpeed = 0.001;
    const centerPosition = new THREE.Vector3(OFFSET_X, 0.1, OFFSET_Z);
    lightningGroup.children.forEach(function (lightningMesh, index) {
        const isMovingToCenter = lightningMesh.visible;
        const targetPosition = isMovingToCenter ? centerPosition : startingPositions[index];
        const direction = targetPosition.clone().sub(lightningMesh.position);
        const distanceToTarget = direction.length();
        if (distanceToTarget > movementSpeed) {
            direction.normalize().multiplyScalar(movementSpeed);
            lightningMesh.position.add(direction);
        }
    });
}
function updateVisibleLightning(frameCounter) {
    const subsetDuration = 475;
    if (frameCounter % subsetDuration === 0) {
        const numVisibleLightning = calculateNumVisibleLightning();
        const shuffledIndices = generateShuffledIndices(lightningInstances);
        const visibleIndices = shuffledIndices.slice(0, numVisibleLightning);
        setVisibleLightningIndices(lightningGroup, visibleIndices);
        resetLightningPositions();
        lightningOpacityLoopCounter = 0;
    }
    moveLightningMeshes();
    updateLightningOpacityLoop();
}
function updateLightningAnimation() {
    updateLightningOpacityLoop();
    updateVisibleLightning(frameCounter);
}
// add circle edge animation
function updatePortalEdgeAnimation() {
    const waveFrequency1 = 2;
    const waveFrequency2 = 12;
    const waveAmplitude1 = 0.009;
    const waveAmplitude2 = 0.004;
    const vertices = portalEdgeGeometry.attributes.position.array;
    for (let i = 0; i <= circleSegments; i++) {
        const angle = (i / circleSegments) * circleAngleInRadians;
        const vertexIndex = i * 3;
        const originalY = circleVertices[i].y;
        const waveOffset1 = Math.sin(angle * waveFrequency1 + (frameCounter * 0.01)) * waveAmplitude1;
        const waveOffset2 = Math.cos(angle * waveFrequency2 + (frameCounter * 0.01)) * waveAmplitude2;
        const combinedWaveOffset = waveOffset1 + waveOffset2;
        vertices[vertexIndex + 1] = originalY - combinedWaveOffset;
    }
    portalEdgeGeometry.attributes.position.needsUpdate = true;
}
function createEdgeParticleMesh() {
    const particleGeometry = new THREE.BoxGeometry(0.03, 0.03, 0.03);
    const particleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffe500,
        roughness: 0.35,
        metalness: 1,
        transparent: true,
        opacity: 0.57,
        emissive: 0xffe500,
        emissiveIntensity: 0.85,
        clearcoat: 1,
        blending: THREE.AdditiveBlending
    });
    const edges = new THREE.EdgesGeometry(particleGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xFFEC43
    });
    const particleMesh = new THREE.Mesh(particleGeometry, particleMaterial);
    particleMesh.add(new THREE.LineSegments(edges, lineMaterial));
    return particleMesh;
}
function createEdgeParticleInstance(particles) {
    const angle = Math.random() * circleAngleInRadians;
    const x = Math.cos(angle) * circleRadius + OFFSET_X;
    const z = Math.sin(angle) * circleRadius + OFFSET_Z;
    const particleMesh = createEdgeParticleMesh();
    particleMesh.position.set(x, 0, z);
    particles.push({
        mesh: particleMesh,
        maxPosY: yMax * Math.random(),
        currPosY: 0.1,
        rotationSpeed: Math.random() * 0.016,
        rotationAngle: new THREE.Vector2(randomHalfCircleAngle, randomHalfCircleAngle),
    });
    scene.add(particleMesh);
}
// Exterior particles
const edgeBoxes = [];
function createEdgeMeshInstance() {
    createEdgeParticleInstance(edgeBoxes);
}
// add box particle animation
function updateBoxAnimation() {
    if (frameCounter % 30 === 0) {
        createEdgeMeshInstance();
    }
    if (frameCounter % 2 === 0) {
        createInteriorMeshInstance();
    }
    edgeBoxes.forEach(updateEdgeBox);
    interiorBoxes.forEach(updateInteriorBox);
}
function updateBoxScaleAndRotation(box) {
    const scaleFactor = Math.max(0.02, (2 - box.currPosY / box.maxPosY * 4));
    box.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
    box.rotationAngle.addScalar(box.rotationSpeed);
    box.mesh.rotation.set(box.rotationAngle.x, 0, box.rotationAngle.y);
}
function updateBoxPosition(box) {
    const angle = box.currPosY / box.maxPosY * Math.PI * 8;
    const x = box.mesh.position.x + Math.cos(angle) * 0.0012;
    const z = box.mesh.position.z + Math.sin(angle) * 0.0012;
    box.mesh.position.set(x, box.currPosY, z);
}
function updateEdgeBox(box, index) {
    box.currPosY += 0.002;
    if (shouldRemoveBox(box)) {
        removeEdgeBox(box, index);
    }
    else {
        updateBoxScaleAndRotation(box);
        updateBoxPosition(box);
    }
}
function updateInteriorBox(box, index) {
    box.currPosY += 0.002;
    if (shouldRemoveBox(box)) {
        removeInteriorBox(box, index);
    }
    else {
        updateBoxScaleAndRotation(box);
        updateBoxPosition(box);
    }
}
function shouldRemoveBox(box) {
    return box.mesh.scale.y <= 0.02;
}
function removeEdgeBox(box, index) {
    scene.remove(box.mesh);
    edgeBoxes.splice(index, 1);
}
function removeInteriorBox(box, index) {
    scene.remove(box.mesh);
    interiorBoxes.splice(index, 1);
}
// combine all animation functions to one
function portalAnimation() {
    updateOpacityAnimation(fillGradientMaterial);
    updateOpacityAnimation(fuzzyRingMaterial);
    updatePortalEdgeAnimation();
    updateBoxAnimation();
    updateSmokeAnimation(smokeGroup, frameCounter);
    updateLightningAnimation();
}
// setup overall scene animation
function renderScene() {
    renderer.render(scene, camera);
}
function animate() {
    controls.update();
    portalAnimation();
    requestAnimationFrame(animate);
    renderScene();
    frameCounter++;
}
animate();
//# sourceMappingURL=index.js.map
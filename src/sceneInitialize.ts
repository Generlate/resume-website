import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const rendererCanvas = document.querySelector("canvas") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({
    // canvas: rendererCanvas,
    antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
const initialCanvasWidth =
    window.innerWidth > 1024 ? window.innerWidth / 2.9 : window.innerWidth;
renderer.setSize(initialCanvasWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.0;

const calculateAspectRatio = (): number => {
    return window.innerWidth > 1024
        ? window.innerWidth / (2.9 * window.innerHeight)
        : window.innerWidth / window.innerHeight;
};

const camera = new THREE.PerspectiveCamera(
    20,
    calculateAspectRatio(),
    0.1,
    1000
);

const updateCameraAndRenderer = (): void => {
    camera.aspect = calculateAspectRatio();
    camera.updateProjectionMatrix();
    const canvasWidth =
        window.innerWidth > 1024 ? window.innerWidth / 2.9 : window.innerWidth;
    const canvasHeight = window.innerHeight;
    renderer.setSize(canvasWidth, canvasHeight);
};

window.addEventListener("resize", updateCameraAndRenderer, false);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(-12, 0.5, 0);
controls.target.set(-14.5, 16, -150);

export { scene, renderer, camera, controls };

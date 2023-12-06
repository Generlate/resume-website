import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from './sceneInitialize.js';
export function loadCharacterModel() {
    const characterLoader = new GLTFLoader();
    characterLoader.load('../public/avatar.glb', characterTransformation, onProgress, onError);
}
function characterTransformation(glb) {
    const root = glb.scene;
    root.scale.set(0.95, 0.95, 0.95);
    root.position.set(-12.08, 0.1, -6.5);
    root.rotation.set(0, Math.PI, 0);
    makeMeshesReceiveShadows(root);
    scene.add(root);
}
function onProgress(xhr) {
    const xhrTotal = 11280744;
    const percentageLoaded = (xhr.loaded / xhrTotal) * 100;
    const loaderText = document.querySelector('.loader-text');
    if (loaderText) {
        loaderText.textContent = `${Math.round(percentageLoaded)}%`;
    }
}
function onError(error) {
    console.error('An error occurred:', error);
}
function makeMeshesReceiveShadows(root) {
    root.traverse(function (object) {
        if (object instanceof THREE.Mesh) {
            object.receiveShadow = true;
        }
    });
}
const loaderElement = document.querySelector('.loader');
loaderElement?.classList.add('loader--hidden');
loaderElement?.addEventListener('transitionend', () => {
    loaderElement.parentNode?.removeChild(loaderElement);
});
//# sourceMappingURL=character.js.map
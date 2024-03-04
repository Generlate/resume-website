import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";

export function loadBuildingModel(scene: THREE.Scene): void {
    const loader = new GLTFLoader();

    loader.load("../public/building.glb", function (glb: GLTF) {
        const root = glb.scene;
        const glassMesh = root.getObjectByName(
            "KB3D_EVC_BldgLG_B_Main"
        ) as THREE.Mesh;
        const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0x818181,
            opacity: 0.75,
            transparent: true,
            metalness: 1,
            roughness: 0,
        });
        glassMesh.material = glassMaterial;
        root.scale.set(1, 1, 1);
        root.rotateY(1.57);

        scene.add(root);
    });
}

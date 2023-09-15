import * as THREE from "three";
export function setupScene(scene) {
    // Lights
    const studioLight = new THREE.SpotLight(0xFFF8DE, 0.3);
    studioLight.position.set(-12.1, 3, -2.5);
    studioLight.target.position.set(-12.1, 0, -6.5);
    const directionalLight = new THREE.DirectionalLight(0xFFF8DE, 0.2);
    directionalLight.position.set(2, 2, 5);
    const ambientLight = new THREE.AmbientLight(0xFFF8DE, 0.5);
    scene.add(studioLight, directionalLight, ambientLight);
    // Sky
    const skyTexture = new THREE.TextureLoader().load("../public/sky.png");
    const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 32), new THREE.MeshStandardMaterial({
        map: skyTexture,
        side: THREE.BackSide,
    }));
    scene.add(sky);
    sky.position.z = 30;
    sky.position.setX(-10);
    // Floor
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
    // Fog
    scene.fog = new THREE.FogExp2(0x1C1C0E, 0.002);
}
//# sourceMappingURL=sceneSetup.js.map
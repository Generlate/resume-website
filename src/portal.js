import * as THREE from 'three';
export function createPortal(scene, camera, renderer, controls) {
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
    gradient.addColorStop(0, "rgb(168, 159, 82)");
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
    const lightningTexture = textureLoader.load("public/lightning.png");
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
    function instantiateInteriorParticleMesh() {
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
    function createInteriorParticle(particles) {
        const angle = Math.random() * circleAngleInRadians;
        const x = Math.random() * Math.cos(angle) * circleRadius + OFFSET_X;
        const z = Math.random() * Math.sin(angle) * circleRadius + OFFSET_Z;
        const particleMesh = instantiateInteriorParticleMesh();
        particleMesh.position.set(x, 0, z);
        particles.push({
            mesh: particleMesh,
            maxPosY: yMax * Math.random(),
            currPosY: 0.1,
            rotationSpeed: Math.random() * 0.016,
            rotationAngle: new THREE.Vector2(randomHalfCircleAngle, randomHalfCircleAngle)
        });
        scene.add(particleMesh);
    }
    // Interior particles
    const interiorBoxes = [];
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
        randomValue < 0.3 ? smokeMesh.rotation.z -= smokeRotationSpeed : smokeMesh.rotation.z += smokeRotationSpeed;
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
    function instantiateEdgeParticleMesh() {
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
    function createEdgeParticle(particles) {
        const angle = Math.random() * circleAngleInRadians;
        const x = Math.cos(angle) * circleRadius + OFFSET_X;
        const z = Math.sin(angle) * circleRadius + OFFSET_Z;
        const particleMesh = instantiateEdgeParticleMesh();
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
    // add box particle animation
    function updateBoxAnimation() {
        if (frameCounter % 30 === 0) {
            createEdgeParticle(edgeBoxes);
        }
        if (frameCounter % 2 === 0) {
            createInteriorParticle(interiorBoxes);
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
}
//# sourceMappingURL=portal.js.map
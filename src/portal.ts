import * as THREE from 'three'

export function createPortal (scene: any, camera: any, renderer: any, controls: any): void {
  // add portal edge
  const circleRadius: number = 0.5
  const circleSegments: number = 256
  const circleVertices: THREE.Vector3[] = []
  const OFFSET_X: number = -12.025
  const OFFSET_Z: number = -6.5
  const ringGeometry = new THREE.CircleGeometry(circleRadius, circleSegments)
  const textureLoader = new THREE.TextureLoader()
  const circleAngleInRadians: number = 2 * Math.PI
  const quarterCircleAngleInRadians: number = Math.PI / 2
  for (let i = 0; i <= circleSegments; i++) {
    const angle = (i / circleSegments) * circleAngleInRadians
    const x = Math.cos(angle) * circleRadius
    const z = Math.sin(angle) * circleRadius
    circleVertices.push(new THREE.Vector3(x, 0, z))
  }

  const portalEdgeGeometry = new THREE.BufferGeometry().setFromPoints(circleVertices)
  const portalEdgeMaterial = new THREE.LineBasicMaterial({ color: 0xffe500 })
  const portalEdgeMesh = new THREE.LineLoop(portalEdgeGeometry, portalEdgeMaterial)
  portalEdgeMesh.position.set(OFFSET_X, 0.1, OFFSET_Z)
  scene.add(portalEdgeMesh)

  // add fuzzy ring
  const fuzzyRingTexture = textureLoader.load('public/ring.jpg')
  const fuzzyRingMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: fuzzyRingTexture,
    transparent: true,
    opacity: 1,
    color: new THREE.Color(0xFFF282),
    depthWrite: false, // Prevent sorting issues with transparency
    blending: THREE.AdditiveBlending
  })
  const fuzzyRingMesh: THREE.Mesh = new THREE.Mesh(ringGeometry, fuzzyRingMaterial)
  fuzzyRingMesh.position.set(OFFSET_X, 0.1, OFFSET_Z)
  fuzzyRingMesh.rotation.x = quarterCircleAngleInRadians
  fuzzyRingMesh.scale.set(1.9, 1.4, 1.4)
  scene.add(fuzzyRingMesh)

  // add gradient fill
  const gradientCanvas: any = document.createElement('canvas')
  gradientCanvas.width = circleRadius * 426.67
  gradientCanvas.height = circleRadius * 426.67
  const gradientCtx: any = gradientCanvas.getContext('2d')
  const gradient: any = gradientCtx.createRadialGradient(
    gradientCanvas.width / 2, gradientCanvas.height / 2, 0,
    gradientCanvas.width / 2, gradientCanvas.height / 2, gradientCanvas.width / 2
  )
  gradient.addColorStop(0, 'rgb(168, 159, 82)')
  gradient.addColorStop(1, 'rgb(0, 0, 0)')
  gradientCtx.fillStyle = gradient
  gradientCtx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height)
  const fillGradientTexture = new THREE.CanvasTexture(gradientCanvas)
  const fillGradientMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: fillGradientTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true
  })
  const fillGradientMesh: THREE.Mesh = new THREE.Mesh(ringGeometry, fillGradientMaterial)
  fillGradientMesh.position.set(OFFSET_X, 0.1, OFFSET_Z)
  fillGradientMesh.rotation.x = quarterCircleAngleInRadians
  scene.add(fillGradientMesh)

  // add smoke
  const smokeInstances: number = 15
  const smokeTexture = textureLoader.load('public/smoke.png')
  const portalSmokeMaterial = new THREE.MeshBasicMaterial({
    map: smokeTexture,
    color: 0xFFF282,
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false // Prevent sorting issues with transparency
  })
  const smokeGroup = new THREE.Group()
  const smokeAngleIncrement: number = circleAngleInRadians / smokeInstances

  // Position smoke meshes evenly around the circle's edge
  for (let i = 0; i < smokeInstances; i++) {
    const angle: number = i * smokeAngleIncrement
    const smokeMesh: THREE.Mesh = new THREE.Mesh(ringGeometry, portalSmokeMaterial)
    const x: number = circleRadius * Math.cos(angle) + OFFSET_X
    const z: number = circleRadius * Math.sin(angle) + OFFSET_Z
    smokeMesh.position.set(x, 0.1, z)
    smokeMesh.rotation.x = quarterCircleAngleInRadians
    smokeMesh.scale.set(0.25, 0.25, 0.25)
    smokeGroup.add(smokeMesh)
  }
  scene.add(smokeGroup)

  // add lightning
  const lightningInstances: number = 8
  const lightningTexture = textureLoader.load('public/lightning.png')
  const portalLightningMaterial = new THREE.MeshBasicMaterial({
    map: lightningTexture,
    color: 0xFFF282,
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false // Prevent sorting issues with transparency
  })

  const lightningGroup = new THREE.Group()

  // Position lightning meshes evenly around the circle's edge
  for (let i = 0; i < lightningInstances; i++) {
    const lightningAngleIncrement: number = circleAngleInRadians / lightningInstances
    const angle: number = i * lightningAngleIncrement
    const depth: number = 0.15
    const x: number = (circleRadius - depth) * Math.cos(angle) + OFFSET_X
    const z: number = (circleRadius - depth) * Math.sin(angle) + OFFSET_Z
    const lightningMesh: THREE.Mesh = new THREE.Mesh(ringGeometry, portalLightningMaterial)
    lightningMesh.position.set(x, 0.1, z)
    lightningMesh.rotation.x = quarterCircleAngleInRadians
    lightningMesh.scale.set(0.45, 0.45, 0.45)
    lightningGroup.add(lightningMesh)
  }
  scene.add(lightningGroup)

  // add particles
  const randomHalfCircleAngle: number = Math.random() * Math.PI
  const yMax: number = 4

  function instantiateInteriorParticleMesh (): THREE.Mesh {
    const particleGeometry = new THREE.BoxGeometry(0.004, 0.004, 0.004)
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
    })
    const edges = new THREE.EdgesGeometry(particleGeometry)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xFFEC43
    })
    const particleMesh = new THREE.Mesh(particleGeometry, particleMaterial)
    particleMesh.add(new THREE.LineSegments(edges, lineMaterial))
    return particleMesh
  }

  interface Particle {
    mesh: THREE.Mesh
    maxPosY: number
    currPosY: number
    rotationSpeed: number
    rotationAngle: THREE.Vector2
  }
  function createInteriorParticle (particles: Particle[]): void {
    const angle: number = Math.random() * circleAngleInRadians
    const x: number = Math.random() * Math.cos(angle) * circleRadius + OFFSET_X
    const z: number = Math.random() * Math.sin(angle) * circleRadius + OFFSET_Z
    const particleMesh = instantiateInteriorParticleMesh()
    particleMesh.position.set(x, 0, z)
    particles.push({
      mesh: particleMesh,
      maxPosY: yMax * Math.random(),
      currPosY: 0.1,
      rotationSpeed: Math.random() * 0.016,
      rotationAngle: new THREE.Vector2(randomHalfCircleAngle, randomHalfCircleAngle)
    })
    scene.add(particleMesh)
  }

  // Interior particles
  const interiorBoxes: Particle[] = []

  let frameCounter: number = 0

  function updateOpacityAnimation (material: THREE.Material): void {
    const opacitySpeed: number = 0.01
    const minOpacity: number = 0.5
    const maxOpacity: number = 1.0
    const opacityRange: number = maxOpacity - minOpacity
    const opacityValue: number = minOpacity + opacityRange * (Math.sin(frameCounter * opacitySpeed) + 1) / 2
    material.opacity = opacityValue
  }

  function updateSmokeScaling (smokeMesh: THREE.Mesh, frameCounter: number): void {
    const smokeMinScale: number = 0.25
    const smokeMaxScale: number = 0.35
    const scalingSpeed: number = 0.005
    const scalingFactor: number = smokeMinScale + (smokeMaxScale - smokeMinScale) * (Math.sin(frameCounter * scalingSpeed) + 1) / 2
    smokeMesh.scale.set(scalingFactor, scalingFactor, scalingFactor)
  }

  function updateSmokeOpacity (smokeMesh: any): void {
    const smokeOpacitySpeed: number = 0.01
    const smokeMinOpacity: number = 0.2
    const smokeMaxOpacity: number = 0.8
    const smokeOpacityRange: number = smokeMaxOpacity - smokeMinOpacity
    const smokeOpacityValue: number = smokeMinOpacity + (smokeOpacityRange) * (Math.sin(frameCounter * smokeOpacitySpeed) + 1) / 2
    smokeMesh.material.opacity = smokeOpacityValue
  }

  function updateSmokeRotation (smokeMesh: THREE.Mesh): void {
    const smokeRotationSpeed: number = 0.004
    const randomValue: number = Math.random()
    randomValue < 0.3 ? smokeMesh.rotation.z -= smokeRotationSpeed : smokeMesh.rotation.z += smokeRotationSpeed
  }

  function updateSmokeAnimation (smokeGroup: any, frameCounter: number): void {
    smokeGroup.children.forEach(function (smokeMesh: THREE.Mesh) {
      updateSmokeRotation(smokeMesh)
      updateSmokeOpacity(smokeMesh)
      updateSmokeScaling(smokeMesh, frameCounter)
    })
  }

  // add lightning animation
  let lightningOpacityLoopCounter: number = 0

  function updateLightningOpacityLoop (): void {
    const lightningOpacityMax: number = 1
    const opacityDecayRate: number = 0.0019

    for (let i = 0; i < lightningGroup.children.length; i++) {
      const lightningMesh = lightningGroup.children[i] as THREE.Mesh
      const opacityValue: number = lightningOpacityMax - (lightningOpacityLoopCounter * opacityDecayRate)

      if (lightningMesh instanceof THREE.Mesh) {
        const material = lightningMesh.material as THREE.MeshStandardMaterial
        material.opacity = opacityValue
      }
    }
    lightningOpacityLoopCounter++
  }

  function calculateNumVisibleLightning (): number {
    const minVisibleLightning: number = 2
    const maxVisibleLightning: number = 5
    const visibleLightningRange: number = maxVisibleLightning - minVisibleLightning
    const numVisibleLightning: number = Math.floor(Math.random() * (visibleLightningRange + 1)) + minVisibleLightning
    return numVisibleLightning
  }

  function generateShuffledIndices (length: number): number[] {
    const indices = Array.from({ length }, function (_, i) {
      return i
    })

    const shuffledIndices = indices.sort(function () {
      return Math.random() - 0.5
    })

    return shuffledIndices
  }

  function setVisibleLightningIndices (lightningGroup: any, visibleIndices: number[]): void {
    for (let i = 0; i < lightningInstances; i++) {
      lightningGroup.children[i].visible = visibleIndices.includes(i)
    }
  }

  const startingPositions: THREE.Vector3[] = []

  lightningGroup.children.forEach(function (lightningMesh: THREE.Mesh) {
    startingPositions.push(lightningMesh.position.clone())
  })

  function resetLightningPositions (): void {
    lightningGroup.children.forEach(function (lightningMesh: THREE.Mesh, index: number) {
      lightningMesh.position.copy(startingPositions[index])
    })
  }

  function moveLightningMeshes (): void {
    const movementSpeed: number = 0.001
    const centerPosition: THREE.Vector3 = new THREE.Vector3(OFFSET_X, 0.1, OFFSET_Z)

    lightningGroup.children.forEach(function (lightningMesh: THREE.Mesh, index: number) {
      const isMovingToCenter = lightningMesh.visible
      const targetPosition = isMovingToCenter ? centerPosition : startingPositions[index]
      const direction = targetPosition.clone().sub(lightningMesh.position)
      const distanceToTarget = direction.length()

      if (distanceToTarget > movementSpeed) {
        direction.normalize().multiplyScalar(movementSpeed)
        lightningMesh.position.add(direction)
      }
    })
  }

  function updateVisibleLightning (frameCounter: number): void {
    const subsetDuration: number = 475

    if (frameCounter % subsetDuration === 0) {
      const numVisibleLightning = calculateNumVisibleLightning()
      const shuffledIndices = generateShuffledIndices(lightningInstances)
      const visibleIndices = shuffledIndices.slice(0, numVisibleLightning)
      setVisibleLightningIndices(lightningGroup, visibleIndices)
      resetLightningPositions()
      lightningOpacityLoopCounter = 0
    }

    moveLightningMeshes()
    updateLightningOpacityLoop()
  }

  function updateLightningAnimation (): void {
    updateLightningOpacityLoop()
    updateVisibleLightning(frameCounter)
  }

  // add circle edge animation
  function updatePortalEdgeAnimation (): void {
    const waveFrequency1: number = 2
    const waveFrequency2: number = 12
    const waveAmplitude1: number = 0.009
    const waveAmplitude2: number = 0.004
    const vertices = portalEdgeGeometry.attributes.position.array

    for (let i = 0; i <= circleSegments; i++) {
      const angle: number = (i / circleSegments) * circleAngleInRadians
      const vertexIndex: number = i * 3
      const originalY = circleVertices[i].y
      const waveOffset1: number = Math.sin(angle * waveFrequency1 + (frameCounter * 0.01)) * waveAmplitude1
      const waveOffset2: number = Math.cos(angle * waveFrequency2 + (frameCounter * 0.01)) * waveAmplitude2
      const combinedWaveOffset: number = waveOffset1 + waveOffset2
      vertices[vertexIndex + 1] = originalY - combinedWaveOffset
    }

    portalEdgeGeometry.attributes.position.needsUpdate = true
  }

  function instantiateEdgeParticleMesh (): THREE.Mesh {
    const particleGeometry = new THREE.BoxGeometry(0.03, 0.03, 0.03)
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
    })
    const edges = new THREE.EdgesGeometry(particleGeometry)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xFFEC43
    })
    const particleMesh = new THREE.Mesh(particleGeometry, particleMaterial)
    particleMesh.add(new THREE.LineSegments(edges, lineMaterial))
    return particleMesh
  }

  function createEdgeParticle (particles: Particle[]): void {
    const angle: number = Math.random() * circleAngleInRadians
    const x: number = Math.cos(angle) * circleRadius + OFFSET_X
    const z: number = Math.sin(angle) * circleRadius + OFFSET_Z
    const particleMesh = instantiateEdgeParticleMesh()
    particleMesh.position.set(x, 0, z)
    particles.push({
      mesh: particleMesh,
      maxPosY: yMax * Math.random(),
      currPosY: 0.1,
      rotationSpeed: Math.random() * 0.016,
      rotationAngle: new THREE.Vector2(randomHalfCircleAngle, randomHalfCircleAngle)
    })
    scene.add(particleMesh)
  }

  // Exterior particles
  const edgeBoxes: Particle[] = []

  // add box particle animation
  function updateBoxAnimation (): void {
    if (frameCounter % 30 === 0) {
      createEdgeParticle(edgeBoxes)
    }

    if (frameCounter % 2 === 0) {
      createInteriorParticle(interiorBoxes)
    }

    edgeBoxes.forEach(updateEdgeBox)
    interiorBoxes.forEach(updateInteriorBox)
  }

  function updateBoxScaleAndRotation (box: Particle): void {
    const scaleFactor: number = Math.max(0.02, (2 - box.currPosY / box.maxPosY * 4))
    box.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor)
    box.rotationAngle.addScalar(box.rotationSpeed)
    box.mesh.rotation.set(box.rotationAngle.x, 0, box.rotationAngle.y)
  }

  function updateBoxPosition (box: Particle): void {
    const angle: number = box.currPosY / box.maxPosY * Math.PI * 8
    const x: number = box.mesh.position.x + Math.cos(angle) * 0.0012
    const z: number = box.mesh.position.z + Math.sin(angle) * 0.0012
    box.mesh.position.set(x, box.currPosY, z)
  }

  function updateEdgeBox (box: Particle, index: number): void {
    box.currPosY += 0.002
    if (shouldRemoveBox(box)) {
      removeEdgeBox(box, index)
    } else {
      updateBoxScaleAndRotation(box)
      updateBoxPosition(box)
    }
  }

  function updateInteriorBox (box: Particle, index: number): void {
    box.currPosY += 0.002
    if (shouldRemoveBox(box)) {
      removeInteriorBox(box, index)
    } else {
      updateBoxScaleAndRotation(box)
      updateBoxPosition(box)
    }
  }

  function shouldRemoveBox (box: Particle): boolean {
    return box.mesh.scale.y <= 0.02
  }

  function removeEdgeBox (box: Particle, index: number): void {
    scene.remove(box.mesh)
    edgeBoxes.splice(index, 1)
  }

  function removeInteriorBox (box: Particle, index: number): void {
    scene.remove(box.mesh)
    interiorBoxes.splice(index, 1)
  }

  // combine all animation functions to one
  function portalAnimation (): void {
    updateOpacityAnimation(fillGradientMaterial)
    updateOpacityAnimation(fuzzyRingMaterial)
    updatePortalEdgeAnimation()
    updateBoxAnimation()
    updateSmokeAnimation(smokeGroup, frameCounter)
    updateLightningAnimation()
  }

  // setup overall scene animation
  function renderScene (): void {
    renderer.render(scene, camera)
  }

  function animate (): void {
    controls.update()
    portalAnimation()
    requestAnimationFrame(animate)
    renderScene()
    frameCounter++
  }

  animate()
}

import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { scene } from './sceneInitialize.js'

export function loadCharacterModel (): void {
  const characterLoader = new GLTFLoader()

  characterLoader.load(
    '../public/avatar.glb',
    characterTransformation,
    onProgress,
    onError
  )
}

function characterTransformation (glb: GLTF): void {
  console.log(glb)

  const root = glb.scene
  root.scale.set(0.95, 0.95, 0.95)
  root.position.set(-12.025, 0.1, -6.5)
  root.rotation.set(0, Math.PI, 0)

  makeMeshesReceiveShadows(root)

  scene.add(root)

  const loaderElement = document.querySelector('.loader')
  loaderElement?.classList.add('loader--hidden')
  loaderElement?.addEventListener('transitionend', () => {
    loaderElement.parentNode?.removeChild(loaderElement)
  })
}

function onProgress (xhr: any): void {
  const xhrTotal = 11280744
  const percentageLoaded = (xhr.loaded / xhrTotal) * 100
  const loaderText: any = document.querySelector('.loader-text')
  loaderText.textContent = `${Math.round(percentageLoaded)}%`
}

function onError (error: any): void {
  console.error('An error occurred:', error)
}

function makeMeshesReceiveShadows (root: any): void {
  root.traverse(function (object: THREE.Object3D) {
    if (object instanceof THREE.Mesh) {
      object.receiveShadow = true
    }
  })
}

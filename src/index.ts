import { scene, renderer, camera, controls } from '../dist/sceneInitialize.js'
import { setupScene } from '../dist/sceneSetup.js'
import { loadBuildingModel } from '../dist/building.js'
import { loadCharacterModel } from '../dist/character.js'
import { createPortal } from '../dist/portal.js'

setupScene(scene)
loadBuildingModel(scene)
loadCharacterModel()
createPortal(scene, camera, renderer, controls)

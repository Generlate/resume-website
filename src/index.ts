import { scene, renderer, camera, controls } from './sceneInitialize.js';
import { setupScene } from '../dist/sceneSetup.js';
import { loadBuildingModel } from '../dist/building.js';
import { loadCharacterModel } from '../dist/character.js';
import { createPortal } from '../dist/portal.js';

setupScene(scene);
loadBuildingModel(scene);
loadCharacterModel();
createPortal(scene, camera, renderer, controls);

// TODO: fix header appearing before loading screen
// TODO: page change animations
// TODO: fix broken environment on very skinny window
// TODO: move character to the right to center on text
// TODO: make cube animations use time instead of frames
// TODO: add character click animation
// TODO: make the projects work on the website instead of just linking to them
// TODO: add link symbol to generlate.com website link
// TODO: make shirt white
// TODO: move title to in the canvas (3D)
// TODO: test on different browsers
// TODO: clean up public folder

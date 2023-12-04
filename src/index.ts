import { scene, renderer, camera, controls } from './sceneInitialize.js';
import { setupScene } from '../dist/sceneSetup.js';
import { loadBuildingModel } from '../dist/building.js';
import { loadCharacterModel } from '../dist/character.js';
import { createPortal } from '../dist/portal.js';

setupScene(scene);
loadBuildingModel(scene);
loadCharacterModel();
createPortal(scene, camera, renderer, controls);

// TODO: make shirt white
// TODO: fix sub pages' mobile
// TODO: fix broken environment on very skinny window
// TODO: move character to the right to center on text
// TODO: transitions
// TODO: make transitions delayed
// TODO: add animations to hover/click
// TODO: better project descriptions (with code blocks?)
// TODO: make generlate.com default light theme
// TODO: network and add some social proof
// TODO: make cube animations use time instead of frames
// TODO: add easter eggs
// TODO: add character click animation
// TODO: make the projects work on the website instead of just linking to them
// TODO: add link symbol to generlate.com website link

import { scene, renderer, camera, controls } from './sceneInitialize.js';
import { setupScene } from '../dist/sceneSetup.js';
import { loadBuildingModel } from '../dist/building.js';
import { loadCharacterModel } from '../dist/character.js';
import { createPortal } from '../dist/portal.js';

setupScene(scene);
loadBuildingModel(scene);
loadCharacterModel();
createPortal(scene, camera, renderer, controls);

// TODO: fix sections overlapping canvas
// TODO: make generlate.com default light theme
// TODO: fix all the headers html
// TODO: incorporate react
// TODO: fix sub pages' mobile
// TODO: transitions
// TODO: make transitions delayed
// TODO: add animations to hover/click
// TODO: swap generlate icon with a home icon
// TODO: better project descriptions (with code blocks?)
// TODO: add easter eggs
// TODO: network and add some social proof
// TODO: add character click animation
// TODO: make the projects work on the website instead of just linking to them
// TODO: add link symbol to generlate.com website link

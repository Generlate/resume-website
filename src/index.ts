import { scene, renderer, camera, controls } from './sceneInitialize.js';
import { setupScene } from '../dist/sceneSetup.js';
import { loadBuildingModel } from '../dist/building.js';
import { loadCharacterModel } from '../dist/character.js';
import { createPortal } from '../dist/portal.js';

setupScene(scene);
loadBuildingModel(scene);
loadCharacterModel();
createPortal(scene, camera, renderer, controls);

// TODO: switch one of the architecture projects for resume website
// TODO: make projects descriptions like brittany Chiang's / add tech used.
// TODO: fix header hover colors + generlate icon not changing brightness
// TODO: fix header colors
// TODO: make generlate.com default light theme
// TODO: break down technologies section to programming languages, scripting languages, tools, design, etc. (look at brittany chiang v.3)
// TODO: minimize use of margin in favor of parent padding and gap with flexbox
// TODO: incorporate react
// TODO: fix subpages
// TODO: transitions
// TODO: make transitions delayed
// TODO: add animations to hover/click
// TODO: make subpages mobile-first
// TODO: add mongodb
// TODO: account for the video loading in the loader or compress video
// TODO: better project descriptions (with code blocks?)
// TODO: add easter eggs
// TODO: change icon to be different from generlate.com
// TODO: network and add some social proof
// TODO: add character click animation
// TODO: make the projects work on the website instead of just linking to them
// TODO: transitions
// TODO: slideshow arrows change color on hover
// TODO: slideshow arrow buttons should be same color as background and hover to different color
// TODO: add link symbol to generlate.com website link
// TODO: fix projects not showing on mobile

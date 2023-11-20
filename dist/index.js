import { scene, renderer, camera, controls } from './sceneInitialize.js';
import { setupScene } from '../dist/sceneSetup.js';
import { loadBuildingModel } from '../dist/building.js';
import { loadCharacterModel } from '../dist/character.js';
import { createPortal } from '../dist/portal.js';
setupScene(scene);
loadBuildingModel(scene);
loadCharacterModel();
createPortal(scene, camera, renderer, controls);
// TODO: make subpages mobile-first
// TODO: maybe change slideshow to smaller project boxes?
// TODO: Add an all projects page like Brittany Chiang's
// TODO: add technologies used for each project
// TODO: break down technologies section to programming languages, scripting languages, tools, design, etc. (look at brittany chiang v.3)
// TODO: tech icons color on hover
// TODO: make outer fillet = inner fillet + padding
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
//# sourceMappingURL=index.js.map
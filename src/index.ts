import { scene, renderer, camera, controls } from './sceneInitialize.js';
import { setupScene } from '../dist/sceneSetup.js';
import { loadBuildingModel } from '../dist/building.js';
import { loadCharacterModel } from '../dist/character.js';
import { createPortal } from '../dist/portal.js';

setupScene(scene);
loadBuildingModel(scene);
loadCharacterModel();
createPortal(scene, camera, renderer, controls);

// TODO: decide if hover should be dark or light
// TODO: make outer fillet = inner fillet + padding
// TODO: slideshow arrows change color on hover
// TODO: slideshow arrow buttons should be same color as background and hover to different color
// TODO: maybe section stroke changes on hover
// TODO: decide if i want to do media size flip or if text should scale with the browser window, add spacing between the sections on mobile
// TODO: fix instagram link
// TODO: fix Austen Cabret overlapping the header on scroll (mobile)
// TODO: add link symbol to generlate.com website link
// TODO: swap out technology names for icons that are greyed out and color on hover (links to the tech's site)
// TODO: socials turn the socials color on hover
// TODO: consider using inter font instead of roboto.. maybe, idk
// TODO: maybe do 'Front End Software Engineer' instead
// TODO: mess with the title's thickness
// TODO: fix projects not showing on mobile
// TODO: maybe change slideshow to smaller project boxes?
// TODO: Add an all projects page like Brittany Chiang's
// TODO: add technologies used for each project
// TODO: break down technologies section to programming languages, scripting languages, tools, design, etc. (look at brittany chiang v.3)
// TODO: add mongodb
// TODO: account for the video loading in the loader or compress video
// TODO: better project descriptions (with code blocks?)
// TODO: add easter eggs
// TODO: change icon to be different from generlate.com
// TODO: network and add some social proof
// TODO: add character click animation
// TODO: make the proects work on the website instead of just linking to them
// TODO: transitions

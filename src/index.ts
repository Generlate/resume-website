import { scene, renderer, camera, controls } from './sceneInitialize.js';
import { setupScene } from '../dist/sceneSetup.js';
import { loadBuildingModel } from '../dist/building.js';
import { loadCharacterModel } from '../dist/character.js';
import { createPortal } from '../dist/portal.js';

setupScene(scene);
loadBuildingModel(scene);
loadCharacterModel();
createPortal(scene, camera, renderer, controls);

// TODO: Add an all projects page like Brittany Chiang's
// TODO: remake in react
// TODO: maybe make the bullets into rounded rectangles (not a button)
// TODO: add spacing between the sections on mobile
// TODO: add link symbol to generlate.com website link
// TODO: make generlate.com change color and add underline on hover
// TODO: maybe make sections have bevel and no stroke
// TODO: add technologies used for each project
// TODO: make outer fillet = inner fillet + padding
// TODO: decide if hover should be dark or light
// TODO: maybe change slideshow to smaller project boxes?
// TODO: slideshow arrows change color on hover
// TODO: slideshow arrow buttons should be same color as background and hover to different color
// TODO: maybe section stroke changes on hover
// TODO: account for the video loading in the loader or compress video
// TODO: better project descriptions (with code blocks?)
// TODO: mess with the title's thickness
// TODO: decide if i want to do media size flip or if text should scale with the browser window
// TODO: add easter eggs
// TODO: change icon to be different from generlate.com
// TODO: fix instagram link
// TODO: fix projects not showing on mobile
// TODO: network and add some social proof
// TODO: add mongodb
// TODO: swap out technology names for icons that are greyed out and color on hover (links to the tech's site)
// TODO: socials turn the socials color on hover
// TODO: add character click animation
// TODO: break down technologies section to programming languages, scripting languages, tools, design, etc. (look at brittany chiang v.3)
// TODO: consider using inter font instead of roboto.. maybe, idk
// TODO: maybe do 'Front End Software Engineer' instead
// TODO: make the proects work on the website instead of just linking to them
// TODO: transitions

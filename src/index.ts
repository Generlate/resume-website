import { scene, renderer, camera, controls } from "./sceneInitialize.js";
import { setupScene } from "../dist/sceneSetup.js";
import { loadBuildingModel } from "../dist/building.js";
import { loadCharacterModel } from "../dist/character.js";
import { createPortal } from "../dist/portal.js";

setupScene(scene);
loadBuildingModel(scene);
loadCharacterModel();
createPortal(scene, camera, renderer, controls);

// TODO: fix project title descriptions on architecture sub page
// TODO: fix spacing from character to description section
// TODO: make work on ipad and large screens
// TODO: remove controls and add autoplay to home page videos on mobile
// TODO: consider using clamp() and minmax() in CSS
// TODO: try @media (orientation: landscape)
// TODO: page change animations
// TODO: fix broken environment on very skinny window / landscape mobile
// TODO: reduce building.glb size to reduce load time

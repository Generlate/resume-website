import { scene, renderer, camera, controls } from "./sceneInitialize.js";
import { setupScene } from "../dist/sceneSetup.js";
import { loadBuildingModel } from "../dist/building.js";
import { loadCharacterModel } from "../dist/character.js";
import { createPortal } from "../dist/portal.js";

setupScene(scene);
loadBuildingModel(scene);
loadCharacterModel();
createPortal(scene, camera, renderer, controls);

// TODO: for the home page, move 2d into the 3d scene (simplifies complex scaling)
// TODO: flip experience order in mobile
// TODO: consider using clamp() and minmax() in CSS
// TODO: try @media (orientation: landscape)
// TODO: make work on ipad and large screens
// TODO: fix broken environment on very skinny window / landscape mobile
// TODO: page change animations
// TODO: reduce building.glb size to reduce load time

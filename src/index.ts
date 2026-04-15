import { scene, renderer, camera, controls } from "./sceneInitialize.js";
import { setupScene } from "./sceneSetup.js";
import { loadBuildingModel } from "./building.js";
import { loadCharacterModel } from "./character.js";
import { createPortal } from "./portal.js";

setupScene(scene);
loadBuildingModel(scene);
loadCharacterModel();
createPortal(scene, camera, renderer, controls);

// TODO: rebuild with StyleX
// TODO: rebuild with next.js
// TODO: clean up css
// TODO: look in to using @media(prefers-color-scheme)
// TODO: speed up through following lighthouse suggestions
// TODO: consider using clamp() and minmax() in CSS
// TODO: try @media (orientation: landscape)
// TODO: page change animations (framer-motion)
// TODO: reduce building.glb size to reduce load time
// TODO: for the home page, move 2d into the 3d scene (simplifies complex scaling)
// TODO: fix broken environment on very skinny window / landscape mobile

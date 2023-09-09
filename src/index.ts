import { scene, renderer, camera, controls } from "./sceneInitialize.js";
import { setupScene } from "./sceneSetup.js";
import { loadBuildingModel } from "./building.js";
import { loadCharacterModel } from "./character.js";
import { createPortal } from "./portal.js";


setupScene(scene);
loadBuildingModel(scene);
loadCharacterModel();
createPortal(scene, camera, renderer, controls);

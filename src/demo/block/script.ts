import { AssetKey, BlockObject, BlockStates, Renderer, SkinObject, Skins } from "minerender";
import * as THREE from "three";

console.log("hi");

const renderer = new Renderer({
    camera: {
        near: 1,
        far: 2000,
        position: [50, 35, 50]
    },
    render: {
        stats: true,
        fpsLimit: 60,
        antialias: false
    },
    composer: {
        enabled: true
    },
    debug: {
        grid: true,
        axes: true
    }
});
document.body.appendChild(renderer.renderer.domElement);
window["renderer"] = renderer;

let blockObject: BlockObject;

setBlock("stone");

function setBlock(block: string) {
    console.log("setting block to", block)

    if (typeof blockObject !== "undefined") {
        blockObject.disposeAndRemoveAllChildren();
        renderer.scene.remove(blockObject);
        blockObject = undefined;
    }

    BlockStates.get(AssetKey.parse("blockstates", block)).then(blockState => {
        return renderer.scene.addBlock(blockState);
    }).then(blockObject_ => {
        blockObject = blockObject_ as BlockObject; //TODO
    });
}

window["setBlock"] = setBlock;


//TODO: include this in renderer constructor
// @ts-ignore meh.
const controls = new THREE.OrbitControls(renderer.camera, renderer.renderer.domElement);
controls.update();

//TODO: autostart option, maybe
renderer.start();

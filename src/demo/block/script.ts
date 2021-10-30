import { AssetKey, BlockObject, BlockStates, Renderer, SceneInspector, SkinObject, Skins } from "minerender";
import * as THREE from "three";
import { GUI } from "dat.gui";
import { Intersection, Vector3 } from "three";

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

const sceneInspector = new SceneInspector(renderer);
sceneInspector.appendTo(document.getElementById('inspector'));

let blockObject: BlockObject;

setBlock("stone");
loadGUI()

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

        // dummy intersection
        const intersection: Intersection ={
            object: blockObject,
            distance: 0,
            point: new Vector3(),
            instanceId: blockObject.isInstanced ? blockObject.instanceCounter : undefined
        }
        sceneInspector.selectObject(blockObject, intersection)
    });
}

window["setBlock"] = setBlock;


function loadGUI() {
    const gui = new GUI()

    {
        const blockFolder = gui.addFolder("Block");
        blockFolder.open();
        {
            const blockProps = {
                state: "stone"
            };

            const stateControls = blockFolder.add(blockProps, 'state');
            stateControls.onFinishChange(v=>{
                setBlock(v);
            })
        }

    }

}


//TODO: include this in renderer constructor
// @ts-ignore meh.
const controls = new THREE.OrbitControls(renderer.camera, renderer.renderer.domElement);
controls.update();

//TODO: autostart option, maybe
renderer.start();

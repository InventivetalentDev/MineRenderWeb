import { AssetKey, AssetLoader, BatchedExecutor, BlockObject, BlockStates, MineRenderWorld, Renderer, SceneInspector, SkinObject, Skins, StructureParser } from "minerender";
import 'three/examples/js/controls/OrbitControls';

console.log("hi");

const renderer = new Renderer({
    camera: {
        near: 1,
        far: 2000,
        position: [550, 400, 550]
    },
    render: {
        stats: true,
        fpsLimit: 60,
        antialias: true
    },
    composer: {
        enabled: false
    },
    debug: {
        grid: true,
        axes: true
    }
});
// document.body.appendChild(renderer.renderer.domElement);
window["renderer"] = renderer;

const sceneInspector = new SceneInspector(renderer);
sceneInspector.appendTo(document.getElementById('inspector'));


let world = new MineRenderWorld(renderer.scene);
window["world"] = world;

setTimeout(()=>{
    setStructure("end_city/ship")
},10)

async function setStructure(structureName: string) {
    structureInput.disabled = true;
    console.log("setting structure to", structureName);

    await world.clear();

   try{
       const structureAsset = new AssetKey("minecraft", structureName, "structures", undefined, "data", ".nbt");

       const asset = await AssetLoader.loadOrRetryWithDefaults(structureAsset, AssetLoader.NBT);
       console.log(asset);

       const structure = await StructureParser.parse(asset);
       console.log(structure)

       await world.placeMultiBlock(structure, true, new BatchedExecutor(1, 32));
       console.log("done placing structure!")

       structureInput.disabled = false;
   }catch (e){
       console.error(e);
       structureInput.disabled = false;
   }
}


window["setStructure"] = setStructure;

const structureInput = document.getElementById("structure-input") as HTMLInputElement;
structureInput.addEventListener("change", () => {
    setStructure(structureInput.value);
});
const structureSuggestions = document.getElementById("structure-suggestions") as HTMLDataListElement;
setTimeout(() => {
    fetch(AssetLoader.ROOT + "/data/minecraft/structures/_list.json").then(res => res.json()).then(rootList => {
        console.log(rootList)
        rootList["directories"].forEach(dir => {
            fetch(AssetLoader.ROOT + "/data/minecraft/structures/" + dir + "/_list.json").then(res => res.json()).then(list => {
                console.log(list)
                list["files"].forEach(file => {
                    const option = document.createElement("option");
                    option.value = dir + "/" + file.replace("\.nbt", "");
                    structureSuggestions.appendChild(option);
                });
            }).catch(err => console.error(err))
        })
    }).catch(err => console.error(err))
}, 10)


//TODO: include this in renderer constructor
// @ts-ignore meh.
const controls = new THREE.OrbitControls(renderer.camera, renderer.renderer.domElement);
renderer.registerEventDispatcher(controls);
controls.update();



//TODO: autostart option, maybe
renderer.start();

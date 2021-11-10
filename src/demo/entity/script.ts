import { AssetKey, BasicAssetKey, BlockStates, Entities, EntityObject, Renderer, SceneInspector, SkinObject, Skins } from "minerender";
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

let entityObject: EntityObject;

setEntity("pig");

function setEntity(entity: string) {
    console.log("setting entity to", entity);

    if (typeof entityObject !== "undefined") {
        entityObject.removeFromScene();
        entityObject.disposeAndRemoveAllChildren();
        renderer.scene.remove(entityObject);
        entityObject = undefined;
    }

    //TODO: block entity
    Entities.getEntity(AssetKey.parse("entities", entity)).then(entityModel=>{
        return renderer.scene.addEntity(entityModel);
    }).then(entityObject_=>{
        entityObject = entityObject_ as EntityObject;//TODO
        window["entity"] = entityObject;

        // dummy intersection
        const intersection: Intersection = {
            object: entityObject,
            distance: 0,
            point: new Vector3(),
            instanceId: entityObject.isInstanced ? entityObject.instanceCounter : undefined
        }
        sceneInspector.selectObject(entityObject, intersection)
    })
}

window["setEntity"] = setEntity;

const entityInput = document.getElementById("entity-input") as HTMLInputElement;
entityInput.addEventListener("change", () => {
    setEntity(entityInput.value);
})
const entitySuggestions = document.getElementById("entity-suggestions") as HTMLDataListElement;
//TODO: block entities
Entities.getEntityList().then(list => {
    list.forEach(l => {
        const option = document.createElement("option");
        option.value = l;
        entitySuggestions.appendChild(option);
    })
})


//TODO: include this in renderer constructor
// @ts-ignore meh.
const controls = new THREE.OrbitControls(renderer.camera, renderer.renderer.domElement);
controls.update();

//TODO: autostart option, maybe
renderer.start();

import { Renderer, SceneInspector, SkinObject, Skins } from "minerender";
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

let skinObject: SkinObject;

renderer.scene.addSkin().then(skinObject_ => {
    skinObject = skinObject_;
    window["skin"] = skinObject_;

    setSkin("inventivetalent");

    loadGUI();

    // dummy intersection
    const intersection: Intersection ={
        object: skinObject_,
        distance: 0,
        point: new Vector3(),
        instanceId: skinObject_.isInstanced ? skinObject_.instanceCounter : undefined
    }
    sceneInspector.selectObject(skinObject_, intersection)
});

function setSkin(skin: string) {
    console.log("setting skin to", skin)
    Skins.fromUsername(skin).then(skin => {
        console.log(skin);
        if (typeof skin !== "undefined") {
            skinObject.setSkinTexture(skin)
        }
    })
}

window["setSkin"] = setSkin;

function loadGUI() {
    const gui = new GUI()

    {
        const textureFolder = gui.addFolder("Textures");
        textureFolder.open();
        {
            const skinProps = {
                user: "inventivetalent",
                url: ""
            };

            const userController = textureFolder.add(skinProps, 'user');
            userController.setValue('inventivetalent');
            userController.onChange(v => {
                if (v.length > 0) {
                    setSkin(v);
                }
            });

            const urlController = textureFolder.add(skinProps, 'url');
            urlController.onChange(v => {
                if (v.length > 0) {
                    skinObject.setSkinTexture(v);
                }
            });
        }

        // const positionFolder = gui.addFolder("Position");
        // {
        //     positionFolder.add(skinObject.position, 'x', -100, 100, 1);
        //     positionFolder.add(skinObject.position, 'y', -100, 100, 1);
        //     positionFolder.add(skinObject.position, 'z', -100, 100, 1);
        // }
    }

}





//TODO: include this in renderer constructor
// @ts-ignore meh.
const controls = new THREE.OrbitControls(renderer.camera, renderer.renderer.domElement);
controls.update();

//TODO: autostart option, maybe
renderer.start();

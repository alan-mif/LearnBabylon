import { Base } from "./Base";

export class Raycaster extends Base {

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 初始化
     */
    protected _init(): void {

        super._init();

        const { engine, scene } = this;

        const box: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box', {});
        box.position.y = 1;
        box.material = new BABYLON.StandardMaterial('', scene);

        engine.runRenderLoop((): void => scene.render());
        
        this._listener.addClick(this._click.bind(this));

    }

    /**
     * 点击执行
     * @param event 鼠标事件
     */
    private _click(): void {

        const scene: BABYLON.Scene = this.scene,
            pickResult: BABYLON.PickingInfo = scene.pick(scene.pointerX, scene.pointerY);

        if (pickResult.pickedMesh) {

            const material: BABYLON.StandardMaterial = pickResult.pickedMesh.material as BABYLON.StandardMaterial;
            if (material) material.diffuseColor = new BABYLON.Color3(1, 0, 1);

        }

    }

}
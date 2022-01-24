import { Base } from "./Base";

export class ShootingGame extends Base {

    public ray: BABYLON.Ray;
    public helper: BABYLON.RayHelper;

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

        this._createSkybox("./textures/cube/box");
        this.ground.isPickable = false;
        this.ground.material.alpha = 0;

        const box: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box', {});
        box.position.y = 2;
        box.material = new BABYLON.StandardMaterial('', scene);
        box.isPickable = false;

        for (let i = 0; i < 3; i++) {

            const target: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box', {});
            target.position.x = 3 * i * Math.random();
            target.position.y = 5 * i * Math.random();
            target.position.z = 1 * i * Math.random();
            target.material = new BABYLON.StandardMaterial('', scene);

            this.meshes.push({
                content: target,
                size: { height: 1, width: 1, depth: 1 },
                direction: new BABYLON.Vector3(Math.random(), Math.random(), Math.random())
            });

        }

        this.ray = new BABYLON.Ray(box.position, new BABYLON.Vector3(1, 0, 0), 25);
        this.helper = new BABYLON.RayHelper(this.ray);
        this.helper.show(scene, new BABYLON.Color3(0.1, 0.8, 0.32));
        setTimeout((): void => {
        }, 2000);
        engine.runRenderLoop((): void => scene.render());

    }

    /**
     * 事件监听
     */
    protected _listen(): void {

        super._listen();

        this.canvas.addEventListener('click', this._click());

    }

    /**
     * 点击执行
     */
    private _click(): () => void {

        return (): void => {

            const hit = this.scene.pickWithRay(this.ray);
            console.log(hit);

        }

    }

}
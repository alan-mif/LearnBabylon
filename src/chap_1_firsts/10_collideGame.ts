import { Base } from "./Base";

export class CollideGame extends Base {

    /** 主角 */
    public protagonist: BABYLON.Mesh;

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

        const { engine, scene, canvas } = this;

        this._createSkybox("./textures/cube/box");
        this.skybox.isPickable = false;
        this.ground.isPickable = false;
        this.camera.dispose();
        this.camera = new BABYLON.UniversalCamera("", new BABYLON.Vector3(), scene);
        this.camera.position.y = 2;
        this.camera.attachControl(canvas, true); // 相机绑定控制

        this.protagonist = BABYLON.MeshBuilder.CreateBox('box', {});

        engine.runRenderLoop((): void => {

            scene.render();

        });

        this._listener.addHover(this._touchMove.bind(this));

    }

    /**
     * 更新相机位置
     */
    private _updateCameraPosition(): void {

    }

    /**
     * 滑动执行
     */
    private _touchMove(): void {
        console.log("在摸啦~");
    }
}
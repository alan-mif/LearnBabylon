import { Base } from "./Base";
import { HoverEvent } from "./Listener";

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

        const { engine, scene } = this;

        this._createSkybox("./textures/cube/box");
        this.skybox.isPickable = false;
        this.ground.isPickable = false;
        this.camera.dispose();
        this.camera = new BABYLON.UniversalCamera("", new BABYLON.Vector3(0, 2, 0), scene);

        this.protagonist = BABYLON.MeshBuilder.CreateBox('box', {});

        engine.runRenderLoop((): void => {

            scene.render();

        });

        this._listener.addHover(this._touchMove.bind(this));

    }

    /**
     * 更新相机位置
     * @param x x 坐标
     * @param y y 坐标
     * @param z z 坐标
     */
    private _updateCameraPosition(x: number, y: number, z: number): void {
        this.camera.position.x += x;
        this.camera.position.y += y;
        this.camera.position.z += z;
    }

    /**
     * 滑动执行
     * @param event
     */
    private _touchMove(event: HoverEvent): void {
        this._updateCameraPosition(event.topOffset, 0, event.leftOffset);
    }
}
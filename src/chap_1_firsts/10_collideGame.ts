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
        this.camera = new BABYLON.UniversalCamera("", new BABYLON.Vector3(0, 10, 0), scene);
        console.log(this.camera);

        const material = new BABYLON.StandardMaterial('', this.scene);
        material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.protagonist = BABYLON.MeshBuilder.CreateBox('box', {});
        this.protagonist.material = material;
        this.camera.target = this.protagonist.position;
        this._makeObstacle();

        engine.runRenderLoop((): void => {

            scene.render();

        });

        this._listener.addHover(this._touchMove.bind(this));

    }

    /**
     * 制作障碍物
     */
    private _makeObstacle() {

        for (let i = 0; i < 30; i++) {

            const target: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('obstacle' + i, {});
            target.position.x = i * Math.random() * 2;
            target.position.z = -i * Math.random() * 2;

            this.meshes.push({
                content: target,
                size: { height: 1, width: 1, depth: 1 },
                direction: new BABYLON.Vector3(0, 0, 0)
            });

        }

    }

    /**
     * 更新主角位置
     */
    private _updateProtagonist() {

        const position = this.camera.position;
        this.protagonist.position.x = position.x;
        this.protagonist.position.z = position.z;

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
        this._updateCameraPosition(event.topOffset / 100, 0, -event.leftOffset / 100);
        this._updateProtagonist();
    }
}
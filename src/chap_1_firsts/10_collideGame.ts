import { Base } from "./Base";
import { HoverEvent } from "./Listener";

export class CollideGame extends Base {

    /** 主角 */
    public protagonist: BABYLON.Mesh;

    /** x 限制 */
    private _limitX: boolean;
    /** y 限制 */
    private _limitY: Boolean;
    /** z 限制 */
    private _limitZ: boolean;

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
        this.camera = new BABYLON.UniversalCamera("", new BABYLON.Vector3(0, 6, -20), scene);

        const material = new BABYLON.StandardMaterial('', this.scene);
        material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.protagonist = BABYLON.MeshBuilder.CreateBox('box', {});
        this.protagonist.material = material;
        this.protagonist.position.z = 10;
        this.camera.setTarget(new BABYLON.Vector3(0, -0.0001, 0));
        this._makeObstacle();

        engine.runRenderLoop((): void => {

            scene.render();

        });

        this._listener.addHover(this._touchMove.bind(this));

    }

    /**
     * 制作障碍物
     */
    private _makeObstacle(): void {

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
     * 碰撞检测
     */
    private _collisionCheck(x: number, y: number, z: number): void {

        const protagonist = this.protagonist;

        protagonist.position.x += x;
        protagonist.position.y += y;
        protagonist.position.z += z;

        for (let i = 0; i < this.meshes.length; i++)  if (protagonist.intersectsMesh(this.meshes[i].content, false)) this._limitX = true;

        for (let i = 0; i < this.meshes.length; i++)  if (protagonist.intersectsMesh(this.meshes[i].content, false)) this._limitY = true;

        for (let i = 0; i < this.meshes.length; i++)  if (protagonist.intersectsMesh(this.meshes[i].content, false)) this._limitZ = true;

        protagonist.position.x -= x;
        protagonist.position.y -= y;
        protagonist.position.z -= z;

    }

    /**
     * 更新主角位置
     * @param x x 坐标
     * @param y y 坐标
     * @param z z 坐标
     */
    private _updateProtagonist(x: number, y: number, z: number): void {

        this._collisionCheck(x, y, z);

        if (!this._limitX) {
            this.camera.position.x += x, this.protagonist.position.x += x;
        }

        if (!this._limitY) {
            this.camera.position.y += y, this.protagonist.position.y += y;
        }

        if (!this._limitZ) {
            this.camera.position.z += z, this.protagonist.position.z += z;
        }

        this._limitX = this._limitY = this._limitZ = false;

    }

    /**
     * 滑动执行
     * @param event
     */
    private _touchMove(event: HoverEvent): void {
        this._updateProtagonist(event.topOffset / 100, 0, -event.leftOffset / 100);
    }
}
import { Base } from "./Base";
import { HoverEvent } from "./Listener";

export class CollideGame extends Base {

    /** 主角 */
    public protagonist: BABYLON.Mesh;

    /** x+ 限制 */
    private _limitX: boolean;
    /** y+ 限制 */
    private _limitY: Boolean;
    /** z+ 限制 */
    private _limitZ: boolean;
    /** x- 限制 */
    private _limitXN: boolean;
    /** y- 限制 */
    private _limitYN: Boolean;
    /** z- 限制 */
    private _limitZN: boolean;
    /** 碰撞物体 */
    private _collideMeshes: BABYLON.Mesh[] = [];

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

    private _isContain(id: string) {

        for (let i = 0; i < this._collideMeshes.length; i++) {

            if (this._collideMeshes[i].id === id) {
                return true;
            }

        }

        return false;

    }

    /**
     * 碰撞检测
     */
    private _collisionCheck(x: number, y: number, z: number): void {

        const protagonist: BABYLON.Mesh = this.protagonist;

        protagonist.position.x += x;

        for (let i = 0; i < this.meshes.length; i++) {

            const mesh: BABYLON.Mesh = this.meshes[i].content;

            if (this._isContain(mesh.id)) continue;

            if (protagonist.intersectsMesh(mesh, false)) {

                if (x > 0) {
                    this._limitX = true;
                } else {
                    this._limitXN = true;
                }

                mesh.checkCollisions = true;
                this._collideMeshes.push(mesh);

            }

        }

        protagonist.position.x -= x;
        protagonist.position.z += z;

        for (let i = 0; i < this.meshes.length; i++) {

            const mesh: BABYLON.Mesh = this.meshes[i].content;

            if (this._isContain(mesh.id) && !mesh.checkCollisions) continue;

            if (protagonist.intersectsMesh(mesh, false)) {

                if (z > 0) {
                    this._limitZ = true;
                } else {
                    this._limitZN = true;
                }

                if (!this._isContain(mesh.id)) this._collideMeshes.push(mesh);

            }

        }

        protagonist.position.x += x;

        let flag: boolean = false;

        for (let i = 0; i < this.meshes.length; i++) {

            const mesh: BABYLON.Mesh = this.meshes[i].content;

            if (this._isContain(mesh.id) && !mesh.checkCollisions) continue;

            if (protagonist.intersectsMesh(mesh, false)) {

                flag = true;
                if (!this._isContain(mesh.id)) this._collideMeshes.push(mesh);

            }

        }

        if (flag) {

            if (!this._limitX && !this._limitXN! && !this._limitZ && !this._limitZN) {

                if (z > 0) {
                    this._limitZ = true;
                } else {
                    this._limitZN = true;
                }

            }

        }

        protagonist.position.x -= x;
        protagonist.position.z -= z;

        for (let i = 0; i < this._collideMeshes.length; i++) {
            this._collideMeshes[i].checkCollisions = false;
        }

    }

    /**
     * 分离检查
     */
    private _separateCheck(): void {

        let flag: boolean = false;

        for (let i = this._collideMeshes.length - 1; i > -1; i--) {

            if (this.protagonist.intersectsMesh(this._collideMeshes[i], false)) {
                flag = true;
            } else {
                this._collideMeshes.pop();
            }

        }

        if (!flag) {
            this._limitX = this._limitXN = this._limitY = this._limitYN = this._limitZ = this._limitZN = false;
        }

    }

    /**
     * 更新主角位置
     * @param x x 坐标
     * @param y y 坐标
     * @param z z 坐标
     */
    private _updateProtagonist(x: number, y: number, z: number): void {

        this._collisionCheck(x, y, z);

        if ((!this._limitX && x > 0) || (!this._limitXN && x < 0)) {
            this.camera.position.x += x, this.protagonist.position.x += x;
        }

        if ((!this._limitY && y > 0) || (!this._limitYN && y < 0)) {
            this.camera.position.y += y, this.protagonist.position.y += y;
        }

        if ((!this._limitZ && z > 0) || (!this._limitZN && z < 0)) {
            this.camera.position.z += z, this.protagonist.position.z += z;
        }

        this._separateCheck();

    }

    /**
     * 滑动执行
     * @param event
     */
    private _touchMove(event: HoverEvent): void {
        this._updateProtagonist(event.topOffset / 100, 0, -event.leftOffset / 100);
    }
}
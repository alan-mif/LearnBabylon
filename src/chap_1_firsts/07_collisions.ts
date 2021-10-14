interface Size {
    height: number;
    width: number;
    depth: number;
}

interface Mesh {
    content: BABYLON.Mesh;
    size: Size;
}

export class Collisions {

    /** 引擎 */
    public engine: BABYLON.Engine;
    /** 场景 */
    public scene: BABYLON.Scene;
    /** 相机 */
    public camera: BABYLON.ArcRotateCamera;
    /** 物体集合 */
    public meshes: Array<Mesh> = [];
    /** 地板 */
    public ground: BABYLON.Mesh;
    /** 重力 */
    public gravity: BABYLON.Vector3;

    /** 时间 */
    private _time: number = 0;
    /** 精度 */
    private _precision: number = 0.01;

    /**
     * 构造函数
     */
    public constructor() {
        this._init();
    }

    /**
     * 物体由于重力影响是否相交
     * @param mesh 
     * @param mesh2 
     * @returns 
     */
    private _intersectsMeshByG(mesh: Mesh, mesh2: Mesh) {
        return mesh.content.position.y - mesh.size.height / 2 < mesh2.content.position.y + mesh2.size.height / 2 ? true : false;
    }

    /**
     * 初始化
     */
    private _init() {

        const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 0), this.scene);

        this.camera.attachControl(canvas, true); // 相机绑定控制
        new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene); // 添加半球光用来模拟环境光

        // 创建 box 并给定高度
        const box: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box', { height: 1, width: 1, depth: 1 }, this.scene);
        box.position.y = 40;
        // 创建 box2 并给定高度
        const box2: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box2', { height: 1, width: 2, depth: 2 }, this.scene);
        box2.position.y = 1 / 2;
        this.meshes.push(
            { content: box, size: { height: 1, width: 1, depth: 1 } },
            { content: box2, size: { height: 1, width: 2, depth: 2 } }
        );

        // 创建 ground 并给定高度
        this.ground = BABYLON.MeshBuilder.CreateGround("myGround", { width: 6, height: 4, subdivisions: 4 }, this.scene);

        this.gravity = new BABYLON.Vector3(0, -9.81, 0); // 定义重力（方向和大小）

        this.engine.runRenderLoop(() => {

            this._time = this._time === 0 ? new Date().getTime() : this._time;

            const time: number = new Date().getTime(),
                totalTime: number = time - this._time,
                distance: number = 1 / 2 * this.gravity.y * Math.pow(totalTime / 1000, 2);

            // box.position.y += distance / 10; // 将物体下落的距离应用到该物体上,为了我们能够更加方便的观察物体下落过程，把它的速度变慢一些，当然这在实际应用中是不必要的。
            // if (box.position.y < 1 / 2) box.position.y = 1 / 2;

            for (let i = this._precision; i < -distance && !this._intersectsMeshByG(this.meshes[0], this.meshes[1]); i += this._precision) box.position.y -= this._precision;

            this.scene.render();

        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

    }

}

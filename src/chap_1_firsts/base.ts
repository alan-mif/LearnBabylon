export interface Size {
    height: number;
    width: number;
    depth: number;
}

export interface Mesh {
    content: BABYLON.Mesh;
    size: Size;
    direction: BABYLON.Vector3;
}

export class Base {

    /** 画布 */
    public canvas: HTMLCanvasElement;
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

    /**
     * 构造函数
     */
    public constructor() {

        this._init();
        this._listen();

    }

    /**
     * 初始化
     */
    protected _init(): void {

        this.canvas = document.querySelector('canvas.webgl');
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;

        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 0), this.scene);
        this.ground = BABYLON.MeshBuilder.CreateGround("myGround", { width: 60, height: 60, subdivisions: 4 }, this.scene);

        const groundMaterial = new BABYLON.StandardMaterial("material", this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        this.ground.material = groundMaterial;

        this.camera.attachControl(this.canvas, true); // 相机绑定控制
        new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene); // 添加半球光用来模拟环境光

    }

    /**
     * 事件监听
     */
    protected _listen(): void {
        window.addEventListener('resize', (): void => this.engine.resize());
    }

}
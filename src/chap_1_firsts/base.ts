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

export interface Sprite {
    content: BABYLON.Sprite;
    time: number;
    velocity: BABYLON.Vector3;
    isStop: boolean;
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
    /** 精灵集合 */
    public sprites: Array<Sprite> = [];
    /** 地板 */
    public ground: BABYLON.Mesh;

    /** 当前时间 */
    protected _currentTime: number = new Date().getTime();
    /** 开始时间 */
    protected _startTime: number = new Date().getTime();

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
        this.ground = BABYLON.MeshBuilder.CreateGround("myGround", { width: 50, height: 50, subdivisions: 4 });

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

    /**
     * 创建天空盒
     * @param src 资源路径
     */
    protected _createSkybox(src: string) {

        const skyBox = BABYLON.MeshBuilder.CreateBox("skyBox", {
            size: 2000.0
        }, this.scene),
            skyBoxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);

        skyBoxMaterial.backFaceCulling = false;
        skyBoxMaterial.reflectionTexture = new BABYLON.CubeTexture(src, this.scene);
        skyBoxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyBoxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyBoxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyBox.material = skyBoxMaterial;

    }

}
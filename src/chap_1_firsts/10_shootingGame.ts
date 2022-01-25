import { Base } from "./Base";

export class ShootingGame extends Base {

    /** 射线 */
    public ray: BABYLON.Ray;
    /** 射线辅助体 */
    public helper: BABYLON.RayHelper;
    /** 主角 */
    public protagonist: BABYLON.AbstractMesh;

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
        this._initTargets();
        this.ground.isPickable = false;
        this.ground.material.alpha = 0;

        let protagonist: BABYLON.AbstractMesh;

        BABYLON.SceneLoader.ImportMesh('', './model/', 'skull.babylon', scene, (target: BABYLON.AbstractMesh[]) => {

            protagonist = target[0];
            protagonist.scaling = protagonist.scaling.scale(0.05);
            protagonist.position = new BABYLON.Vector3();
            protagonist.material = new BABYLON.StandardMaterial("myMaterial", scene);
            protagonist.isPickable = false;

            this.protagonist = protagonist;
            this.ray = new BABYLON.Ray(protagonist.position, new BABYLON.Vector3(0, 0, -1), 25);
            this.helper = new BABYLON.RayHelper(this.ray);

        });

        engine.runRenderLoop((): void => scene.render());

    }

    /**
     * 事件监听
     */
    protected _listen(): void {

        super._listen();

        this.canvas.addEventListener('click', this._click.bind(this));

    }

    /**
     * 初始化目标
     */
    private _initTargets() {

        const target: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box', {});
        target.position.x = 5 * Math.random() * 0.5;
        target.position.y = 1 * Math.random() * 0.5;
        target.position.z = -5 * Math.random() * 0.5;

        for (let i = 1; i < 30; i++) {

            const target1 = target.clone();
            target1.position.x = i * Math.random();
            target1.position.y = i * Math.random();
            target1.position.z = -i * Math.random();
            target1.material = new BABYLON.StandardMaterial('', this.scene);

            this.meshes.push({
                content: target,
                size: { height: 1, width: 1, depth: 1 },
                direction: new BABYLON.Vector3(Math.random(), Math.random(), Math.random())
            });

        }

    }

    /**
     * 点击执行
     */
    private _click(): void {

        const hit = this.scene.pickWithRay(this.ray);

        this.helper.show(this.scene, new BABYLON.Color3(0.1, 0.8, 0.32));

        setTimeout((): void => this.helper.hide(), 1000);

        console.log(hit);

    }

}
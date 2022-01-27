import { Base } from "./Base";

export class ShootingGame extends Base {

    /** 射线 */
    private _ray: BABYLON.Ray;
    /** 射线辅助体 */
    private _helper: BABYLON.RayHelper;
    /** 主角 */
    private _protagonist: BABYLON.AbstractMesh;
    /** */
    private _direction: BABYLON.Vector3;

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

            this._protagonist = protagonist;
        });

        engine.runRenderLoop((): void => scene.render());

        this._listener.addClick(this._click.bind(this));
        this._listener.addHover(this._hover.bind(this));

    }

    /**
     * 初始化目标
     */
    private _initTargets(): void {

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

        !!this._helper && this._helper.dispose();

        const protagonist = this._protagonist,
            m = protagonist.getWorldMatrix(),
            v = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, -1), m),
            direction = v.subtract(protagonist.position);

        this._direction = BABYLON.Vector3.Normalize(direction);
        this._ray = new BABYLON.Ray(protagonist.position, this._direction, 25);
        this._helper = new BABYLON.RayHelper(this._ray);
        this._helper.show(this.scene, new BABYLON.Color3(0.1, 0.8, 0.32));
        
        setTimeout((): void => this._helper.hide(), 1000);

        const hit = this.scene.pickWithRay(this._ray);
        console.log(hit);

    }

    /**
     * 滑动执行
     */
    private _hover(): void {

        const lastX = this._listener.lastHoverP.x,
            lastY = this._listener.lastHoverP.y,
            currentX = this._listener.currentHoverP.x,
            currentY = this._listener.currentHoverP.y,
            protagonist = this._protagonist;

        if (!!protagonist) {

            protagonist.rotation.x += (currentY - lastY) / 20;
            protagonist.rotation.y += (currentX - lastX) / 20;

        }

    }

}
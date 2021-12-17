import { Mesh, Base } from "./base";

export class SkullGame extends Base {

    /** 骷髅 */
    private _skull: BABYLON.AbstractMesh;
    /** 上次位置 */
    private _lastPosition: BABYLON.Vector3;
    /** 分数 */
    private _score: number = 0;
    /** 是否结束 */
    private _isOver: boolean = false;
    /** 是否开始 */
    private _isStart: boolean = false;
    /** 小球是否移动 */
    private _isSphereMove: boolean = false;

    /**
     * 构造函数
     */
    public constructor() {

        super();

        this._init();
        this._init2();

    }

    /**
     * 键盘落下监听
     * @param event 
     */
    private _keyDown = (event: KeyboardEvent) => {

        const skull = this._skull;

        switch (event.key) {

            case "Enter":

                if (!this._isStart) this._isSphereMove = this._isStart = true;

                break;

            case "w":

                this._lastPosition = skull.position.clone();
                if (skull.position.z < 10) skull.position.z += 0.5;

                break;

            case "s":

                this._lastPosition = skull.position.clone();
                if (skull.position.z > -10) skull.position.z -= 0.5;

                break;

            case "a":

                this._lastPosition = skull.position.clone();
                if (skull.position.x > -10) skull.position.x -= 0.5;

                break;

            case "d":

                this._lastPosition = skull.position.clone();
                if (skull.position.x < 10) skull.position.x += 0.5;

                break;
            case "q":

                this._lastPosition = skull.position.clone();
                if (skull.position.y > -10) skull.position.y -= 0.5;

                break;

            case "e":

                this._lastPosition = skull.position.clone();
                if (skull.position.y < 10) skull.position.y += 0.5;

                break;

            default:

                break;

        }

    }

    /**
     * 初始化
     */
    protected _init() {

        super._init();

        const { engine, scene } = this;

        const skyBox = BABYLON.MeshBuilder.CreateBox("skyBox", {
            size: 2000.0
        }, scene),
            skyBoxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

        skyBoxMaterial.backFaceCulling = false;
        skyBoxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/cube/box", scene);
        skyBoxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyBoxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyBoxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyBox.material = skyBoxMaterial;

        let skull: BABYLON.AbstractMesh;

        BABYLON.SceneLoader.ImportMesh('', './model/', 'skull.babylon', scene, (scenes: BABYLON.AbstractMesh[]) => {

            skull = scenes[0];
            skull.scaling = skull.scaling.scale(0.05);
            skull.position = new BABYLON.Vector3();
            skull.material = new BABYLON.StandardMaterial("myMaterial", scene);
            skull.material.animations = [];
            skull.material.animations.push(animation);

            this._skull = skull;
            this._lastPosition = skull.position.clone();

        });

        const animation = new BABYLON.Animation("animation", "diffuseColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        const keys = [];
        keys.push({
            frame: 0,
            value: new BABYLON.Color3(1, 0, 0)
        });
        keys.push({
            frame: 30,
            value: new BABYLON.Color3(1, 1, 1)
        });
        keys.push({
            frame: 50,
            value: new BABYLON.Color3(1, 0, 0)
        });
        keys.push({
            frame: 75,
            value: new BABYLON.Color3(1, 1, 1)
        });
        keys.push({
            frame: 100,
            value: new BABYLON.Color3(1, 0, 0)
        });

        animation.setKeys(keys);

        const sphere: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 0.5 }, scene);
        sphere.position.x = 10;

        this.meshes.push({
            content: sphere,
            size: { height: 0.2, width: 0.2, depth: 0.2 },
            direction: new BABYLON.Vector3(Math.random(), Math.random(), Math.random())
        });

        engine.runRenderLoop(() => {

            if (this._isOver) return;

            const mesh: Mesh = this.meshes[0],
                position: BABYLON.Vector3 = mesh.content.position;

            if (this._isSphereMove) {

                if (Math.abs(position.x) < 20 && Math.abs(position.y) < 20 && Math.abs(position.z) < 20) {

                    mesh.content.position = position.add(mesh.direction);

                    if (skull && mesh.content.intersectsMesh(skull, true) && this._isStart) {

                        this.scene.beginAnimation(skull, 0, 100, false, 1, () => this._isOver = true);

                        this._isSphereMove = false;

                        window.removeEventListener('keydown', this._keyDown);

                    }

                } else {

                    mesh.direction = this._lastPosition.subtract(position).multiply(new BABYLON.Vector3(Math.random(), Math.random(), Math.random())).normalize().scale((this._score + 1) * 0.1);

                    mesh.content.position = position.add(mesh.direction);

                    if (this._isStart) this._score += 1;

                }

            }

            scene.render();

            this._isOver && alert('your score: ' + this._score);

        });

        window.addEventListener('keydown', this._keyDown);

    }

    private _init2() {

        const canvas2: HTMLCanvasElement = document.getElementById('canvas2') as HTMLCanvasElement;
        canvas2.height = 200;
        canvas2.width = 200;

        const engine = new BABYLON.Engine(canvas2, true),
            scene = new BABYLON.Scene(engine),
            camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 0), scene);

        BABYLON.MeshBuilder.CreateLines("axisX", {
            colors: [new BABYLON.Color4(1, 1, 1, 1), new BABYLON.Color4(1, 0, 0, 1)],
            points: [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(1, 0, 0)],
        }, scene);

        BABYLON.MeshBuilder.CreateLines("axisY", {
            colors: [new BABYLON.Color4(1, 1, 1, 1), new BABYLON.Color4(0, 1, 0, 1)],
            points: [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 1, 0)]
        }, scene);

        BABYLON.MeshBuilder.CreateLines("axisZ", {
            colors: [new BABYLON.Color4(1, 1, 1, 1), new BABYLON.Color4(0, 0, 1, 1)],
            points: [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1)]
        }, scene);

        engine.runRenderLoop(() => {

            camera.alpha = this.camera.alpha;
            camera.beta = this.camera.beta;

            scene.render();

        });

    }

}

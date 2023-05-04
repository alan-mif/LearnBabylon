import { Base } from "./Base";

export class ShootingGame extends Base {

    /** 背景音乐 */
    private _backgroundMusic: BABYLON.Sound;

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

        const { engine, scene, canvas } = this;

        this._createSkybox("./textures/cube/box"); // 创建天空盒并且指定贴图
        this.skybox.isPickable = false; // 关闭天空盒的鼠标拾取
        this.ground.isPickable = false; // 关闭地板的鼠标拾取
        this.ground.material.alpha = 0; // 地板透明
        this.camera.dispose(); // 销毁原相机
        this.camera = new BABYLON.UniversalCamera("", new BABYLON.Vector3(), scene); // 构造通用相机
        this.camera.attachControl(canvas, true); // 相机绑定控制

        this._initTargets();
        this._makeFrontSight();

        this._backgroundMusic = new BABYLON.Sound("hdl", "./sound/hdl.mp3", scene, null, { loop: true, autoplay: true });

        let alpha = Math.PI;

        engine.runRenderLoop((): void => {

            alpha = this._moveTarget(alpha);
            scene.render();

        });

        this._listener.addClick(this._click.bind(this));
        this._listener.addHover(this._hover.bind(this));

    }

    /**
     * 移动靶子
     */
    private _moveTarget(alpha: number): number {

        alpha += 0.01;

        // 改变 mesh 位置
        for (let i = 0; i < this.meshes.length; i++) {

            const mesh = this.meshes[i];
            mesh.content.position.x += mesh.direction.x * Math.cos(alpha) * 0.05;
            mesh.content.position.y += mesh.direction.y * Math.cos(alpha) * 0.05;
            mesh.content.position.z += mesh.direction.z * Math.cos(alpha) * 0.05;

        }

        return alpha;

    }

    /**
     * 制作准星
     */
    private _makeFrontSight(): void {

        const body = document.body,
            img = document.createElement('img');

        img.width = 16;
        img.height = 16;
        img.style.zIndex = '2';
        img.style.position = 'absolute';
        img.style.left = '' + Math.floor((body.clientWidth - img.width) / 2) + 'px';
        img.style.top = '' + Math.floor((body.clientHeight - img.height) / 2) + 'px';
        img.src = './textures/front_sight.png';

        body.appendChild(img);

    }

    /**
     * 初始化靶子
     */
    private _initTargets(): void {

        const target: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box0', {});
        target.position.x = 5 * Math.random() * 0.5;
        target.position.y = 1 * Math.random() * 0.5;
        target.position.z = -5 * Math.random() * 0.5;

        this.meshes.push({
            content: target,
            size: { height: 100, width: 100, depth: 1000 },
            direction: new BABYLON.Vector3(Math.random(), Math.random(), Math.random())
        });

        for (let i = 1; i < 10; i++) {

            const target1 = target.clone();
            target1.id = 'box' + i;
            target1.position.x = i * Math.random();
            target1.position.y = i * Math.random();
            target1.position.z = -i * Math.random();
            target1.material = new BABYLON.StandardMaterial('', this.scene);

            this.setAnimation(target1);
            this.meshes.push({
                content: target1,
                size: { height: 1, width: 1, depth: 1 },
                direction: new BABYLON.Vector3(Math.random(), Math.random(), Math.random())
            });

        }

    }

    /**
     * 点击执行
     */
    private _click(): void {

        new BABYLON.Sound("laser", "./sound/laser.wav", this.scene, null, { loop: false, autoplay: true }); // 激光音效

        const pickResult: BABYLON.PickingInfo = this.scene.pick(this.canvas.width / 2, this.canvas.height / 2),
            pickedMesh = pickResult.pickedMesh;

        if (pickedMesh) {
            this.scene.beginAnimation(pickedMesh, 0, 100, false).onAnimationEnd = (): void => this._removeTarget(pickedMesh);
        }

    }

    /**
     * 滑动执行
     */
    private _hover(): void {
    }

    /**
     * 移除靶子
     * @param mesh 
     */
    private _removeTarget(mesh: BABYLON.AbstractMesh): void {

        const { scene, meshes } = this;

        for (let i = 0; i < meshes.length; i++) {

            if (meshes[i].content.id === mesh.id) {

                meshes.splice(i, 1);

                new BABYLON.Sound("explode", "./sound/explode.mp3", scene, (): void => mesh.dispose(), { loop: false, autoplay: true }).attachToMesh(mesh);

                break;
                
            }

        }

        // 当所有靶子移除完毕后，更换通关bgm
        if (meshes.length === 0) {

            this._backgroundMusic.dispose();
            this._backgroundMusic = new BABYLON.Sound("mario", "./sound/Mario.mp3", scene, null, { loop: false, autoplay: true });

        }

    }

    /**
     * 设置动画
     * @param target 动画目标
     */
    private setAnimation(target: BABYLON.Mesh): void {

        const material: BABYLON.StandardMaterial = target.material as BABYLON.StandardMaterial,
            animation: BABYLON.Animation = new BABYLON.Animation("", "diffuseColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE),
            keys: any[] = [];

        keys.push({
            frame: 0,
            value: new BABYLON.Color3(1, 1, 1)
        }, {
            frame: 30,
            value: new BABYLON.Color3(0.8, 0.6, 0.8)
        }, {
            frame: 50,
            value: new BABYLON.Color3(0.8, 0.6, 0.4)
        }, {
            frame: 100,
            value: new BABYLON.Color3(0.8, 0.2, 0.2)
        });
        animation.setKeys(keys);
        material.animations = [];
        material.animations.push(animation);

    }

}
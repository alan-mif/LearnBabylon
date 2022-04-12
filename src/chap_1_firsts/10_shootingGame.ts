import { Base } from "./Base";

export class ShootingGame extends Base {

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

        this._createSkybox("./textures/cube/box");
        this.skybox.isPickable = false;
        this.ground.isPickable = false;
        this.ground.material.alpha = 0;
        this.camera.dispose();
        this.camera = new BABYLON.UniversalCamera("", new BABYLON.Vector3(), scene);
        this.camera.attachControl(canvas, true); // 相机绑定控制

        this._initTargets();
        this._makeFrontSight();

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
    private _moveTarget(alpha: number) {
         
        alpha += 0.01;

        for (let i = 0; i < this.meshes.length; i++) {

            const mesh = this.meshes[i];
            mesh.content.position.x += mesh.direction.x * Math.cos(alpha);
            mesh.content.position.y += mesh.direction.y * Math.cos(alpha);
            mesh.content.position.z += mesh.direction.z * Math.cos(alpha);

        }

        return alpha;

    }

    /**
     * 生成准星
     */
    private _makeFrontSight() {

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

        const target: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box', {});
        target.position.x = 5 * Math.random() * 0.5;
        target.position.y = 1 * Math.random() * 0.5;
        target.position.z = -5 * Math.random() * 0.5;
        
        this.meshes.push({
            content: target,
            size: { height: 1, width: 1, depth: 1 },
            direction: new BABYLON.Vector3(Math.random(), Math.random(), Math.random())
        });

        for (let i = 1; i < 30; i++) {

            const target1 = target.clone();
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

        const pickResult: BABYLON.PickingInfo = this.scene.pick(this.canvas.width / 2, this.canvas.height / 2),
            pickedMesh = pickResult.pickedMesh;

        if (pickedMesh) {
            this.scene.beginAnimation(pickedMesh, 0, 100, false).onAnimationEnd = (): void => pickedMesh.dispose();
        }

    }

    /**
     * 滑动执行
     */
    private _hover(): void {
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
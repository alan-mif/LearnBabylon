export class Sprite {

    /**
     * 构造函数
     */
    public constructor() {
        this._init();
    }

    private _init(): void {

        const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        const engine = new BABYLON.Engine(canvas, true), // 参数1传入 canvas， 参数2指定是否开启抗锯齿
            scene = new BABYLON.Scene(engine),
            camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 0), scene); // 参数1定义相机的 name，参数2定义相机沿y轴的旋转弧度，参数3定义相机沿x轴的旋转弧度，参数4定义相机与目标的距离，参数5定义相机的目标，参数6定义相机所属的场景
        camera.attachControl(canvas, true);

        new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 1), scene); // 参数1灯光 name，参数2灯光位置，参数3灯光所在的场景

        const spriteManager = new BABYLON.SpriteManager("SpriteManager", "./textures/player.png", 2000, { width: 64, height: 64 }, scene);
        const sprite = new BABYLON.Sprite("sprite", spriteManager);
        sprite.cellIndex = 0; // 指定精灵图（cellIndex在精灵表中的计数是从左到右，自上而下的）
        sprite.playAnimation(0, 43, true, 100);
        const box = BABYLON.MeshBuilder.CreateBox('box', { height: 1, width: 1, depth: 1 }, scene); // 为了和对比精灵
        box.position.y = -1; // 调整盒子坐标，避免挡住精灵图

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });

    }
}
export class Animation {

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
        BABYLON.MeshBuilder.CreateGround("myGround", { width: 6, height: 4, subdivisions: 4 }, scene);
        const box = BABYLON.MeshBuilder.CreateBox('box', { height: 1, width: 1, depth: 1 }, scene);
        const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene); // 参数1 材质 name，参数2 传入 scene
        myMaterial.diffuseTexture = new BABYLON.Texture("./textures/crate.png", scene);
        box.material = myMaterial;// mesh是之前创建的物体
        const positionAnimation = new BABYLON.Animation("positionAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const scalingAnimation = new BABYLON.Animation("scaleAnimation", "scaling", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        // const keys = [];
        // keys.push({
        //     frame: 0,
        //     value: 0
        // });
        // keys.push({
        //     frame: 30, // 代表这个关键帧是动画的第30帧
        //     value: 20
        // });
        // keys.push({
        //     frame: 50,
        //     value: 5
        // });
        // keys.push({
        //     frame: 100,
        //     value: 35
        // });
        // engine.runRenderLoop(() => {
        //     scene.render();
        // });

        const positionKeys = [];
        positionKeys.push({
            frame: 0,
            value: new BABYLON.Vector3(0, 0, 0)
        });
        positionKeys.push({
            frame: 30,
            value: new BABYLON.Vector3(10, 10, 5)
        });
        positionKeys.push({
            frame: 50,
            value: new BABYLON.Vector3(20, 15, 0)
        });
        positionKeys.push({
            frame: 100,
            value: new BABYLON.Vector3(0, 0, 0)
        });

        const scalingKeys = [];
        scalingKeys.push({
            frame: 0,
            value: new BABYLON.Vector3(1, 1, 1)
        });
        scalingKeys.push({
            frame: 30,
            value: new BABYLON.Vector3(10, 6, 2)
        });
        scalingKeys.push({
            frame: 50,
            value: new BABYLON.Vector3(2, 8, 1)
        });
        scalingKeys.push({
            frame: 100,
            value: new BABYLON.Vector3(1, 1, 1)
        });

        positionAnimation.setKeys(positionKeys);
        scalingAnimation.setKeys(scalingKeys);
        box.animations = [];
        box.animations.push(positionAnimation, scalingAnimation); // scalingAnimation

        const animatable = scene.beginAnimation(box, 0, 100, true);
        // animatable.pause();
        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });

    }

}

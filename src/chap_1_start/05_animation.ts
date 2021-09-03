export function init() {
    const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // 创建渲染引擎、场景、相机
    const engine = new BABYLON.Engine(canvas, true),
        scene = new BABYLON.Scene(engine),
        camera = new BABYLON.ArcRotateCamera(
            'camera',
            Math.PI / 2,
            Math.PI / 2,
            5,
            new BABYLON.Vector3(0, 0, 0),
            scene
        );
    // 将camera附加到canvas元素上
    camera.attachControl(canvas, true);

    // 设置相机缩放限制距离
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 50;

    // 创建灯光
    let light = new BABYLON.HemisphericLight(
        'light1',
        new BABYLON.Vector3(0, 1, 1),
        scene
    );

    // 创建立方体
    const box = BABYLON.MeshBuilder.CreateBox(
        'box',
        {height: 1, width: 1, depth: 1},
        scene
    );

    // 创建标准材质
    const mtl = new BABYLON.StandardMaterial('myMaterial', scene);
    mtl.diffuseTexture = new BABYLON.Texture('./textures/crate.png', scene);

    // 替换立方体默认材质
    box.material = mtl;

    let rate = 10;

    // 创建动画
    let boxAnimation = new BABYLON.Animation(
        'box',
        'position.x',
        rate,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // 关键帧数组
    let keyFrames = [];

    keyFrames.push({
        frame: 0,
        value: 2,
    });
    keyFrames.push({
        frame: rate,
        value: -2,
    });
    keyFrames.push({
        frame: 2 * rate,
        value: 2,
    });

    // 设置关键帧
    boxAnimation.setKeys(keyFrames);

    // 将动画添加到box的动画数组中
    box.animations.push(boxAnimation);

    // 开启动画并循环播放
    scene.beginAnimation(box, 0, 2 * rate, true);

    // 渲染循环
    engine.runRenderLoop(() => {
        scene.render();
    });

    // 窗口变动监听
    window.addEventListener('resize', () => {
        engine.resize();
    });
}

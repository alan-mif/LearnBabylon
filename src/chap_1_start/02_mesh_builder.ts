export function init() {
    // 创建3D场景基本元素

    // 获取canvas元素对象
    const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // 创建渲染引擎
    const engine = new BABYLON.Engine(canvas);

    // 创建场景对象
    const scene = new BABYLON.Scene(engine);

    // 创建像机
    const camera = new BABYLON.ArcRotateCamera(
        '',
        -Math.PI / 2,
        Math.PI / 2,
        2,
        new BABYLON.Vector3(),
        scene
    );
    camera.attachControl(canvas, true);

    // let mesh = BABYLON.MeshBuilder.CreateBox(
    //     '',
    //     {
    //         size: 1,
    //         height: 0.4,

    //         sideOrientation: 1,
    //     },
    //     scene
    // );

    // let mesh = BABYLON.MeshBuilder.CreateSphere(
    //     'sphere1',
    //     {
    //         segments: 32,
    //         diameter: 0.2,
    //     },
    //     scene
    // );

    let plane = BABYLON.MeshBuilder.CreatePlane(
        'plane1',
        {
            size: 1,
            sideOrientation: 2,
        },
        scene
    );

    let ground = BABYLON.MeshBuilder.CreateGround(
        'ground',
        {
            width: 1,
            height: 2,
        },
        scene
    );

    // 创建线段
    const myPoints = [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 2, 2),
        new BABYLON.Vector3(0, 2, 0),
    ];
    const colors = [
        new BABYLON.Color4(0.5, 0.5, 0.5, 1), // r g b a,取值范围 0-1
        new BABYLON.Color4(0.85, 0.5, 0.5, 0.2),
        new BABYLON.Color4(0.5, 0.85, 0.5, 1),
    ];

    let line = BABYLON.MeshBuilder.CreateLines(
        'line1',
        {
            points: myPoints,
            colors: colors,
        },
        scene
    );

    // 添加一盏灯光
    let light = new BABYLON.HemisphericLight(
        '',
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    scene.render();

    engine.runRenderLoop(() => {
        scene.render();
    });

    // 窗口大小变动监听
    window.addEventListener('resize', () => {
        engine.resize();
    });
}

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

    let mesh = BABYLON.Mesh.CreateBox('', 1, scene);

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

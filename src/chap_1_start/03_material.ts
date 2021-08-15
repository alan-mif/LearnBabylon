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

    let mesh = BABYLON.MeshBuilder.CreateBox(
        '',
        {
            size: 0.5,

            sideOrientation: 0,
        },
        scene
    );
    let box = BABYLON.MeshBuilder.CreateBox(
        '',
        {
            size: 0.2,

            sideOrientation: 0,
        },
        scene
    );

    // 创建材质
    let material = new BABYLON.StandardMaterial('mtl1', scene);
    material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
    material.specularColor = new BABYLON.Color3(0, 1.0, 0.0);
    // material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    material.alpha = 0.9;
    mesh.material = material;

    material.diffuseTexture = new BABYLON.Texture(
        './textures/crate.png',
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

export function init() {
    const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const engine = new BABYLON.Engine(canvas, true), // 参数1传入 canvas， 参数2指定是否开启抗锯齿
        scene = new BABYLON.Scene(engine),
        camera = new BABYLON.ArcRotateCamera(
            'camera',
            -Math.PI / 2,
            Math.PI / 2,
            2,
            new BABYLON.Vector3(0, 0, 0),
            scene
        ); // 参数1定义相机的 name，参数2定义相机沿y轴的旋转弧度，参数3定义相机沿x轴的旋转弧度，参数4定义相机与目标的距离，参数5定义相机的目标，参数6定义相机所属的场景
    camera.attachControl(canvas, true);

    new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene); // 参数1灯光 name，参数2灯光位置，参数3灯光所在的场景

    const box = BABYLON.MeshBuilder.CreateBox(
            'box',
            {height: 5, width: 2, depth: 0.5},
            scene
        ), // 参数1 mesh name，参数2 box 的一些参数，这里传入空对象，让其使用默认值，参数3传入 scene
        ground = BABYLON.MeshBuilder.CreateGround(
            'myGround',
            {width: 6, height: 4, subdivisions: 4},
            scene
        ),
        myPoints = [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 10, 10),
            new BABYLON.Vector3(0, 10, 0),
        ],
        colors = [
            new BABYLON.Color4(0.5, 0.5, 0.5, 1), // r g b a,取值范围 0-1
            new BABYLON.Color4(0.85, 0.5, 0.5, 0.2),
            new BABYLON.Color4(0.5, 0.85, 0.5, 1),
        ];
    //创建一个线条
    const lines = BABYLON.MeshBuilder.CreateLines(
        'lines',
        {points: myPoints, colors: colors},
        scene
    );
    console.log(box, ground, lines);
    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
}

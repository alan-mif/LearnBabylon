export function init() {
    const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
    });

    const createScene = () => {
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera(
            'camera',
            -Math.PI / 2,
            Math.PI / 2.5,
            3,
            new BABYLON.Vector3(0, 0, 0),
            scene
        );
        camera.attachControl(canvas, true);

        const light1 = new BABYLON.HemisphericLight(
            'light1',
            new BABYLON.Vector3(0, 1, 0),
            scene
        );

        const box = BABYLON.MeshBuilder.CreateBox('box', {});

        return scene;
    };

    const scene = createScene();

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
}

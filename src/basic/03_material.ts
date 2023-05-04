export class Material {

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
        const mesh = BABYLON.MeshBuilder.CreateBox('box', { height: 1, width: 1, depth: 1 }, scene);
        const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene); // 参数1 材质 name，参数2 传入 scene
        // myMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        // myMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5); // 自发光颜色
        // myMaterial.alpha = 0.5; 
        const texture = new BABYLON.Texture("./textures/crate.png", scene);
        const texture2 = new BABYLON.Texture("./textures/flare.png", scene);
        myMaterial.diffuseTexture = texture;
        // mesh.material = myMaterial; // mesh是之前创建的物体

        const shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, "./shaders/custom",
            {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time", "direction"]
            });
        shaderMaterial.setTexture("textureSampler", texture);
        shaderMaterial.setTexture("textureSampler2", texture2);
        mesh.material = shaderMaterial;

        engine.runRenderLoop((): void => {
            scene.render();
        });

        window.addEventListener('resize', (): void => {
            engine.resize();
        });

    }
}

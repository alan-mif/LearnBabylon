export class SkyBox {

    public constructor() {
        this._init();
    }

    private _init(): void {

        const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        const engine = new BABYLON.Engine(canvas, true),
            scene = new BABYLON.Scene(engine),
            camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 0), scene);

        camera.attachControl(canvas, true); // 相机绑定控制
        new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene); // 添加半球光用来模拟环境光

        const skyBox = BABYLON.MeshBuilder.CreateBox("skyBox", {
            size: 2000.0
        }, scene),
            skyBoxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

        skyBoxMaterial.backFaceCulling = false;
        skyBoxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/cube/box", scene);
        skyBoxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyBoxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyBoxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyBox.material = skyBoxMaterial;

        const shape = BABYLON.MeshBuilder.CreateBox("shape", {}, scene),
            shapeMaterial = new BABYLON.StandardMaterial("mat", scene);

        shapeMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/cube/box", scene);
        shapeMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        shapeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        shape.material = shapeMaterial;

        engine.runRenderLoop(() => scene.render());

    }

}
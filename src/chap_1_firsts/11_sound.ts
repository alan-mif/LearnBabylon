import { Base } from "./Base";

export class Sound extends Base {

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 初始化
     */
    protected _init(): void {

        super._init();

        const { engine, scene } = this;
        const box: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box0', {});
        box.position.y = 0.5;

        const music = new BABYLON.Sound("hdl", "./sound/hdl.mp3", scene, null, { loop: true, autoplay: true });
        music.setDirectionalCone(90, 180, 0);
        music.setLocalDirectionToMesh(new BABYLON.Vector3(1, 0, 0));
        music.attachToMesh(box);

        engine.runRenderLoop((): void => scene.render());

    }
}
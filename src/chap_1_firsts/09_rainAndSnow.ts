import { Base } from "./base";

export class RainAndSnow extends Base {

    /** 风力 */
    public windPower: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
    /** 重力 */
    public gravity: BABYLON.Vector3 = new BABYLON.Vector3(0, -9.81, 0);
    /** 空气阻力 */
    public airDrag: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);

    /** 时间 */
    private _time: number = new Date().getTime();
    /** 数量 */
    private _count: number = 0;

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

        const spriteManager: BABYLON.SpriteManager = new BABYLON.SpriteManager("SpriteManager", "./textures/player.png", 10000, { width: 64, height: 64 }, scene);

        engine.runRenderLoop((): void => {

            const time = new Date().getTime();

            if (time - this._time > 100 && this._count < 10000) {

                for (let i = 0; i < 100; i++)
                    this._addSprite(spriteManager);

                this._time = time;

            }

            scene.render();

        });

    }

    /**
     * 添加精灵
     * @param spriteManager 精灵管理器
     */
    private _addSprite(spriteManager: BABYLON.SpriteManager): void {

        const sprite = new BABYLON.Sprite("sprite", spriteManager);
        sprite.cellIndex = 0;
        sprite.position.x = Math.random() * 100;
        sprite.position.y = 40;
        sprite.position.z = Math.random() * 100;
        sprite.size = 2;

        this._count += 1;

    }

}
import { Base, Sprite } from "./base";

export class RainAndSnow extends Base {

    /** 风力 */
    public windPower: BABYLON.Vector3 = new BABYLON.Vector3();
    /** 重力 */
    public gravity: BABYLON.Vector3 = new BABYLON.Vector3(0, -9.81, 0);
    /** 空气阻力比例系数 */
    public airDragK: number = 1;
    /** 质量(单位 kg) */
    public mass: number = 0.01;

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

        const spriteManager: BABYLON.SpriteManager = new BABYLON.SpriteManager("SpriteManager", "./textures/snow.png", 10000, { width: 8, height: 8 }, scene);

        engine.runRenderLoop((): void => {

            const time: number = new Date().getTime();

            for (let i = 0; i < this.sprites.length; i++) {

                const sprite: Sprite = this.sprites[i],
                    position: BABYLON.Vector3 = sprite.content.position;

                if (position.y > 1) {

                    const v = 0;
                    position.y += 1 / 2 * (this.gravity.y - this.airDragK * v) * ((time - sprite.time) / 1000) ** 2;
                    sprite.content.angle += 0.05 * Math.random();

                } else {
                    position.y = 1;
                }

            }

            if (time - this._currentTime > 10 && this._count < 10000) {

                for (let i = 0; i < 100; i++)
                    this._addSprite(spriteManager);

                this._currentTime = time;

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
        sprite.position.x = Math.random() * 50 - 25;
        sprite.position.y = 80;
        sprite.position.z = Math.random() * 50 - 25;
        sprite.size = 1;

        this.sprites.push({
            content: sprite,
            direction: new BABYLON.Vector3(),
            time: new Date().getTime()
        });
        this._count += 1;

    }

}
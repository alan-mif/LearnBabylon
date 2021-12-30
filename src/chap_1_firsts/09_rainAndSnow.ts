import { Base, Sprite } from "./base";

export class RainAndSnow extends Base {

    /** 风速 */
    public windSpeed: BABYLON.Vector3 = new BABYLON.Vector3();
    /** 重力加速度 */
    public gravitationalA: BABYLON.Vector3 = new BABYLON.Vector3(0, -9.81, 0);
    /** 空气阻力比例系数 */
    public airDragK: number = 1.0; // 雪花建议:1.0; 雨滴建议:0.05
    /** 质量(单位: kg) */
    public mass: number = 0.001;
    /** 直径(单位: m) */
    public diameter: number = 0.005;

    /** 地面精灵数量 */
    private _groundSpriteCount: number = 0;

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

        const snowManager: BABYLON.SpriteManager = new BABYLON.SpriteManager("SpriteManager", "./textures/snow.png", 10000, { width: 8, height: 8 }, scene);

        for (let i = 0; i < 10000; i++)
            this._addSprite(snowManager, Math.floor(new Date().getTime() + i / 10));

        engine.runRenderLoop((): void => {

            if (this._groundSpriteCount < this.sprites.length) this._SpriteMigration();

            scene.render();

        });

    }

    /**
     * 添加精灵
     * @param spriteManager 精灵管理器
     */
    private _addSprite(spriteManager: BABYLON.SpriteManager, time: number = new Date().getTime()): void {

        const sprite = new BABYLON.Sprite("sprite", spriteManager),
            groundX = this.ground._boundingInfo.boundingBox.extendSize.x * 2,
            groundY = this.ground._boundingInfo.boundingBox.extendSize.x * 2;

        sprite.cellIndex = 0;
        sprite.position.x = Math.random() * groundX - groundX / 2;
        sprite.position.y = 40;
        sprite.position.z = Math.random() * groundY - groundY / 2;
        sprite.size = 0.1;

        this.sprites.push({
            content: sprite,
            time: time,
            velocity: new BABYLON.Vector3(),
            isStop: false
        });

    }

    /**
     * 精灵移动
     */
    private _SpriteMigration() {

        const time: number = new Date().getTime(),
            deltaTime = 0.01,
            length = this.sprites.length;

        if (time - this._currentTime > deltaTime * 1000) {

            for (let i = 0; i < length; i++) {

                const sprite: Sprite = this.sprites[i],
                    position: BABYLON.Vector3 = sprite.content.position,
                    size: number = sprite.content.size,
                    totalTime: number = (time - sprite.time) / 1000;

                if (position.y > size / 2) {
                    totalTime > 0 && this._computeSpritePosition(sprite, totalTime, deltaTime);
                } else {

                    position.y = size / 2;

                    if (!sprite.isStop) {

                        sprite.isStop = true;

                        this._groundSpriteCount += 1;

                    }

                }

            }

        }

    }

    /**
     * 计算精灵位置
     * @param sprite 精灵
     * @param totalTime 总时长
     * @param deltaTime 间隔时间
     */
    private _computeSpritePosition(sprite: Sprite, totalTime: number, deltaTime: number) {

        const acceleration = this.gravitationalA.y - this.airDragK * sprite.velocity.y * this.diameter / this.mass;
        if (acceleration < 0) sprite.velocity.y = acceleration * totalTime;

        const content = sprite.content;
        content.position.x += this.windSpeed.x * deltaTime * 0.5;
        content.position.y += sprite.velocity.y * deltaTime;
        content.position.z += this.windSpeed.z * deltaTime * 0.5;
        content.angle += 0.05 * Math.random();

    }

}
import { Base } from "./base";

export class Fog extends Base {

    public constructor() {

        super();

    }

    protected _init(): void {

        super._init();

        const { engine, scene } = this;

        const particleSystem: BABYLON.ParticleSystem = new BABYLON.ParticleSystem("particles", 2500, scene);
        particleSystem.manualEmitCount = particleSystem.getCapacity();
        particleSystem.minEmitBox = new BABYLON.Vector3(-25, 12, -25);
        particleSystem.maxEmitBox = new BABYLON.Vector3(25, 1, 25);

        // const particleSystem: BABYLON.GPUParticleSystem = new BABYLON.GPUParticleSystem("particles", { capacity: 20000 }, scene);
        // particleSystem.activeParticleCount = 5000;
        // particleSystem.manualEmitCount = particleSystem.activeParticleCount;
        // particleSystem.minEmitBox = new BABYLON.Vector3(-25, 12, -25); 
        // particleSystem.maxEmitBox = new BABYLON.Vector3(25, 1, 25); 

        particleSystem.particleTexture = new BABYLON.Texture("./textures/smoke_15.png", scene);
        particleSystem.color1 = new BABYLON.Color4(0.8, 0.8, 0.8, 0.1);
        particleSystem.color2 = new BABYLON.Color4(.95, .95, .95, 0.35);
        particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1);
        particleSystem.minSize = 3.5;
        particleSystem.maxSize = 5.0;
        particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
        particleSystem.emitRate = 10000;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
        particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
        particleSystem.minAngularSpeed = -2; // 发射粒子的最小角速度(每个粒子的z轴旋转)。  
        particleSystem.maxAngularSpeed = 2; // 发射粒子的最大角速度(每个粒子的z轴旋转)。  
        particleSystem.updateSpeed = 0.01;

        particleSystem.start();

        engine.runRenderLoop(() => {
            scene.render();
        });

    }

}
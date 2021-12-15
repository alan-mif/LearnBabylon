# *Lesson 9 Particle*

### 一、什么是 Particle 以及 Particle 的作用

这里我们借用一下物理学中对粒子的理解。**粒子**一般是指能够以自由状态存在的最小物质组成部分，如原子。而我们所说的粒子参考了这种微观的思想把一个物体分为若干个组成部分，每一个组成部分便是一个粒子（如果这个物体本身就很小，那么我们甚至可以不用拆分，直接把这个物体当成一个粒子）

那么，我们为什么要使用粒子呢？一个主要原因是为了让我们的场景看起来更加的真实。我们已经知道，现实世界是由微观的粒子组成的。我们平时观察到的宏观世界，在三维场景中很多都可以直接表现出来，如立方体。我们只需要按照顶点画出对应的面片并且渲染出来即可。但对于一些非固体而言，如果不借用粒子的思想，我们很难去描述他们的形状和变化过程，如*雨雪（如何下落），云雾，火焰，水流，爆炸效果*等等。

上面提到了一些可以依靠粒子来实现的效果，其实，在实际应用中还会有更多种多样的效果需要使用粒子来实现。如果我们每一种效果都从头开始去实现的话，那么工作量和难度无疑是巨大的。为了避免开发者重复造轮子，通常游戏引擎都会有自己的**粒子系统（particleSystem）**。粒子系统具有大量的属性，可以通过调整各个属性去模拟开发者实现想要实现的效果。 Banylon 也不例外，它也有自己的粒子系统。

### 二、在 Babylon 中使用 Particle

**e.g.1 利用粒子模拟喷泉效果**

```typescript
        // 创建发射器和粒子系统
		const emitter = BABYLON.MeshBuilder.CreateBox("", {}, scene),
            particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

        emitter.position.y = 1;
        particleSystem.particleTexture = new BABYLON.Texture("./textures/flare.png", scene); // 粒子贴图
        // particleSystem.emitter = emitter; // 设置粒子发射器
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.0, 0.0); // 粒子在其生命周期结束时的颜色  
        // 粒子的尺寸在[0.1,0.8]内随机
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.8;
        // 粒子的生命周期在[0.3,1]内随机
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1;
        // 发射器的速率（一帧释放的粒子数）
        particleSystem.emitRate = 1000;
        // 每个粒子发射后的随机方向，位于 direction1 和 direction2 之间
        particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 3);
        particleSystem.direction2 = new BABYLON.Vector3(2, 8, -3);
        particleSystem.updateSpeed = 0.02; // 整体更新速度(0.01是默认的更新速度。更新越快,动画越快)  

        particleSystem.start(); // 启动粒子系统
```


# *Lesson 7 CheckCollisions*



### 一、什么是碰撞检测？

其实很好理解，从字面上来看就是一个物体与另外一个物体是否发生了碰撞（或者相交）的检测。问题的关键在于在 3D 世界中怎么去实现碰撞检测，以及应用碰撞检测能为我们带来什么。首要的，我们先思考一下碰撞检测能为什么带来什么。至于怎么去实现它，我们在下面会陆续介绍。

如果你玩过 FPS 类型的游戏的话就能有深刻的体会，你的人物无时无刻不在应用碰撞检测，无论是与墙体的碰撞，地面的碰撞，与其他人物的碰撞，甚至与子弹的碰撞。想像一下，如果不进行碰撞检测的话，当你走到墙边的时候是不是就直接穿越过去了，当子弹打中你的时候我们也不知道有子弹打中过你，进而无法进行伤害的计算。也就是说碰撞检测一般来说给我们带来了两方面的便利。一个是更加符合物理的运动规律。另一个则是在我们的物体发生碰撞的时候能够给我们带来正确的反馈，使我们能够知道物体发生了碰撞，进而去做我们要做的事情。



### 二、应用碰撞检测

**e.g.1 自由落体与地面的碰撞检测**

我们来模拟这样一个场景，一个盒子在40m高空落下，最终落在地板上。

这节课我们稍稍改动下架构，定义这样一个类

```typescript
interface size {
    height: number;
    width: number;
    depth: number;
}

interface Mesh {
    content: BABYLON.Mesh;
    size: size;
}

export class Collisions {

    /** 引擎 */
    public engine: BABYLON.Engine;
    /** 场景 */
    public scene: BABYLON.Scene;
    /** 相机 */
    public camera: BABYLON.ArcRotateCamera;
    /** 物体集合 */
    public meshes: Array<BABYLON.Mesh> = [];
    /** 地板 */
    public ground: BABYLON.Mesh;
    /** 重力 */
    public gravity: BABYLON.Vector3;

    /** 时间 */
    private _time: number = 0;
    /** 精度 */
    private _precision: number = 0.01;

    /**
     * 构造函数
     */
    public constructor() {
        this._init();
    }

    /**
     * 初始化
     */
    private _init() {

        const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 0), this.scene);

        this.camera.attachControl(canvas, true); // 相机绑定控制
        new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene); // 添加半球光用来模拟环境光

        // 创建 box 并给定高度
        const box: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box', { height: 1, width: 1, depth: 1 }, this.scene);
        box.position.y = 40;

        // 创建 ground 并给定高度
        this.ground = BABYLON.MeshBuilder.CreateGround("myGround", { width: 6, height: 4, subdivisions: 4 }, this.scene);

        this.gravity = new BABYLON.Vector3(0, -9.81, 0); // 定义重力（方向和大小）

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

    }

}
```



至此，你将看到一个地板以及在40m高空悬浮的盒子，现在我们让该盒子以自由落体的方式落下并停止在地板上。我们知道，自由落体的距离公式如下 

```typescript
s = 1/2 * gt^2；
```

现在我们来改写代码，将帧循环里的代码进行修改。

```typescript
this.engine.runRenderLoop(() => {

	this._time = this._time === 0 ? new Date().getTime() : this._time; // 当场景开始渲染即开始计时
    
    const time: number = new Date().getTime(), // 当前时间
		totalTime: number = time - this._time, // 物体下落的总时长
		distance: number = 1 / 2 * this.gravity.y * Math.pow(totalTime / 1000, 2)； // 物体下落的距离
        
    box.position.y += distance / 10; // 将物体下落的距离应用到该物体上,为了我们能够更加方便的观察物体下落过程，把它的速度变慢一些，当然这在实际应用中是不必要的。
    if (box.position.y < 1 / 2) box.position.y = 1 / 2; // 检测物体是否与地板碰撞，如果是即停止在地板上
    
	this.scene.render();
    
}
```

这里，我们把地板默认作为**刚体**（在运动中和受力作用后，形状和大小不变，而且内部各点的相对位置不变的物体），也就是说物体不会落入到地板下方，所以我们可以直接判定，当物体的位置坐标小于其高度的一半时即是其与地板放生了碰撞，我们得到反馈之后立刻将物体停止在地板之上。

**e.g.2 自由落体与物体的碰撞检测**

首先我们定义两个 box 将其放入到我们都和 meshes 中

```typescript
        // 创建 box 并给定高度
        const box: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box', { height: 1, width: 1, depth: 1 }, this.scene);
        box.position.y = 40;
        // 创建 box2 并给定高度
        const box2: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box2', { height: 1, width: 2, depth: 2 }, this.scene);
        box2.position.y = 1 / 2;
        this.meshes.push(
            { content: box, size: { height: 1, width: 1, depth: 1 } },
            { content: box2, size: { height: 1, width: 2, depth: 2 } }
        );
```

实现这样一个方法，当物体1下落时判断是否与物体2相交

```typescript
    private _intersectsMeshByG(mesh: Mesh, mesh2: Mesh) {
        return mesh.content.position.y - mesh.size.height / 2 < mesh2.content.position.y + mesh2.size.height / 2 ? true : false;
    }
```

接着在帧循环中将代码改写为

```typescript
for (let i = this._precision; i < -distance && !this._intersectsMeshByG(this.meshes[0], this.meshes[1]); i += this._precision) box.position.y -= this._precision;
```

此段代码的含义是让物体没下落一个精度的距离时就进行一次碰撞检测，当下落物体与静止物体相交时停止下落。


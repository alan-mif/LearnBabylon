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

**e.g.3 做随机方向的简谐运动的小球间的碰撞检测**

这个例子我们让50个小球做随机方向运动，当与其他球反生碰撞时，我们将小球变成红色，否则让小球变为白色。

```typescript
        // 创建50个随机位置的小球
        for (let i = 0; i < 50; i++) {

            const sphere = BABYLON.MeshBuilder.CreateSphere('sphere' + i, { diameter: 2 }, this.scene);
            sphere.material = new BABYLON.StandardMaterial("material", this.scene);
            sphere.position.x = 20 * Math.random();
            sphere.position.y = 20 * Math.random();
            sphere.position.z = 20 * Math.random();

            this.meshes.push({
                content: sphere,
                size: { height: 1, width: 1, depth: 1 },
                direction: new BABYLON.Vector3(Math.random(), Math.random(), Math.random())
            });

        }
```

```typescript
        let alpha = Math.PI;
		this.engine.runRenderLoop(() => {

            alpha += 0.1;

            for (let i = 0; i < this.meshes.length; i++) {

                const mesh = this.meshes[i];
                mesh.content.position.x += mesh.direction.x * Math.cos(alpha);
                mesh.content.position.y += mesh.direction.y * Math.cos(alpha);
                mesh.content.position.z += mesh.direction.z * Math.cos(alpha);

                let flag: boolean = false;

                for (let a = 0; a < this.meshes.length; a++) {

                    if (i !== a && mesh.content.intersectsMesh(this.meshes[a].content, false)) {

                        flag = true;

                        break;

                    }

                }

                const material: BABYLON.StandardMaterial = mesh.content.material as BABYLON.StandardMaterial;
                flag ? material.diffuseColor = new BABYLON.Color3(1, 0, 0) : material.diffuseColor = new BABYLON.Color3(1, 1, 1);

            }

            this.scene.render();

        });
```

让小球运动并且进行碰撞检测。这里我们使用 Babylon 的碰撞检测方法 intersectsMesh() 这个方法需要两个参数，第一个是检测与物体是否发生碰撞的物体，第二个参数是一个 boolean 类型的值，true 和 false 分别代表了 Babylon 会以 **OBB** 和 **AABB** 来进行碰撞检测 。

要想知道什么是 **OBB** 和 **AABB**，我们需要先介绍一下什么是包围盒。我们知道在 3D 场景中对一个复杂物体进行逐点的碰撞检测是十分耗费性能的，假如我们用一个盒子包裹住这个物体，再让这个盒子代替物体去进行碰撞检测，那么情况就简单多了（尽管这样会失去一些精度）。这个包裹着物体的盒子就是包围盒。

也就是说，我们上面说的 Babylon 使用的碰撞检测的方法就是将两个物体的包围盒进行碰撞检测。那么什么是 OBB 和 AABB 呢？

**AABB** （Axis-aligned bounding box）以物体在各个轴向上的最大值和最小值作为顶点的长方体。也就是说这个包围盒永远是轴对齐的，这样的包围盒尽管简单，但却是有缺点的。比如，我们要给一个扁平细长的物体做包围盒，然而，这个物体并不是沿轴方向的，它有一定的旋转角度。这样的话，如果使用 AABB ，你会发现包围盒比原来的物体大出很多。为了解决这个问题我们需要使用下面这个方法来确定包围盒，OBB

**OBB** （Oriented Bounding Box,OBB）前面提到了长条物体在旋转时AABB的缺点，那么是否有能够在任意方向都更为精确的检测方式呢？答案是肯定的，OBB 即定向包围盒，它已经广泛用于光线追踪和碰撞检测中。OBB这种方法是根据物体本身的几何形状来决定盒子的大小和方向，盒子无须和坐标轴垂直。这样就可以选择最合适的最紧凑的包容盒子。***OBB 的生成比较复杂***。一般是考虑物体所有的顶点在空间的分布，通过一定的算法找到最好的方向(OBB盒子的几个轴)。

显然我们用到的小球是没有旋转的，即便旋转了，它的长轴和半轴相同，所以我们没有必要是使用更为复杂的 OBB
# *Lesson 5 Animation*

### 一、如何让场景中的元素动起来

通过前面几节课的学习，我们已经熟练掌握了如何在一个场景中添加我们想要展示的各个元素（包括各种形状的物体，灯光和相机）可是我们发现，之前的场景都是静态的，不够灵动。我们本节课就带领大家尝试让这些 3D元素动起来。

那么方法是什么呢？没错，就是 **Animation**，babylon 提供了一个 Animation 对象，我们只需要创建这个对象，合理使用其属性便可以得到一段动画。

***e.g. 1 移动一个立方体***

首先我们先创建一个 box 和一个 animation

```typescript
const box = BABYLON.MeshBuilder.CreateBox('box', { height: 1, width: 1, depth: 1 }, scene);
const animationBox = new BABYLON.Animation("myAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
```

- 参数1 - 动画的名称
- 参数2 - 这个与对象的属性相关，可以是任何物体的属性，具体取决于需要更新的内容，上例中我们要在X轴的方向移动 **box**，所以这里设置为 **position.x** 。
- 参数3 - 每秒请求的帧数：动画中可能达到的最高FPS。
- 参数4 - 数值变化类型。根据参数3的配置，决定要修改的值类型：浮点数（例如x轴位置Position.x），矢量（例如位置Position）还是颜色 确切的值是：
  - 浮点数：BABYLON.Animation.ANIMATIONTYPE_FLOAT
  - 二维向量：BABYLON.Animation.ANIMATIONTYPE_VECTOR2
  - 三维向量：BABYLON.Animation.ANIMATIONTYPE_VECTOR3
  - 颜色：BABYLON.Animation.ANIMATIONTYPE_COLOR3

- 参数5 - 动画的在执行完一个周期后，需要执行的行为模式，例如继续运动、从头开始执行还是立即停止，可选三种模式：
  - 相对，相对运动，即：执行完一次，在接着最后的状态，继续执行：BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE
  - 循环，动画循环执行，即：执行完一次，从头开始再执行：BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  - 常量，动画执行一次就停止不动了：BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT

接着我们创建一个数组作为 keys，显然数组中的每一个元素就是一个 key。

```typescript
const keys = [];
```

那么什么是 key呢？key 其实就是动画的关键帧，顾名思义就是一段动画在播放过程中比较重要的帧。这些关键帧表明了当前的画面动画对象该如何改变自身的状态。比如第一个关键帧物体在原地，第二个关键帧物体向前位移20，第三个关键帧物体向后位移15，最后一个关键帧物体向前位移30 至于除了关键帧以外的那些帧，babylon 会自动为我们插值，这里我们暂时不用关心。那好，让我们把上述的关键帧写入到 keys 中吧！

```typescript
keys.push({
    frame: 0,
    value: 0
});
keys.push({
    frame: 30, // 代表这个关键帧是动画的第30帧
    value: 20
});
keys.push({
    frame: 50, 
    value: 5
});
keys.push({
    frame: 100,
    value: 35
});
```

然后把这些关键帧加入到动画对象中

```typescript
animationBox.setKeys(keys);
```

最后我们把动画和物体关联起来并且启动这段动画

```typescript
box.animations = [];
box.animations.push(animationBox);
scene.beginAnimation(box, 0, 100, true);
```

运行代码~ okay 动起来咯！（没动的话自己找找原因哈）


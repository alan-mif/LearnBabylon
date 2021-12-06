# *Lesson 8 SkyBox*



### 一、什么是天空盒？

一般来说天空盒是指一个笼罩住整个场景的巨大的盒子。这个笼罩住场景的盒子可以使用美术艺术家们做好的高清贴图，所以会使整个场景非常美观且具有氛围感。

首先用立方体包裹住场景，然后使用高清贴图渲染环境。

下面这个贴图就是一张天空盒的贴图，可以看出它其实是一个立方体的展开图。



![cubemaps_skybox](images/cubemaps_skybox.png)



### 二、babylon 中的天空盒

要想在 babylon 中使用天空盒，首先我们需要创建一个立方体。

```
const skyBox = BABYLON.MeshBuilder.CreateBox("skyBox", {
            size: 2000.0
        }, scene),
```


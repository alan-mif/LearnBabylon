# *Lesson 3 Material*

### 一、创建一个材质并应用到物体上

在 babylon 中创建材质并不复杂，只需简单传入两个参数即可，需要作用到哪个物体就把哪个物体的 material 属性赋值成你创建出来的 material 即可，代码如下。

```
const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene); // 参数1 材质 name，参数2 传入 scene
mesh.material = myMaterial;// mesh是之前创建的物体
```

### 二、材质的几种属性以及作用

- **颜色**

用材质来美化一个物体的时候，有一个属性是大家很容易想到的，那便是颜色。颜色是我们观察这个大千世界的一种很直观的属性，而颜色的本质其实是该物体吸收和反射电磁波的特性，当然在 3D 世界中我们也会尽可能的模拟这些，下面我们就来介绍几种关于颜色的属性。

1. 漫反射颜色 - 在灯光下看到的材质基本颜色或纹理
2. 镜面反射颜色 - 在灯光照射下，高光给与材质的效果
3. 自发光颜色 - 材质的颜色或纹理就像一个灯光那样可以对外发出的效果

要看到漫反射和镜面反射的材质效果，必须要求创建至少一个光源，自发光颜色则不需要光源即可显示效果。在实际应用中，很可能是这几种属性搭配使用。

*注意：如果你想让除了自发光颜色以外的颜色属性同样参与作用，那么自发光颜色就不能给到白色。否则自发光颜色会遮盖掉其他颜色，该物体将永远呈现白色。*

```
const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene); // 创建一个材质

myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1); // 漫反射颜色
myMaterial.specularColor = new BABYLON.Color3(0.6, 0.4, 0.87); // 镜面颜色
myMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5); // 自发光颜色

mesh.material = myMaterial; // mesh 之前创建的物体
```

- **透明度**

一个物体的透明属性，在 babylon 中使用 alpha 来表示。 取值范围 0-1，0表示完全透明，1表示完全不透明。

```
myMaterial.alpha = 0.5;
```

- **纹理贴图**

上面提到了如何利用颜色和透明度来美化一个物体，可是一个物体往往并不是全身只具备一种颜色和一种透明度，那这种情况开怎么办呢？这就得纹理贴图登场来解决这个问题了。纹理贴图是将纹理空间中的纹理像素映射到屏幕空间中的像素的过程。 简单来说，就是把一幅图像贴到三维物体的表面上来增强真实感，可以和光照计算、图像混合等技术结合起来形成许多非常漂亮的效果。

上面提到的几种颜色属性及透明属性都有对应的贴图，让我们来尝试将之前的代码改写一下！

```
const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
// PATH TO IMAGE，表示图片的路径。
myMaterial.diffuseTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
myMaterial.specularTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
myMaterial.emissiveTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
myMaterial.opacityTexture = new BABYLON.Texture("PATH TO IMAGE", scene);

mesh.material = myMaterial; 
```


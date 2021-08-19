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

上面提到了如何利用颜色和透明度来美化一个物体，可是一个物体往往并不是全身只具备一种颜色和一种透明度，那这种情况开怎么办呢？这就得纹理贴图登场来解决这个问题了。 简单理解，我们将一幅图像贴到三维物体的表面上来增强真实感，可以和光照计算、图像混合等技术结合起来形成许多非常漂亮的效果。

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

### 三、什么是纹理贴图

上面提到的纹理贴图可能对于一些没有美术或者三维基础的同学来讲，概念并不是很清晰。对于纹理贴图到底是什么以及它是怎么发挥作用的，头脑中很难形成一个完整的认知。见于此，我们接下来就来讲解一下。

我们重新来思考一下，既然在三维世界中，物体上每一个点的颜色都是由漫反射颜色（这里先考虑漫反射贴图，所以忽略其他颜色的作用。其他颜色贴图同理）来决定。假设一个物体有一万个点，并且每个点的颜色不一定相同。那我们需要一个一个的为他们赋予颜色吗？显然这是不太友好的（其实确实存在为每一个点设置颜色的应用场景，具体操作方法等到后续的课程中来介绍）。很自然的，我们这时希望由美术艺术家们来给这个物体进行上色（毕竟那是他们擅长的）。

可是还有一个问题，美术艺术家们在三维物体上做出作品要以什么形式存储下来以供程序应用，并且还能足够小。这里给出的答案是：考虑将三维物体的颜色（其实不光是颜色，其他一些三维物体的属性也可以通过这种方式表现，后续课程中会陆续介绍）映射到一张二维的图片上。没错这个图片就是纹理贴图(Texture)，这个技术被称为纹理映射(Texture Mapping)。我们最容易想到的纹理映射，可能就是地球仪映射成为一张世界地图了。到这里，我们懂了只要拥有一种映射关系，就可以将一个物体映射到一张二维图片上，再由这张二维图片应用于程序反过来映射到三维物体上为其着色，那我们就轻而易举的还原了美术艺术家们的大手笔了。

那么有了一张 Texture 之后，映射关系又是如何表示的呢？这又是一个知识点：纹理坐标（UV）。在纹理空间之内任意一个二维坐标都在[0,1]之内。横轴和纵轴的最大值都为1，一幅 Texture 上的任意一点都可以用一个(u,v)坐标来表示,因此只需要在物体上每个顶点的信息之中存储下该顶点在纹理空间的(u,v)坐标信息，自然而然的就得到了这种映射关系。至于一个顶点所对应在纹理空间的坐标是怎么得到的，这通常不是程序员们需要关心的。因为这基本上都会由美术艺术家们在其使用的软件中帮我们做好（当然了，想要继续深入了解其内部原理的同学也不用灰心，随着课程的深入，我们会循序渐进的将这些原理性的东西进行拆分讲解）。

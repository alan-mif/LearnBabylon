import { Mesh, Base } from "./base";

export class Collisions extends Base {

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

        super();

    }

    /**
     * 物体由于重力影响是否相交
     * @param mesh 
     * @param mesh2 
     * @returns 
     */
    private _intersectsMeshByG(mesh: Mesh, mesh2: Mesh): boolean {
        return mesh.content.position.y - mesh.size.height / 2 < mesh2.content.position.y + mesh2.size.height / 2 ? true : false;
    }

    /**
     * 初始化
     */
    protected _init(): void {

        const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 0), this.scene);

        // // 创建 box 并给定高度
        // const box: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box', { height: 1, width: 1, depth: 1 }, this.scene);
        // box.position.y = 40;
        // // 创建 box2 并给定高度
        // const box2: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox('box2', { height: 1, width: 2, depth: 2 }, this.scene);
        // box2.position.y = 1 / 2;
        // this.meshes.push(
        //     { content: box, size: { height: 1, width: 1, depth: 1 } },
        //     { content: box2, size: { height: 1, width: 2, depth: 2 } }
        // );

        // // 创建 ground 
        // this.ground = BABYLON.MeshBuilder.CreateGround("myGround", { width: 6, height: 4, subdivisions: 4 }, this.scene);

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

        this.gravity = new BABYLON.Vector3(0, -9.81, 0); // 定义重力（方向和大小）




        let alpha = Math.PI;

        this.engine.runRenderLoop(() => {

            // this._time = this._time === 0 ? new Date().getTime() : this._time;

            // const time: number = new Date().getTime(),
            //     totalTime: number = time - this._time,
            //     distance: number = 1 / 2 * this.gravity.y * Math.pow(totalTime / 1000, 2);

            // box.position.y += distance / 10; // 将物体下落的距离应用到该物体上,为了我们能够更加方便的观察物体下落过程，把它的速度变慢一些，当然这在实际应用中是不必要的。
            // if (box.position.y < 1 / 2) box.position.y = 1 / 2;

            // for (let i = this._precision; i < -distance && !this._intersectsMeshByG(this.meshes[0], this.meshes[1]); i += this._precision) box.position.y -= this._precision;

            // const p = () => box.position.y -= this._precision;
            // const i = () => !this._intersectsMeshByG(this.meshes[0], this.meshes[1]);
            // (f => f(f))((r: (a: any) => { (a: number): number; }) => (n: number) => n <= -distance && i() && p() ? n * r(r)(n + 0.01) : null)(0.01)

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

            // const loop = (i: number) => {

            //     return i < this.meshes.length ? (() => {

            //         const mesh = this.meshes[i];
            //         mesh.content.position.x += mesh.direction.x * Math.cos(alpha);
            //         mesh.content.position.y += mesh.direction.y * Math.cos(alpha);
            //         mesh.content.position.z += mesh.direction.z * Math.cos(alpha);

            //         const material: BABYLON.StandardMaterial = mesh.content.material as BABYLON.StandardMaterial;

            //         (f => f(f))((r: any) => (n: number) => i !== n ? (
            //             mesh.content.intersectsMesh(this.meshes[n].content, false) ?
            //                 true :
            //                 (n < this.meshes.length - 1 ? r(r)(n + 1) : false)
            //         ) : (n < this.meshes.length - 1 ? r(r)(n + 1) : false)
            //         )(0) ? material.diffuseColor = new BABYLON.Color3(1, 0, 0) : material.diffuseColor = new BABYLON.Color3(1, 1, 1);

            //         loop(i + 1);

            //     })() : undefined;

            // }

            // loop(0);

            this.scene.render();

        });

        window.addEventListener('resize', (): void => {
            this.engine.resize();
        });

    }

}

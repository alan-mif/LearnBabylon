export interface HoverEvent {
    topOffset: number,
    leftOffset: number,
    event: TouchEvent | MouseEvent
}

export class Listener {

    /** 监听目标 */
    public target: HTMLElement;

    /** 上次鼠标点击的坐标 */
    private _lastClickP: BABYLON.Vector2;
    /** 当前鼠标点击的坐标 */
    private _currentClickP: BABYLON.Vector2;

    /** 上次鼠标滑动的坐标 */
    private _lastHoverP: BABYLON.Vector2;
    /** 当前鼠标滑动的坐标 */
    private _currentHoverP: BABYLON.Vector2;

    /** 上次触摸的坐标 */
    private _lastTouchP: BABYLON.Vector2;
    /** 当前触摸的坐标 */
    private _currentTouchP: BABYLON.Vector2;

    /** 点击函数缓存 */
    private _clickCache: Set<Function>;
    /** 滑动函数缓存 */
    private _hoverCache: Set<Function>;
    /** resize 函数缓存 */
    private _resizeCache: Set<Function>;

    /**
     * 构造函数
     * @param target 监听目标
     */
    public constructor(target: HTMLElement) {

        this.target = target;

        this._clickCache = new Set();
        this._hoverCache = new Set();
        this._resizeCache = new Set();
        this._lastClickP = new BABYLON.Vector2();
        this._currentClickP = new BABYLON.Vector2();
        this._lastTouchP = new BABYLON.Vector2();
        this._currentTouchP = new BABYLON.Vector2();
        this._lastHoverP = new BABYLON.Vector2();
        this._currentHoverP = new BABYLON.Vector2();

        this._init();

    }

    /**
     * 添加点击函数
     * @param callback 
     */
    public addClick(callback: Function): void {
        this._clickCache.add(callback);
    }

    /**
     * 添加滑动函数
     * @param callback 
     */
    public addHover(callback: Function): void {
        this._hoverCache.add(callback);
    }

    /**
     * 添加 resize 函数
     * @param callback 
     */
    public addResize(callback: Function): void {
        this._resizeCache.add(callback);
    }

    /**
     * 点击执行
     * @param event 
     */
    private _click(event: MouseEvent): void {

        this._lastClickP = this._currentClickP.clone();
        this._currentClickP = new BABYLON.Vector2(event.screenX, event.screenY);
        this._clickCache.forEach((value: Function): void => value(event));

    }

    /**
     * 滑动执行
     * @param event 鼠标事件
     */
    private _hover(event: MouseEvent): void {

        this._lastHoverP = this._currentHoverP.clone();
        this._currentHoverP = new BABYLON.Vector2(event.screenX, event.screenY);
        this._hoverCache.forEach((value: Function): void => value(event));

    }

    /**
     * 触摸移动执行
     * @param event 触摸事件
     */
    private _touchMove(event: TouchEvent) {

        const target = event.targetTouches[0];

        this._currentTouchP.set(target.clientX,target.clientY);
        this._hoverCache.forEach((value: Function): void => value({
            topOffset: 1,
            leftOffset: 1,
            event: event
        }));

        this._lastTouchP = this._currentTouchP.clone();

    }

    /**
     * 窗口变化执行
     */
    private _resize(): void {
        this._resizeCache.forEach((value: Function): void => value());
    }

    /**
     * 初始化
     */
    private _init(): void {

        this.target.addEventListener('click', this._click.bind(this));
        this.target.addEventListener('mousemove', this._hover.bind(this));
        this.target.addEventListener('touchmove', this._touchMove.bind(this));
        window.addEventListener('resize', this._resize.bind(this));

    }

    /**
     * 获取上次点击坐标
     */
    public get lastClickP(): BABYLON.Vector2 {
        return this._lastClickP;
    }

    /**
     * 获取当前点击坐标
     */
    public get currentClickP(): BABYLON.Vector2 {
        return this._currentClickP;
    }

    /**
     * 获取上次滑动坐标
     */
    public get lastHoverP(): BABYLON.Vector2 {
        return this._lastHoverP;
    }

    /**
     * 获取当前滑动坐标
     */
    public get currentHoverP(): BABYLON.Vector2 {
        return this._currentHoverP;
    }

}
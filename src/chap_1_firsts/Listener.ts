export class Listener {

    /** 监听目标 */
    public target: HTMLElement;

    /** 上次鼠标点击的 x 坐标 */
    private _lastClickX: number;
    /** 上次鼠标点击的 y 坐标 */
    private _lastClickY: number;
    /** 当前鼠标点击的 x 坐标 */
    private _currentClickX: number;
    /** 当前鼠标点击的 y 坐标 */
    private _currentClickY: number;

    /** 上次鼠标移动的 x 坐标 */
    private _lastMoveX: number;
    /** 上次鼠标移动的 y 坐标 */
    private _lastMoveY: number;
    /** 当前鼠标移动的 x 坐标 */
    private _currentMoveX: number;
    /** 当前鼠标移动的 y 坐标 */
    private _currentMoveY: number;

    /** 点击函数缓存 */
    private _clickCache: Set<Function>;
    /** 移动函数缓存 */
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
        this._clickCache.forEach((value: Function): void => value(event));
    }

    /**
     * 滑动执行
     * @param event 
     */
    private _hover(event: MouseEvent): void {
        this._hoverCache.forEach((value: Function): void => value(event));
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
        window.addEventListener('resize', this._resize.bind(this));

    }

    /**
     * 获取上次点击 x 坐标
     */
    public get lastClickX(): number {
        return this._lastClickX;
    }

    /**
     * 获取上次点击 y 坐标
     */
    public get lastClickY(): number {
        return this._lastClickX;
    }

    /**
     * 获取上次滑动 x 坐标
     */
    public get lastHoverX(): number {
        return this._lastClickX;
    }

    /**
     * 获取上次滑动 y 坐标
     */
    public get lastHoverY(): number {
        return this._lastClickX;
    }

}
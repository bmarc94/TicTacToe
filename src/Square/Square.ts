
export class Square {
    private htmlEl: HTMLDivElement;
    private changeStateCallBacks: Function[] = [];
    private _symbol: string = null;

    constructor() {
        this.buildNode();
    }

    get el(): HTMLDivElement {
        return this.htmlEl;
    }
    set symbol(symbol: string) {
        if (!this._symbol) {
            this.htmlEl.innerHTML = symbol;
            this._symbol = symbol;
        }
    }

    get symbol(): string {
        return this._symbol; 
    }

    private buildNode():void {
        this.htmlEl = document.createElement('div');
        this.htmlEl.setAttribute('class', 'ticTacToeSquare');

        this.htmlEl.addEventListener('click', this.onClick.bind(this));

    }

    private onClick():void {
        if (!this._symbol) {
            this.changeStateCallBacks.map((callBack) => {
                callBack();
            })
        }
    }

    public addChangeStateCallBack(callBack: Function):void {
        this.changeStateCallBacks.push(callBack);
    }

    public light():void{
        this.htmlEl.setAttribute('class',"ticTacToeSquare light");
    }
}
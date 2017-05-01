export class Logger {
    private htmlEl: HTMLSpanElement = document.createElement('span');

    constructor(){

    }
    get el():HTMLSpanElement{
        return this.htmlEl;
    }

    public log(text:string):void{
        this.htmlEl.innerHTML = text;
    }
    public console(text:string):void{
        if (window.console && window.console.log){
            window.console.log(text);
        }
    }
}
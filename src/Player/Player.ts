export class Player {


    constructor(private _name: string, private _symbol: string) {

    }

    get symbol():string{
        return this._symbol;
    }

    get name():string{
        return this._name;
    }
}
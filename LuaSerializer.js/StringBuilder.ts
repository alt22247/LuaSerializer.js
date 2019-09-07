class StringBuilder {
    private _strings: string[];
    public constructor() {
        this._strings = new Array();
    }

    public append(value:string) {
        if (value != null && value != "") {
            this._strings.push(value);
        }
    }

    public clear() {
        this._strings = new Array();
    }

    public toString() {
        return this._strings.join("");
    }
}
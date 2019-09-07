class StringBuilder {
    constructor() {
        this._strings = new Array();
    }
    append(value) {
        if (value != null && value != "") {
            this._strings.push(value);
        }
    }
    clear() {
        this._strings = new Array();
    }
    toString() {
        return this._strings.join("");
    }
}
//# sourceMappingURL=StringBuilder.js.map
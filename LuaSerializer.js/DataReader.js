class DataReader {
    get lineNumber() {
        return this._lineNumber;
    }
    get linePosition() {
        return this._linePosition;
    }
    get cursor() {
        return this._cursor;
    }
    constructor(data) {
        this._cursor = 0;
        this._lineNumber = 1;
        this._linePosition = 1;
        this._data = data;
    }
    read() {
        if (this._cursor < this._data.length) {
            let current = this._data[this._cursor];
            this._cursor++;
            this._linePosition++;
            if (current == '\n' || (current == '\r' && this.peek() != '\n')) {
                this._lineNumber++;
                this._linePosition = 1;
            }
            if (current == '\t')
                this._linePosition += 3;
            return current;
        }
        return "";
    }
    peek(advance = 0) {
        let target = this._cursor + advance;
        if (target < this._data.length)
            return this._data[target];
        return "";
    }
}
//# sourceMappingURL=DataReader.js.map
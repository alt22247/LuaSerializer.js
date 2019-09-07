class DataReader {
    private _data: string;

    private _lineNumber: number;
    public get lineNumber(): number {
        return this._lineNumber;
    }

    private _linePosition: number;
    public get linePosition(): number {
        return this._linePosition;
    }

    private _cursor: number;
    public get cursor(): number {
        return this._cursor;
    }

    constructor(data: string) {
        this._cursor = 0;
        this._lineNumber = 1;
        this._linePosition = 1;
        this._data = data;
    }

    public read(): string {
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

    public peek(advance: number = 0): string {
        let target = this._cursor + advance;
        if (target < this._data.length)
            return this._data[target];

        return "";
    }
}
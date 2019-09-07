class ParseException extends Error {
    public type: string;
    public lineNumber: number;
    public linePosition: number;

    constructor(msg: string) {
        super(msg);

        this.type = "ParseException";
    }
}
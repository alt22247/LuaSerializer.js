class DataParser {
    static _initStatic() {
        this._validNumberChars = new Set(['.', '+', '-', 'e', 'x']);
        for (let c = 0; c <= 9; c++)
            this._validNumberChars.add(c.toString());
        for (let c = 97; c <= 122; c++)
            this._validNumberChars.add(String.fromCharCode(c));
        for (let c = 65; c <= 90; c++)
            this._validNumberChars.add(String.fromCharCode(c));
        this._escapeCharDict = {};
        this._escapeCharDict['a'] = '\a';
        this._escapeCharDict['b'] = '\b';
        this._escapeCharDict['f'] = '\f';
        this._escapeCharDict['n'] = '\n';
        this._escapeCharDict['r'] = '\r';
        this._escapeCharDict['t'] = '\t';
        this._escapeCharDict['v'] = '\v';
        this._escapeCharDict['\\'] = '\\';
        this._escapeCharDict['"'] = '"';
        this._escapeCharDict['\''] = '\'';
        this._escapeCharDict['['] = '[';
        this._escapeCharDict[']'] = ']';
    }
    constructor(data) {
        this._dataReader = new DataReader(data);
    }
    _skipSpaces(skipNewLine = false) {
        let c;
        while ((c = this._dataReader.peek()) != "") {
            if (c != ' ' && c != '\t') {
                if (!skipNewLine)
                    return;
                if (c != '\n' && c != '\r')
                    return;
            }
            this._dataReader.read();
        }
    }
    _skipSpacesAndComment() {
        this._skipSpaces(true);
        if (this._dataReader.peek() != '-' || this._dataReader.peek(1) != '-')
            return;
        this._dataReader.read();
        this._dataReader.read();
        let isCommentBlock = this._dataReader.peek() == '[' && this._dataReader.peek(1) == '[';
        if (isCommentBlock) {
            this._dataReader.read();
            this._dataReader.read();
        }
        let success = false;
        let c;
        while ((c = this._dataReader.read()) != "") {
            if (isCommentBlock) {
                if (c == '-' && this._dataReader.peek() == '-' &&
                    this._dataReader.peek(1) == ']' && this._dataReader.peek(2) == ']') {
                    for (let i = 0; i < 4; i++)
                        this._dataReader.read();
                    success = true;
                    break;
                }
            }
            else if (c == '\n' || c == '\r') {
                success = true;
                if (c == '\r' && this._dataReader.peek() == '\n')
                    this._dataReader.read();
                break;
            }
        }
        if (isCommentBlock && !success)
            throw new ParseException("Closing tag for comment not found");
        this._skipSpacesAndComment();
    }
    _readString() {
        let quote = this._dataReader.read();
        if (quote != '"' && quote != '\'')
            throw new ParseException(`String double quote expected but got ${quote}`);
        let startPosition = this._dataReader.cursor;
        let isEscaped = false;
        let sb = new StringBuilder();
        let c;
        while ((c = this._dataReader.read()) != "") {
            if (isEscaped) {
                if (DataParser._escapeCharDict.hasOwnProperty(c)) {
                    sb.append(DataParser._escapeCharDict[c]);
                }
                else if (!isNaN(parseInt(c))) {
                    let asciiSequence = c;
                    for (let i = 0; i < 2; i++) {
                        let r = this._dataReader.peek();
                        if (isNaN(parseInt(r)))
                            break;
                        asciiSequence += this._dataReader.read();
                    }
                    let ascii = parseInt(asciiSequence);
                    sb.append(String.fromCharCode(ascii));
                }
                else {
                    throw new ParseException(`Unreconized escape sequence ${c}`);
                }
                isEscaped = false;
            }
            else if (c == '\\') {
                isEscaped = true;
            }
            else {
                if (c == quote)
                    return sb.toString();
                if (c == '\r' || c == '\n')
                    break;
                sb.append(c);
            }
        }
        throw new ParseException(`Quote at ${startPosition - 1} was not closed`);
    }
    _readNumber() {
        let c;
        let numString = "";
        while ((c = this._dataReader.peek()) != "") {
            if (!DataParser._validNumberChars.has(c))
                break;
            numString += c;
            this._dataReader.read();
        }
        if (numString == "")
            throw new ParseException("No number read");
        let result = +numString;
        if (isNaN(result))
            throw new ParseException("Invalid number");
        return result;
    }
    _readBool() {
        let c = this._dataReader.peek();
        let expectedChars;
        let expectedResult;
        if (c == 't') {
            expectedChars = "rue";
            expectedResult = true;
        }
        else if (c == 'f') {
            expectedChars = "alse";
            expectedResult = false;
        }
        else {
            throw new ParseException("Invalid Character");
        }
        this._dataReader.read();
        let success = true;
        for (let expectedChar of expectedChars) {
            if (this._dataReader.peek() != expectedChar) {
                success = false;
                break;
            }
            this._dataReader.read();
        }
        if (!success)
            throw new ParseException("Error reading boolean");
        return expectedResult;
    }
    _readNil() {
        const expectedString = "nil";
        for (let i = 0; i < 3; i++) {
            let c = this._dataReader.peek();
            if (c != expectedString[i])
                throw new ParseException("Failed to read nil");
            this._dataReader.read();
        }
    }
    _readNaN() {
        const expectedString = "NaN";
        for (let i = 0; i < 3; i++) {
            let c = this._dataReader.peek();
            if (c != expectedString[i])
                throw new ParseException("Failed to read NaN");
            this._dataReader.read();
        }
    }
    _readTableMemberKeyAssignment() {
        let startPosition = this._dataReader.cursor;
        let c = this._dataReader.read();
        if (c != '[')
            throw new ParseException(`Expects table member open bracket but got ${c}`);
        let val = this._readKeyValue();
        this._skipSpacesAndComment();
        c = this._dataReader.read();
        if (c != ']')
            throw new ParseException(`Table member bracket at ${startPosition} is not closed`);
        this._skipSpacesAndComment();
        c = this._dataReader.read();
        if (c != '=')
            throw new ParseException(`= sign not found at ${this._dataReader.cursor}`);
        return val;
    }
    _readTable() {
        let startPosition = this._dataReader.cursor;
        let c = this._dataReader.read();
        if (c != '{')
            throw new ParseException(`Expects table open bracket but got ${c}`);
        let isSuccess = false;
        let result = {};
        while ((c = this._dataReader.peek()) != "") {
            this._skipSpacesAndComment();
            c = this._dataReader.peek();
            if (c == '}') {
                this._dataReader.read();
                isSuccess = true;
                break;
            }
            let key = this._readTableMemberKeyAssignment();
            let value = this._readValue();
            if (result.hasOwnProperty(key))
                throw new ParseException("Duplicate key on object");
            result[key] = value;
            this._skipSpacesAndComment();
            c = this._dataReader.peek();
            if (c == ',')
                this._dataReader.read();
            else if (c != '}')
                throw new ParseException("Separation comma expected");
        }
        if (!isSuccess)
            throw new ParseException(`Open bracket at ${startPosition} is not closed`);
        return result;
    }
    _readKeyValue() {
        let c = this._dataReader.peek();
        if (!isNaN(parseInt(c)) || c == '-') //number
            return this._readNumber();
        else if (c == '"' || c == '\'') //string
            return this._readString();
        else //better be bool
            return this._readBool();
    }
    _readValue() {
        this._skipSpacesAndComment();
        let c = this._dataReader.peek();
        if (c == '{') //table
         {
            return this._readTable();
        }
        else if (c == 'n') //nil
         {
            this._readNil();
            return null;
        }
        else if (c == 'N') //NaN
         {
            this._readNaN();
            return Number.NaN;
        }
        else {
            return this._readKeyValue();
        }
    }
    parse() {
        try {
            this._skipSpacesAndComment();
            if (this._dataReader.peek() == "")
                return null;
            let result = this._readValue();
            this._skipSpacesAndComment();
            if (this._dataReader.peek() != "")
                throw new ParseException("Extra tailing strings found");
            return result;
        }
        catch (ex) {
            if (ex.type == "ParseException") {
                ex.lineNumber = this._dataReader.lineNumber;
                ex.linePosition = this._dataReader.linePosition;
                throw ex;
            }
            else {
                let pe = new ParseException(ex);
                pe.lineNumber = this._dataReader.lineNumber;
                pe.linePosition = this._dataReader.linePosition;
                throw pe;
            }
        }
    }
}
DataParser._initStatic();
//# sourceMappingURL=DataParser.js.map
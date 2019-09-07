describe("TestString", function () {
    beforeAll(function () {
        TestBase.call(this);
    });

    it("StringBasic", function () {
        let result = this.serializer.deserialize("\"some random string\"");
        expect(result).toBe("some random string");
    });

    it("StringWithQuote", function () {
        let result = this.serializer.deserialize("\"String \\\"With\\\" Quote\"");
        expect(result).toBe("String \"With\" Quote");
    });

    it("StringNewLine", function () {
        let result = this.serializer.deserialize("\"\\r\"");
        expect(result).toBe("\r");
    });

    it("StringNewTab", function () {
        let result = this.serializer.deserialize("\"\\t\\t\"");
        expect(result).toBe("\t\t");
    });

    it("StringSingleQuote", function () {
        let result = this.serializer.deserialize("'\"'");
        expect(result).toBe("\"");
    });

    it("StringNestedQuote", function () {
        let result = this.serializer.deserialize("'123\"\\'\\'\"123'");
        expect(result).toBe("123\"''\"123");
    });

    it("StringEscapeBeforeQuote", function () {
        let result = this.serializer.deserialize("\"123\\\\\"");
        expect(result).toBe("123\\");
    });

    it("StringAsciiEscapeSequence", function () {
        let result = this.serializer.deserialize("\"\\9A\"");
        expect(result).toBe("\tA");

        result = this.serializer.deserialize("\"\\10A\"");
        expect(result).toBe("\nA");

        result = this.serializer.deserialize("\"\\049A\"");
        expect(result).toBe("1A");
    });

    it("StringCEscapeChars", function () {
        let result = this.serializer.deserialize("\"\\a\\b\\f\\n\\r\\t\\v\\\\\\\"\\'\\[\\]\"");
        expect(result).toBe("\a\b\f\n\r\t\v\\\"'[]");
    });

    it("StringExtraQuote", function () {
        expect(function () { this.serializer.deserialize("\" \"\""); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 4));
    });

    it("StringInvalidEndingQuote", function () {
        expect(function () { this.serializer.deserialize("\"123'"); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 6));
    });

    it("StringInvalidEndingQuote", function () {
        expect(function () { this.serializer.deserialize("\"'123\"'"); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 7));
    });
});
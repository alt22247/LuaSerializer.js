describe("TestNumber", function () {
    beforeAll(function () {
        TestBase.call(this);
    });

    it("NumberBasic", function () {
        let result = this.serializer.deserialize("123");
        expect(result).toBe(123);
    });

    it("NumberZero", function () {
        let result = this.serializer.deserialize("0");
        expect(result).toBe(0);

        result = this.serializer.deserialize("-0");
        expect(result).toBe(0);
    });

    it("NumberNegative", function () {
        let result = this.serializer.deserialize("-123");
        expect(result).toBe(-123);
    });

    it("NumberFloat", function () {
        let result = this.serializer.deserialize("12.567");
        expect(result).toBe(12.567);

        result = this.serializer.deserialize("-12.567");
        expect(result).toBe(-12.567);
    });

    it("NumberMax", function () {
        let result = this.serializer.deserialize(Number.MAX_SAFE_INTEGER.toString());
        expect(result).toBe(Number.MAX_SAFE_INTEGER);

        let resultFloat = this.serializer.deserialize("3.40282347E+38");
        expect(resultFloat).toBe(3.40282347E+38);

        let resultDouble = this.serializer.deserialize("1.7976931348623157E+308");
        expect(resultDouble).toBe(1.7976931348623157E+308);
    });

    it("NumberMin", function () {
        let result = this.serializer.deserialize(Number.MIN_SAFE_INTEGER.toString());
        expect(result).toBe(Number.MIN_SAFE_INTEGER);

        let resultFloat = this.serializer.deserialize("-3.40282347E+38");
        expect(resultFloat).toBe(-3.40282347E+38);

        let resultDouble = this.serializer.deserialize("-1.7976931348623157E+308");
        expect(resultDouble).toBe(-1.7976931348623157E+308);
    });

    it("NumberNaN", function () {
        let result = this.serializer.deserialize("NaN");
        expect(result).toBeNaN();
    });

    it("NumberLeadingZero", function () {
        let result = this.serializer.deserialize("012.567");
        expect(result).toBe(12.567);
    });

    it("NumberNegativeLeadingZero", function () {
        let result = this.serializer.deserialize("-012.567");
        expect(result).toBe(-12.567);
    });

    it("NumberHexUpper", function () {
        let result = this.serializer.deserialize("0x3BF");
        expect(result).toBe(959);
    });

    it("NumberHexLower", function () {
        let result = this.serializer.deserialize("0x3bf");
        expect(result).toBe(959);
    });

    it("NumberScientificNotion", function () {
        let result = this.serializer.deserialize("6.1234e4");
        expect(result).toBe(61234);

        result = this.serializer.deserialize("6.1234E4");
        expect(result).toBe(61234);

        result = this.serializer.deserialize("6.1234E+4");
        expect(result).toBe(61234);

        result = this.serializer.deserialize("6.1234e+4");
        expect(result).toBe(61234);

        result = this.serializer.deserialize("6123.1E-4");
        expect(result).toBe(0.61231);

        result = this.serializer.deserialize("6123.1E-4");
        expect(result).toBe(0.61231);
    });

    it("NumberInvalidNegative", function () {
        expect(function () { this.serializer.deserialize("-"); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 2));
    });

    it("NumberMultipleDecimalDot", function () {
        expect(function () { this.serializer.deserialize("123.123.123"); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 12));
    });
});
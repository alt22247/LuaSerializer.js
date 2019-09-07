describe("TestBasic", function () {
    beforeAll(function () {
        TestBase.call(this);
    });

    it("TabAndSpace", function () {
        let result = this.serializer.deserialize("   \t \t 123 \t \t");
        expect(result).toBe(123);
    });

    it("NewLine", function () {
        let result = this.serializer.deserialize("   \n \n \n 123 \n");
        expect(result).toBe(123);
    });

    it("EmptyObject", function () {
        let result = this.serializer.deserialize("{}");
        expect(result).toEqual({});
    });

    it("Null", function () {
        let result = this.serializer.deserialize("");
        expect(result).toBeNull();

        result = this.serializer.deserialize("   \t   \n    ");
        expect(result).toBeNull();
    });

    it("InvalidTailingComma", function () {
        expect(function () { this.serializer.deserialize("   \t \t 123 \t \t, "); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 27));
    });

    it("InvalidLeadingComma", function () {
        expect(function () { this.serializer.deserialize("  , \t \t 123 \t \t "); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 3));
    });

    it("UnreconizedChar", function () {
        expect(function () { this.serializer.deserialize("\a"); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 1));
    });
});
describe("TestBool", function () {
    beforeAll(function () {
        TestBase.call(this);
    });

    it("BoolBasic", function () {
        expect(this.serializer.deserialize("true")).toBeTruthy();
        expect(this.serializer.deserialize("false")).toBeFalsy();
    });

    it("BoolInvalidTrue", function () {
        expect(function () { this.serializer.deserialize("truee"); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 5));
    });

    it("BoolInvalidTrue2", function () {
        expect(function () { this.serializer.deserialize("trxe"); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 3));
    });

    it("BoolInvalidFalse", function () {
        expect(function () { this.serializer.deserialize("falsee"); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 6));
    });

    it("BoolInvalidFalse2", function () {
        expect(function () { this.serializer.deserialize("faxse"); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 3));
    });
});
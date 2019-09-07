describe("TestNil", function () {
    beforeAll(function () {
        TestBase.call(this);
    });

    it("NilBasic", function () {
        let result = this.serializer.deserialize("nil");
        expect(result).toBeNull();
    });

    it("NilUpper", function () {
        expect(function () { this.serializer.deserialize("NIL"); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(1, 2));
    });

    it("NilInDict", function () {
        let result = this.serializer.deserialize(`{
	                                                 [0] = 0,
	                                                 [1] = nil,
	                                                 [2] = 2
                                                 }`);
        expect(result).toEqual({ 0: 0, 1: null, 2: 2 });
    });
});
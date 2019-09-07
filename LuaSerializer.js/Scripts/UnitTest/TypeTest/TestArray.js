describe("TestArray", function () {
    beforeAll(function () {
        TestBase.call(this);
    });

    it("ArrayBasic", async function () {
        let content = await this.getLua();

        let result = this.serializer.deserialize(content);
        expect(result).toEqual({ [0]: 0, [1]: 1, [2]: 2 });
    });

    it("ArrayNull", function () {
        let result = this.serializer.deserialize("");
        expect(result).toBeNull();
    });

    it("ArrayEmpty", function () {
        let result = this.serializer.deserialize("{}");
        expect(result).toEqual({});
    });

    it("ArrayZeroBased", async function () {
        let content = await this.getLua();

        let result = this.serializer.deserialize(content);
        expect(result).toEqual({ 0: 0, 2: 1, 5: 2 });
    });

    it("ArrayOneBased", async function () {
        let content = await this.getLua();

        let result = this.serializer.deserialize(content);
        expect(result).toEqual({ 1: 0, 2: 1, 5: 2 });
    });

    it("ArrayInvalidComma", async function () {
        let content = await this.getLua();

        expect(function () { this.serializer.deserialize(content); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(3, 14));
    });
});
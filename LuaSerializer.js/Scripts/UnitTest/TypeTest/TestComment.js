describe("TestComment", function () {
    beforeAll(function () {
        TestBase.call(this);
    });

    it("CommentBasic", function () {
        let result = this.serializer.deserialize("-- random comment");
        expect(result).toBeNull();
    });

    it("CommentMultipleSingleLine", async function () {
        let content = await this.getLua();

        let result = this.serializer.deserialize(content);
        expect(result).toBe(123);
    });

    it("CommentBlock", async function () {
        let content = await this.getLua();

        let result = this.serializer.deserialize(content);
        expect(result).toBe(456);
    });

    it("CommentInsideBlock", async function () {
        let content = await this.getLua();

        let result = this.serializer.deserialize(content);
        expect(result).toBe(456);
    });

    it("CommentInsideLineComment", async function () {
        let content = await this.getLua();

        let result = this.serializer.deserialize(content);
        expect(result).toBe(456);
    });

    it("CommentInvalidNested", async function () {
        let content = await this.getLua();

        expect(function () {
            this.serializer.deserialize(content);
        }.bind(this))
            .toThrowMatching(this.makeExpectParseException(6, 1));
    });

    it("CommentOneDash", async function () {
        let content = await this.getLua();

        expect(function () {
            this.serializer.deserialize(content);
        }.bind(this))
            .toThrowMatching(this.makeExpectParseException(2, 5));
    });


});
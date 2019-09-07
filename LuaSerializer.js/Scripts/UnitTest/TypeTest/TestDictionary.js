describe("TestDictionary", function () {
    beforeAll(function () {
        TestBase.call(this);
    });

    it("DictionaryBasic", async function () {
        let content = await this.getLua();

        let result = this.serializer.deserialize(content);
        expect(result).toEqual({ 0: 0, 1: 1, 2: 2 });
    });

    it("DictionaryNested", async function () {
        let content = await this.getLua();

        let result = this.serializer.deserialize(content);
        expect(result).toEqual({
            "1": {
                "1.1": "1.1",
                "1.2": "1.2",
                "1.3":
                {
                    "1.3.1": "1.3.1",
                    "1.3.2": "1.3.2",
                    "1.3.3":
                    {
                        "1.3.3.1": "1.3.3.1"
                    }
                },
                "1.4": "1.4"
            },
            "2": "2"
        });
    });

    it("DictionaryDifferentType", async function () {
        let content = await this.getLua();

        let result = this.serializer.deserialize(content);
        expect(result).toEqual({
            "1" : 1,
            "2" : "2",
            3 : 3.14,
            4 : {},
            true : true,
            false : false
        });
    });

    it("DictionaryNoCloseBracket", async function () {
        let content = await this.getLua();

        expect(function () { this.serializer.deserialize(content); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(5, 1));
    });

    it("DictionaryDuplicateKey", async function () {
        let content = await this.getLua();

        expect(function () { this.serializer.deserialize(content); }.bind(this))
            .toThrowMatching(this.makeExpectParseException(4, 12));
    });
});
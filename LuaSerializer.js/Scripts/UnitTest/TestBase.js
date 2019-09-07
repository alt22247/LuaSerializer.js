function TestBase() {
    this.serializer = new LuaSerializer();

    this.makeExpectParseException = function (lineNumber, linePosition) {
        return function (ex) {
            return ex.type === "ParseException" && ex.lineNumber === lineNumber && ex.linePosition === linePosition;
        };
    };

    this.getLua = async function () {
        let tokens = TestBase.currentTest.split(' ');
        let result = await fetch(`/Scripts/UnitTest/LuaFiles/${tokens[0]}/${tokens[1]}.txt`);

        return await result.text();
    };
}

let reporter = {
    specStarted: function (result) {
        TestBase.currentTest = result.fullName;
    }
};
jasmine.getEnv().addReporter(reporter);
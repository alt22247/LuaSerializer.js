class LuaFiles {
    static initialize() {
        this._files = {};
    }
    static add(name, content) {
        if (this._files.hasOwnProperty(name))
            throw "duplicate key";
        this._files[name] = content;
    }
}
LuaFiles.get = function (name) {
    if (!this._files.hasOwnProperty(name))
        throw "lua file not found";
    return this._files[name];
};
LuaFiles.initialize();
//# sourceMappingURL=LuaFiles.js.map
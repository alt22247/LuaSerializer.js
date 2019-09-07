class LuaSerializer {
    deserialize(data) {
        if (data == null)
            return null;
        let parser = new DataParser(data);
        return parser.parse();
    }
}
//# sourceMappingURL=LuaSerializer.js.map
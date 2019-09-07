class LuaSerializer {
    public deserialize(data: string): any {
        if (data == null)
            return null;
        
        let parser = new DataParser(data);

        return parser.parse();
    }


}
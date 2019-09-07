LuaFiles.add("CommentMultipleSingleLine", `--Comment line 1  
123 --Comment line 2  
--Comment line 3`);
LuaFiles.add("CommentInsideBlock", `--[[
--[[
123
within comment
--[[
still comment
--]]
456
--[[
within comment 
--
still comment
--]]`);
LuaFiles.add("CommentInsideLineComment", `------------
------------
456
-----
-----------`);
LuaFiles.add("CommentInvalidNested", `--[[
--[[
123
within comment
--]]
still comment
--]]
456
--[[
within comment 
--
still comment
--]]
`);
LuaFiles.add("CommentOneDash", `--Good
-Bad
`);
//# sourceMappingURL=TypeTestComment.js.map
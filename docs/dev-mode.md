# 开发模式使用说明

## 新的开发脚本功能

新的 `yarn dev` 命令现在使用 `scripts/dev.ts` 提供了完整的开发模式支持：

### 主要功能

1. **自动监听文件变化**：使用 `tstl --watch` 监听 TypeScript 文件的变化
2. **增量编译**：只编译发生变化的文件，提高编译速度
3. **自动重新打包**：文件变化后自动重新生成 w3x 地图文件
4. **开发环境配置**：自动配置 `package.path` 指向 `dist` 目录，支持外部文件加载

### 使用方法

```bash
# 启动开发模式
yarn dev

# 停止开发模式（使用 Ctrl+C）
```

### 工作流程

1. **初始构建**：
   - 编译所有 TypeScript 文件到 Lua
   - 注入 Lua 执行调用到 `war3map.j`
   - 处理 `bootstrap.lua` 文件并配置开发环境
   - 打包生成 `dist/map.w3x` 文件

2. **监听模式**：
   - 监听 `src/` 目录下的 TypeScript 文件变化
   - 自动增量编译变化的文件
   - 重新处理 `bootstrap.lua`
   - 重新打包 w3x 文件

### 输出说明

```
>>> Starting development mode with watch...
>>> Performing initial build...
>>> Initial TypeScript to Lua compilation...
>>> Injected Lua execution call for bootstrap.lua into war3map.j
>>> Copied bootstrap.lua to maps/map/
>>> Updated bootstrap.lua to include package.path for dist/
>>> w2l build obj completed
>>> Initial build completed
>>> Starting TSTL watch mode...
>>> Development server started. Watching for changes...
>>> Press Ctrl+C to stop

[当文件变化时]
>>> File changed, rebuilding...
>>> Handling file change...
>>> Copied bootstrap.lua to maps/map/
>>> Updated bootstrap.path to include package.path for dist/
>>> w2l build obj completed
>>> File change handled, ready for next change...
```

### 开发环境特性

- **快速重新编译**：只编译变化的文件，不是完整重建
- **包路径配置**：`bootstrap.lua` 在开发模式下会自动添加项目路径到 `package.path`
- **优雅关闭**：支持 Ctrl+C 优雅停止监听进程

### 文件结构

```
dist/                     # 编译输出目录
├── src/                  # 编译后的 Lua 文件
│   ├── main.lua
│   ├── system/
│   ├── utils/
│   └── ...
├── lua_modules/          # 第三方库编译输出
├── lualib_bundle.lua     # Lua 库文件
└── map.w3x              # 最终地图文件

maps/map/
├── bootstrap.lua         # 引导脚本（开发模式下包含 package.path）
├── war3map.j            # 注入了 Lua 执行调用的 JASS 文件
└── ...                  # 其他地图文件
```

### 与旧版本的区别

- **旧版本** (`yarn dev:old`)：一次性构建，不监听文件变化
- **新版本** (`yarn dev`)：持续监听，自动重新编译和打包

### 故障排除

1. **端口占用**：如果出现端口占用错误，请检查是否有其他 TSTL watch 进程在运行
2. **权限问题**：确保对 `dist/` 和 `maps/` 目录有写权限
3. **路径问题**：检查 `config.json` 中的 `w2l.path` 配置是否正确

### 性能提示

- 在开发过程中，建议只保持必要的文件打开，减少不必要的文件变化
- 大型重构时可以暂时停止监听模式，完成后重新启动
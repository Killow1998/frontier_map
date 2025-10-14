import * as fs from 'fs';
import { buildW3x, compileTypeScriptToLua, injectLuaExecutionCall, handleBootstrapLua } from './common';

const luamin = require('luamin');

interface TsConfig {
  tstl: {
    luaBundle: string;
  };
}

interface Luamin {
  minify(code: string): string;
}

/**
 * 压缩 Lua 代码（生产模式）
 */
function minifyLua(): void {
  try {
    // 读取 tsconfig.json 的配置
    const tsconfigContent: string = fs.readFileSync("tsconfig.json", "utf-8");

    if (!tsconfigContent) {
      console.error("Failed to read tsconfig.json");
      return;
    }

    const tsconfig: TsConfig = JSON.parse(tsconfigContent);
    const luaFile: string = tsconfig.tstl.luaBundle;

    if (!fs.existsSync(luaFile)) {
      console.error(`Lua file not found: ${luaFile}`);
      return;
    }

    const rawContent: string = fs.readFileSync(luaFile, "utf-8");
    const minifiedContent: string = (luamin as Luamin).minify(rawContent);

    fs.writeFileSync(luaFile, minifiedContent);
    console.log(">>> Lua minification completed");
  } catch (error) {
    console.error("Error during Lua minification:", error);
    process.exit(1);
  }
}

/**
 * 构建项目
 */
function main(): void {
  console.log(`>>> Starting build process (production mode)`);

  try {
    // 1. 编译 TypeScript 到 Lua
    compileTypeScriptToLua();

    // 2. 注入 Lua 执行调用
    injectLuaExecutionCall();

    // 3. 处理 bootstrap.lua
    handleBootstrapLua(false);

    // 4. 压缩 Lua 代码（仅生产模式）
    minifyLua(); // 暂时禁用压缩

    // 5. 打包 w3x 文件
    buildW3x();

    console.log(">>> Build process completed");
  } catch (error) {
    console.error(">>> Error during build process:", error);
    process.exit(1);
  }
}

// 执行构建
main();
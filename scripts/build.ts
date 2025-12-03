import * as fs from 'fs';
import { buildW3x, compileTypeScriptToLuaProd, injectLuaExecutionCall, handleBootstrapLua } from './common';

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
    // 读取 tsconfig.prod.json 的配置
    const tsconfigContent: string = fs.readFileSync("tsconfig.prod.json", "utf-8");

    if (!tsconfigContent) {
      console.error("Failed to read tsconfig.prod.json");
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
 * 构建项目 (生产模式 - 单文件打包)
 */
function main(): void {
  console.log(`>>> Starting build process (production mode - bundled)`);

  try {
    // 编译 TypeScript 到 Lua (单文件打包)
    compileTypeScriptToLuaProd();

    // 注入 Lua 执行调用
    injectLuaExecutionCall();

    // 处理 bootstrap.lua (生产模式，不注入 PROJECT_PATH)
    handleBootstrapLua(false);

    // 压缩 Lua 代码（仅生产模式）
    // minifyLua(); // 可选启用

    // 打包 w3x 文件
    buildW3x();

    console.log(">>> Build process completed");
  } catch (error) {
    console.error(">>> Error during build process:", error);
    process.exit(1);
  }
}

// 执行构建
main();
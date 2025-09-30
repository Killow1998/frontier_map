
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
const luamin = require('luamin');

interface TsConfig {
  tstl: {
    luaBundle: string;
  };
}

interface Luamin {
  minify(code: string): string;
}

const argv: string[] = process.argv.slice(2);
const isDev: boolean = argv[0] === "dev";

//检查目录是否存在，如果不存在则创建
function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 递归复制文件夹
 */
function copyDir(src: string, dest: string): void {
  ensureDirectoryExists(dest);

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}


//打包w3x文件
export function buildW3x(): void {
  //读取config.json
  const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
  const w2lPath = config.w2l.path;
  if (!fs.existsSync(w2lPath)) {
    console.error(`w3x2lni not found in path: ${w2lPath}`);
    process.exit(1);
  }
  ensureDirectoryExists("dist");
  try {
    execSync(`"${w2lPath}/w2l.exe" obj ./maps/map ./dist/map.w3x`);
    console.log(">>> w2l build obj completed");
  } catch (error) {
    console.error("Error during w2l build obj:", error);
    process.exit(1);
  }

}


/**
 * 压缩 Lua 代码
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
 * 清理 temp 文件夹
 */
function cleanTempFolder(): void {
  if (fs.existsSync("temp")) {
    fs.rmSync("temp", { recursive: true, force: true });
    console.log(">>> Cleaned temp folder");
  }
}

/**
 * 准备源文件到 temp 文件夹
 */
function prepareSourceFiles(): void {
  try {
    // 清理并创建 temp 文件夹
    cleanTempFolder();
    ensureDirectoryExists("temp");

    // 复制项目的 src 文件
    console.log(">>> Copying project source files to temp folder...");
    copyDir("src", "temp");

    // 复制 wc3ts 的文件，但要避免覆盖项目文件
    console.log(">>> Merging @eiriksgata/wc3ts files to temp folder...");
    const wc3tsPath = "node_modules/@eiriksgata/wc3ts";
    if (fs.existsSync(wc3tsPath)) {
      mergeWc3tsFiles(wc3tsPath, "temp");
    } else {
      console.warn("Warning: @eiriksgata/wc3ts not found in node_modules");
    }

    console.log(">>> Source files preparation completed");
  } catch (error) {
    console.error("Error during source files preparation:", error);
    process.exit(1);
  }
}

/**
 * 合并 wc3ts 文件到 temp 目录，避免覆盖项目文件
 */
function mergeWc3tsFiles(wc3tsPath: string, tempPath: string): void {
  const entries = fs.readdirSync(wc3tsPath, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(wc3tsPath, entry.name);
    const destPath = path.join(tempPath, entry.name);

    // 跳过一些不需要的文件
    if (entry.name === 'package.json' || entry.name === 'README.md' ||
      entry.name === 'LICENSE' || entry.name === 'node_modules') {
      continue;
    }

    if (entry.isDirectory()) {
      // 如果目标目录不存在，直接复制整个目录
      if (!fs.existsSync(destPath)) {
        copyDir(srcPath, destPath);
      } else {
        // 如果目标目录存在，递归合并
        mergeWc3tsFiles(srcPath, destPath);
      }
    } else {
      // 只有当目标文件不存在时才复制（项目文件优先）
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

/**
 * 将 TypeScript 编译为 Lua
 */
function compileTypeScriptToLua(): void {
  try {
    console.log(">>> Starting TypeScript to Lua compilation...");
    execSync('tstl -p tsconfig.json', { stdio: 'inherit' });

    //TODO: 往maps/map/war3map.j  main 函数 最后一行 注入 call Cheat("exec-lua:main")
    //检测war3map.j是否存在
    const war3mapJPath = path.join("maps", "map", "war3map.j");
    if (fs.existsSync(war3mapJPath)) {
      let war3mapJContent = fs.readFileSync(war3mapJPath, "utf-8");
      //需要先检测是否有 call Cheat("exec-lua:main")
      if (war3mapJContent.includes('call Cheat("exec-lua:main")')) {
        console.log(">>> Lua execution call already injected in war3map.j, skipping.");
        return;
      }
      // 在 main 函数最后一行注入 call Cheat("exec-lua:main")
      const regex = /(function\s+main\s+takes\s+nothing\s+returns\snothing\s*\n)([\s\S]*?)(\nendfunction)/;
      const mainFunctionMatch = regex.exec(war3mapJContent);
      if (!mainFunctionMatch) {
        console.error(`Error: main function not found in ${war3mapJPath}, skipping injection.`);
        return;
      }
      const newContent = mainFunctionMatch[0].replace(/\nendfunction/, '\n    call Cheat("exec-lua:main")\nendfunction');
      war3mapJContent = war3mapJContent.replace(mainFunctionMatch[0], newContent);
      fs.writeFileSync(war3mapJPath, war3mapJContent);
      console.log(">>> Injected Lua execution call into war3map.j");
    } else {
      console.error(`Error: ${war3mapJPath} not found, skipping injection.`);
    }

    console.log(">>> TypeScript to Lua compilation completed");
  } catch (error) {
    console.error("Error during TypeScript compilation:", error);
    process.exit(1);
  }
}

/**
 * 构建项目
 */
function main(): void {
  console.log(`>>> Starting build process (${isDev ? 'development' : 'production'} mode)`);

  // 1. 准备源文件到 temp 文件夹
  //prepareSourceFiles();

  // 2. 编译 TypeScript 到 Lua
  compileTypeScriptToLua();

  // 3. 压缩 Lua 代码（生产模式）
  // if (!isDev) {
  //   minifyLua();
  // }

  // 4. 打包 w3x 文件
  buildW3x();

  // 5. 清理 temp 文件夹
  //cleanTempFolder();

  console.log(">>> Build process completed");
}

// 执行构建
main();
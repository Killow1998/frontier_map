import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * 公共工具函数
 * 供 build.ts 和 dev.ts 共享使用
 */

/**
 * 检查目录是否存在，如果不存在则创建
 */
export function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 递归复制文件夹
 */
export function copyDir(src: string, dest: string): void {
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

/**
 * 打包 w3x 文件
 */
export function buildW3x(): void {
  try {
    const projectRoot = path.resolve(__dirname, "../");
    // 读取config.json
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
    const w2lPath = config.w2l.path;

    if (!fs.existsSync(w2lPath)) {
      console.error(`>>> w3x2lni not found in path: ${w2lPath}`);
      return;
    }

    const mapsDir = path.join(projectRoot, "maps");
    const distDir = path.join(projectRoot, "dist");
    const mapW3xPath = path.join(distDir, "map.w3x");

    ensureDirectoryExists(distDir);
    // 使用绝对路径，避免调用时工作目录不一致导致 w2l 找不到 ./maps 或输出路径异常
    execSync(`"${w2lPath}/w2l.exe" obj "${mapsDir}" "${mapW3xPath}"`);
    console.log(">>> w2l build obj completed");
  } catch (error) {
    console.error(">>> Error during w2l build obj:", error);
  }
}

/**
 * 注入 Lua 执行调用到 war3map.j
 */
export function injectLuaExecutionCall(): void {
  try {
    const war3mapJPath = path.join("maps", "map", "war3map.j");

    if (!fs.existsSync(war3mapJPath)) {
      console.error(`>>> Error: ${war3mapJPath} not found, skipping injection.`);
      return;
    }

    let war3mapJContent = fs.readFileSync(war3mapJPath, "utf-8");
    const cheatCall = 'call Cheat("exec-lua:bootstrap")';
    const lineBreak = "(?:\\r\\n|\\n|\\r)";

    // Clean up previous injection locations first. Some maps contain mixed line endings.
    war3mapJContent = war3mapJContent.replace(
      new RegExp(`^[ \\t]*call Cheat\\("exec-lua:(?:main|bootstrap)"\\)[ \\t]*(?:\\r\\n|\\n|\\r)`, "gm"),
      ""
    );

    let injectedWhere: "before_run" | "end_of_main" = "end_of_main";

    const initRunPattern = new RegExp(
      `(^[ \\t]*call InitCustomTriggers\\(\\)${lineBreak})(^[ \\t]*call RunInitializationTriggers\\(\\))`,
      "m"
    );

    if (initRunPattern.test(war3mapJContent)) {
      injectedWhere = "before_run";
      war3mapJContent = war3mapJContent.replace(initRunPattern, (_match, initLine: string, runLine: string) => {
        const indent = (runLine.match(/^[ \t]*/) ?? ["    "])[0];
        const nl = (initLine.match(/(\r\n|\n|\r)$/) ?? ["\n"])[0];
        return `${initLine}${indent}${cheatCall}${nl}${runLine}`;
      });
    } else {
      const mainRegex = new RegExp(
        `(function\\s+main\\s+takes\\s+nothing\\s+returns\\s+nothing\\s*${lineBreak})([\\s\\S]*?)(${lineBreak}endfunction)`,
        "i"
      );
      const mainFunctionMatch = mainRegex.exec(war3mapJContent);

      if (!mainFunctionMatch) {
        console.error(`>>> Error: main function not found in ${war3mapJPath}, skipping injection.`);
        return;
      }

      const nl = (mainFunctionMatch[3].match(/^(\r\n|\n|\r)/) ?? ["\n"])[0];
      const newMainFunction = mainFunctionMatch[0].replace(
        new RegExp(`${lineBreak}endfunction$`),
        `${nl}    ${cheatCall}${nl}endfunction`
      );
      war3mapJContent = war3mapJContent.replace(mainFunctionMatch[0], newMainFunction);
    }

    fs.writeFileSync(war3mapJPath, war3mapJContent);
    if (injectedWhere === "before_run") {
      console.log(">>> Injected Lua execution call for bootstrap.lua into war3map.j (before RunInitializationTriggers)");
    } else {
      console.log(">>> Injected Lua execution call for bootstrap.lua into war3map.j (fallback: end of main)");
    }
  } catch (error) {
    console.error(">>> Error injecting Lua execution call:", error);
  }
}

/**
 * 处理 bootstrap.lua 文件
 * @param isDev 是否为开发模式
 */
export function handleBootstrapLua(isDev: boolean = false): void {
  try {
    const srcBootstrapPath = path.join("lua", "bootstrap.lua");
    const destBootstrapPath = path.join("maps", "map", "bootstrap.lua");

    if (!fs.existsSync(srcBootstrapPath)) {
      console.error(`>>> Error: Source bootstrap.lua not found at ${srcBootstrapPath}`);
      return;
    }

    // 确保目标目录存在
    ensureDirectoryExists(path.dirname(destBootstrapPath));

    // 复制 bootstrap.lua
    fs.copyFileSync(srcBootstrapPath, destBootstrapPath);
    console.log(">>> Copied bootstrap.lua to maps/map/");

    // 开发模式下修改 bootstrap.lua 添加 package.path
    if (isDev) {
      let bootstrapContent = fs.readFileSync(destBootstrapPath, "utf-8");
      const projectPath = path.resolve(__dirname, "../").replace(/\\/g, "/");
      const packagePathLine = `package.path = package.path .. ";${projectPath}/dist/?.lua;"\n`;

      // 给 bootstrap.lua 增加 运行的项目绝对路径
      const projectRuntimePath = `PROJECT_PATH = "${projectPath}/dist"\n`;

      // 检查是否已经添加了 package.path，避免重复添加
      if (!bootstrapContent.includes(packagePathLine.trim())) {
        bootstrapContent = packagePathLine + bootstrapContent;
        fs.writeFileSync(destBootstrapPath, bootstrapContent);
        console.log(">>> Updated bootstrap.lua to include package.path for dist/");
      }

      if (!bootstrapContent.includes(projectRuntimePath.trim())) {
        bootstrapContent = projectRuntimePath + bootstrapContent;
        fs.writeFileSync(destBootstrapPath, bootstrapContent);
        console.log(">>> Updated bootstrap.lua to include PROJECT_PATH variable");
      }



    }
  } catch (error) {
    console.error(">>> Error handling bootstrap.lua:", error);
  }
}


/**
 * 编译 TypeScript 到 Lua
 */
export function compileTypeScriptToLua(): void {
  try {
    console.log(">>> Starting TypeScript to Lua compilation...");
    execSync('tstl -p tsconfig.json', { stdio: 'inherit' });
    console.log(">>> TypeScript to Lua compilation completed");
  } catch (error) {
    console.error(">>> Error during TypeScript compilation:", error);
    throw error;
  }
}

/**
 * 编译 TypeScript 到 Lua (生产模式 - 单文件打包)
 */
export function compileTypeScriptToLuaProd(): void {
  try {
    console.log(">>> Starting TypeScript to Lua compilation (production mode - bundled)...");
    execSync('tstl -p tsconfig.prod.json', { stdio: 'inherit' });
    console.log(">>> TypeScript to Lua compilation (bundled) completed");
  } catch (error) {
    console.error(">>> Error during TypeScript compilation:", error);
    throw error;
  }
}


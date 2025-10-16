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
    // 读取config.json
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
    const w2lPath = config.w2l.path;

    if (!fs.existsSync(w2lPath)) {
      console.error(`>>> w3x2lni not found in path: ${w2lPath}`);
      return;
    }

    ensureDirectoryExists("dist");
    execSync(`"${w2lPath}/w2l.exe" obj ./maps ./dist/map.w3x`);
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

    // 检查是否已经注入
    if (war3mapJContent.includes('call Cheat("exec-lua:bootstrap")')) {
      console.log(">>> Lua execution call already injected in war3map.j, skipping.");
      return;
    }

    // 移除旧的 main 注入（如果存在）
    if (war3mapJContent.includes('call Cheat("exec-lua:main")')) {
      war3mapJContent = war3mapJContent.replace('call Cheat("exec-lua:main")', 'call Cheat("exec-lua:bootstrap")');
      fs.writeFileSync(war3mapJPath, war3mapJContent);
      console.log(">>> Updated Lua execution call to use bootstrap.lua");
      return;
    }

    // 在 main 函数最后一行注入 call Cheat("exec-lua:bootstrap")
    const regex = /(function\s+main\s+takes\s+nothing\s+returns\snothing\s*\n)([\s\S]*?)(\nendfunction)/;
    const mainFunctionMatch = regex.exec(war3mapJContent);

    if (!mainFunctionMatch) {
      console.error(`>>> Error: main function not found in ${war3mapJPath}, skipping injection.`);
      return;
    }

    const newContent = mainFunctionMatch[0].replace(/\nendfunction/, '\n    call Cheat("exec-lua:bootstrap")\nendfunction');
    war3mapJContent = war3mapJContent.replace(mainFunctionMatch[0], newContent);
    fs.writeFileSync(war3mapJPath, war3mapJContent);
    console.log(">>> Injected Lua execution call for bootstrap.lua into war3map.j");
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


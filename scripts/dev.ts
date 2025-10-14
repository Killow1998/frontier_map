import { spawn, ChildProcess } from 'child_process';
import { buildW3x, compileTypeScriptToLua, injectLuaExecutionCall, handleBootstrapLua } from './common';

/**
 * 开发模式脚本
 * 使用 TSTL watch 模式监听文件变化并自动重新编译
 */

// 全局变量
let tstlWatchProcess: ChildProcess | null = null;
let isInitialBuildComplete = false;

/**
 * 执行初始构建
 */
function performInitialBuild(): void {
  console.log(">>> Performing initial build...");
  
  try {
    // 1. 编译 TypeScript 到 Lua（一次性）初始编译
    console.log(">>> Initial TypeScript to Lua compilation...");
    compileTypeScriptToLua();
    
    // 2. 注入 Lua 执行调用
    injectLuaExecutionCall();
    
    // 3. 处理 bootstrap.lua（开发模式）
    handleBootstrapLua(true);
    
    // 4. 打包 w3x 文件
    buildW3x();
    
    console.log(">>> Initial build completed");
    isInitialBuildComplete = true;
  } catch (error) {
    console.error(">>> Error during initial build:", error);
    process.exit(1);
  }
}

/**
 * 启动 TSTL watch 模式
 */
function startTstlWatch(): void {
  console.log(">>> Starting TSTL watch mode...");
  
  // 启动 tstl --watch 进程
  tstlWatchProcess = spawn('tstl', ['--watch', '-p', 'tsconfig.json'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true
  });

  if (tstlWatchProcess.stdout) {
    tstlWatchProcess.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      console.log(output);
      
      // 检测编译完成的信号
      if (output.includes('Compilation completed') || output.includes('Found 0 errors')) {
        if (isInitialBuildComplete) {
          console.log(">>> File changed, rebuilding...");
          handleFileChange();
        }
      }
    });
  }

  if (tstlWatchProcess.stderr) {
    tstlWatchProcess.stderr.on('data', (data: Buffer) => {
      console.error(`TSTL Watch Error: ${data.toString()}`);
    });
  }

  tstlWatchProcess.on('close', (code: number) => {
    console.log(`>>> TSTL watch process exited with code ${code}`);
  });

  tstlWatchProcess.on('error', (error: Error) => {
    console.error(`>>> TSTL watch process error:`, error);
  });
}

/**
 * 处理文件变化事件
 */
function handleFileChange(): void {
  try {
    console.log(">>> Handling file change...");
    
    // 当文件发生变化时，dist/中的lua文件已经被更新
    // 只需要通知游戏重新加载即可，游戏内固定文件 lua/bootstrap.lua 会加载 dist/ 下的最新文件
    // 

    
    console.log(">>> File change handled, ready for next change...");
  } catch (error) {
    console.error(">>> Error handling file change:", error);
  }
}

/**
 * 清理资源
 */
function cleanup(): void {
  console.log(">>> Cleaning up...");
  
  if (tstlWatchProcess) {
    tstlWatchProcess.kill('SIGTERM');
    tstlWatchProcess = null;
  }
}

/**
 * 设置信号处理
 */
function setupSignalHandlers(): void {
  process.on('SIGINT', () => {
    console.log(">>> Received SIGINT, shutting down gracefully...");
    cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log(">>> Received SIGTERM, shutting down gracefully...");
    cleanup();
    process.exit(0);
  });
}

/**
 * 主函数
 */
function main(): void {
  console.log(">>> Starting development mode with watch...");
  
  // 设置信号处理
  setupSignalHandlers();
  
  // 1. 执行初始构建
  performInitialBuild();
  
  // 2. 启动 watch 模式
  startTstlWatch();
  
  console.log(">>> Development server started. Watching for changes...");
  console.log(">>> Press Ctrl+C to stop");
}

// 执行主函数
main();
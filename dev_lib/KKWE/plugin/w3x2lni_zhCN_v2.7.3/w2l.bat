@echo off
setlocal enabledelayedexpansion

REM 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"

REM 构建参数列表，将相对路径转换为绝对路径
set "ARGS="
:loop
if "%~1"=="" goto run

REM 检查参数是否像是一个路径（以 .\ 或 ..\ 或 / 或 盘符: 开头，或者包含 \ /）
set "PARAM=%~1"
set "IS_PATH=0"

REM 检查是否以 .\ 或 ..\ 开头
if "!PARAM:~0,2!"==".\" set "IS_PATH=1"
if "!PARAM:~0,3!"=="..\" set "IS_PATH=1"
if "!PARAM:~0,2!"=="./" set "IS_PATH=1"
if "!PARAM:~0,3!"=="../" set "IS_PATH=1"

REM 检查是否包含 \ 或 /（说明是路径）
echo !PARAM! | findstr /C:"\" /C:"/" >nul && set "IS_PATH=1"

REM 检查是否有扩展名（如 .w3x .txt 等，说明可能是文件名）
echo !PARAM! | findstr /R "\.[a-zA-Z0-9]*$" >nul && set "IS_PATH=1"

if "!IS_PATH!"=="0" (
    REM 不是路径，直接添加
    set "ARGS=!ARGS! "!PARAM!""
) else (
    REM 是路径，转换为绝对路径
    for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "$p='!PARAM!'; if([System.IO.Path]::IsPathRooted($p)){$p}else{[System.IO.Path]::GetFullPath((Join-Path (Get-Location) $p))}"`) do (
        set "ARGS=!ARGS! "%%i""
    )
)
shift
goto loop

:run
REM 调用 w2l-cli.exe
"%SCRIPT_DIR%w2l-cli.exe"%ARGS%

endlocal

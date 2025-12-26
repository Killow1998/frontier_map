@echo off
REM 使用 PowerShell 的 Resolve-Path 将第一个参数解析为绝对路径
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "Resolve-Path '%~1'"`) do (
    set ABS_PATH=%%i
)

REM 调用 cli.exe 并传入解析后的路径
cli.exe "%ABS_PATH%"

@echo off
cls

set /p insp=Inspect? (Y/N):

if "%insp%" equ "Y" goto launch-inspect

:launch
node .\buildDev -ll:5
exit

:launch-inspect
node --inspect .\buildDev -ll:5
exit
@echo off
cls

set /p insp=Inspect? (Y/N):

if "%insp%" equ "Y" goto launch-inspect

:launch
node --security-revert=CVE-2023-46809 .\buildDev\entry\mainEntry -ll=5
exit

:launch-inspect
node --inspect --security-revert=CVE-2023-46809 .\buildDev\entry\mainEntry -ll=5
exit
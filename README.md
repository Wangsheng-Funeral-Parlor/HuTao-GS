# HuTao-GS

![pc-fork](./pc-fork.jpg)
<!-- Source: https://www.kingarthurbaking.com/sites/default/files/styles/featured_image/public/blog-featured/lemon-zephyr-pancakes_0.jpg -->

>For support please join our [Discord](https://discord.gg/4tZ96QMvHq).

## HuTao-GS's current features

* Logging in
* Automaticly gives all characters
* Combat (a bit laggy)
* Spawning monsters

## Requirements ##

* [Node-Js](https://nodejs.org/en/)
* [Openssl](https://slproweb.com/products/Win32OpenSSL.html)
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Typescript](https://www.npmjs.com/package/typescript)
* [Tsc-Alias](https://www.npmjs.com/package/tsc-alias)

## Setup ##

* Download repository
* Install dependencies by running ```npm i```

## Building (Choose one) ##

## Build development ##
Run ```npm run build-dev```
## Build release(webpack) ##
Run ```npm run build-rel```
## Build release(executable) ##
Run ```npm run build```

## Resources ##

>Please complete the steps in Building before you continue.

## Generate Data ##

* Download [HuTao-GD](https://github.com/NotArandomGUY/HuTao-GD)
* Run ```npm run build```
* Put resources in ```./InputData/{version}/```
```bash
 Hutao-GD
├─InputData
│ └─X.X.X
│──├─BinOutput
│──├─ExcelBinOutput
│──└─Scripts
```
* Execute RunConvert.bat
* Copy ./OutputData/{version}/* -> (HuTaoGS)/data/game/{version}/

## Setup Protos ##

* Download HuTao-GD-Protos in [Discord/#resources](https://discord.com/invite/qGet4fdNAj)
* Put protos in ./data/proto/*
```bash
 Hutao-GS
├─data
│ └─Proto
│──├─X.X.X
│──├─ForceUpdateInfo.proto
│──├─PacketHead.proto
│──├─QueryCurrRegionHttpRsp.proto
│──├─QueryRegionListHttpRsp.proto
│──├─RegionInfo.proto
│──├─RegionSimpleInfo.proto
│──├─ResVersionConfig.proto
│──└─StopServerInfo.proto
```
## Running ##

>Please complete the steps in Resources before you continue.

* You need patch Metadata (Only for 3.0.0 and lower versions) You can patch it with in-console command

## Starting the server (Choose one) ##

## Starting development server ##
Start server by running ```START-DEV.bat```

## Starting release server(webpack) ##
Start server by running ```START-REL.bat```

## Starting release server(executable) ##
Start server by ```running HuTao-GS.exe``` ```(Located at ./dist directory)```

## Stopping ##

* Type ```stop``` in the server console then press enter to stop the server

>If you did not use the ```stop``` command to stop the server, any unsaved data will be lost.

## Connecting ##

## Method 1: Fiddler ##

* Download [Fiddler Classic](https://www.telerik.com/download/fiddler)
* Open Fiddler and go ```tools -> options -> https and Open Capture Https Connect then also open decrypt https traffic and Ignore server certificate errors then click Save Script```
* Then click ok
* Go to Fiddler Script then paste the script below into Fiddler Script

[Fiddler Script](https://hastebin.com/uzexudoyeq.js)

## Method 2: DNS (Recommended) ##

* Press Win+R
* Type ```ncpa.cpl```
* Press enter
* Right click on your network adapter
* Select Properties
* Inside This connection uses the following items select (TCP/IPv4) or (TCP/IPv6) depending on what you are using
* Click Properties
* Select Use the following dns server addresses
* Type the ip address in hostIp of ```config.json``` or ```127.0.0.1``` if hosting locally
* Press OK
* (Optional but recommended) Run ```ipconfig /flushdns```
* Have Fun!

>Remember to switch back to Obtain dns server address automatically after you are done playing.

## Install SSL Certificate ##

* Start the server
* Wait until certificates are generated
* Goto directory in ```sslDir``` of ```config.json``` or ```./ssl``` if you haven't changed it
* Open ```ca.crt```
* Click Install Certificate
* Select Local Machine
* Click Next
* Click Yes if a prompt popped up
* Select Place all certificates in the following store
* Click Browse
* Select Trusted Root Certification Authorities
* Click OK
* Click Next
* Click Finish

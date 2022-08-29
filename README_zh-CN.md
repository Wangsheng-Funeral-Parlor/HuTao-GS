# HuTao-GS

![pc-fork](./pc-forkk.jpg)
<!-- Source: https://raw.githubusercontent.com/crowity/HuTao-GS/master/pc-forkk.jpg -->

[EN](README.md) | [简中](README_zh-CN.md)

## 使用指南

**注意:** 如需帮助请加入官方 [Discord](https://discord.gg/4tZ96QMvHq).

## HuTao-GS 当前功能

* 登录
* 自动给予所有角色及物品
* 战斗
* 生成怪物

## 前期准备 ##

* [Node-Js](https://nodejs.org/en/)
* [Openssl](https://slproweb.com/products/Win32OpenSSL.html)
* [HuTao-GD](https://github.com/NotArandomGUY/HuTao-GD)
* HuTao-GS-Protos [Discord/#resources](https://discord.gg/4tZ96QMvHq).
* 准备相应版本的Resources文件

## 步骤概述 ##
* 1.安装所需软件
* 2.下载所需文件至本地
* 3.构建服务端
* 4.使用Resources生成data
* 5.将Proto放入HuTao-GS
* 6.运行服务端
* 7.安装自动生成的证书
* 8.设置代理（GC代理不适用于HuTao-GS）
* 9.开始游玩

**详细步骤请下载 HuTao-GS 打开 HuTao-GS/Docs/zh-cn/index.html 进行阅读！ **

## 快速问题排除 ##

* 如果编译服务端失败
      请检查 构建所需依赖 安装是否成功 可尝试重新安装
* 运行服务端后证书没有自动生成
      请确认 OpenSSL 的 bin 文件夹处于环境变量 `PATH` 中
* 客户端无法登录、连接、错误 4206 等其他问题
      可能是代理设置出现了*问题*

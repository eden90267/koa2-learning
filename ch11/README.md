# 開發debug

## 快速開始

### 環境

- node環境 7.x

### 啟動腳本

```sh
$ node --debug-brk --inspect index.js
```

指令框就會出現：

```sh
Debugger listening on port 9229.
Warning: This is an experimental feature and could change at any time.
To start debugging, open the following URL in Chrome:
    chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/a5deaa22-f64c-41a0-9972-e09b2d4db798

```

`chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/a5deaa22-f64c-41a0-9972-e09b2d4db798`
就是node.js連接chrome調試的連接，讓node.js代碼的調試和前端js代碼一樣。

![](http://i.imgur.com/GtYpkCN.png)
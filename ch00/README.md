# 前言

- ES6/7 帶來的變革

    自ES6確定和ES7的async/await開始普及，node.js的發展變得更加迅速，可以預見到JavaScript中令人"頭疼"的多層嵌套回調將會使用Promise + async/await的方式逐漸替代(並非完全替代，多層嵌套回調也有其特殊的應用場景)

- koa2 大勢所趨的前景

    基於async/await實現中間件體系的koa2框架將會是node.js web開發方向大勢所趨的普及框架。基於generator/yield的koa1將會逐漸被koa2替代，畢竟使用co.js來處理generator是一種過渡的方式，雖然有其特定的應用場景，但是async/await會更加優雅地實現同步寫法。

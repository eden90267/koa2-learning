# 靜態資源加載

## 原生koa2實現靜態資源服務器

### 前言

一個http請求訪問web服務靜態資源，一般響應結果有三種狀況

- 訪問文本，例如js、css、png、jpg、gif
- 訪問靜態目錄
- 找不到資源，拋出404錯誤

### 原生koa2靜態資源服務器例子

#### 代碼目錄

```
├── static # 靜態資源目錄
│   ├── css/
│   ├── image/
│   ├── js/
│   └── index.html
├── util # 工具代碼
│   ├── content.js # 讀取請求內容
│   ├── dir.js # 讀取目錄內容
│   ├── file.js # 讀取文件內容
│   ├── mimes.js # 文件類型列表
│   └── walk.js # 遍歷目錄內容
└── index.js # 啟動入口文件
```

*index.js*：

```

```
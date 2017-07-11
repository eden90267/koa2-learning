# ES7 Async Await

## Constructor of async：asyncFunction

了解async function的根本，最好透過async function的constructor，測試的回傳結果是，asyncFunction Object：

```
console.log(async function () {});
```

## Constructing Promise function

其實async/await是建立在Promise的基礎上。

每一個async的建立和每一個await的等待都是操作著Promises的小把戲：

```
const sleep = (para) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(para * para)
        }, 1000);
    })
};

(async () => {
    let result = await sleep(2);
    console.log(result); // result is 4
})();
```

## Constructing Async function

透過async function定義的function/Object就是一個回傳AsyncFunction的Object。

使用async處理非同步的Promise function，回傳的值其實是Resolve的值；相似的，async exception的結果和Promise Reject的結果也是一模一樣。

```
async function asyncSleep(para) {
    return await sleep(para);
}

asyncSleep(3).then((result) => console.log(result)); // result is 9
```

## Await Sequentially

```
(async () => {
    let result1 = await sleep(2);
    let result2 = await sleep(result1);
    let result3 = await sleep(result2);
    console.log(result3);
})();
```

## Await Parallelly

```
(async () => {
    let results = await Promise.all([sleep(1), sleep(2)]);
    console.log(results); // results is [1,4]
})();
```

## Nest

```
(async () => {
    for (let i = 0; i < 3; i++) {
        let result = await sleep(i);
        for (let j = 0; j < result; j++) {
            console.log(`i:${i}, j:${j}:`, await sleep(j));
        }
    }
})();
```

```
$ node test.js
i:1, j:0: 0
i:2, j:0: 0
i:2, j:1: 1
i:2, j:2: 4
i:2, j:3: 9
```

## Dynamic Async functions

想透過Promise來解決Dynamic運算的問題並不容易，往往需要改變策略或安裝其他Module。雖然Async/Await的功能強大，但是對處理Dynamic的問題也沒現成的解決方案。

目前的解決方法是，加入ES6的新功能map()，在儲存Promise function的同時把parameters也存起來，在需要執行時再進行呼叫：

```
const sleep = (para1, para2) => {
    let _para1 = para1, _para2 = para2 || para1;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(_para1 * _para2);
        }, 1000);
    })
};

let proMap = new Map();
proMap.set([1], sleep);
proMap.set([2, 3], sleep);
proMap.set([3], sleep);


(async () => {
    for (let [para, fun] of proMap.entries()) {
        let result = await fun.apply(this, para);
        console.log(para, result);
    }
})();

// [ 1 ] 1
// [ 2, 3 ] 6
// [ 3 ] 9
```

## Error handle

>錯誤處理的聲音實在安靜，安靜得聽不見(Nolan Lawson)

同媽生下的Async和Promise在處理Error Handling的行為上，完全是執行同一模式，程式都必須必包在try/catch內錯誤才能被捕獲。

```
const sleep = (para) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(para * para)
        }, 1000);
    })
};

const errorSleep = (para) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(' ErrorSleep');
        }, 1000);
    })
};

(async () => {
    let result1, result2, result3;
    try {
        result1 = await sleep(1);
        result2 = await errorSleep(4);
        result3 = await sleep(1);

        console.log('result1: ', result1);
        console.log('result2: ', result2);
        console.log('result3: ', result3);
    } catch (err) {
        console.log('err: ', err);
        console.log('result1: ', result1);
        console.log('result2: ', result2);
        console.log('result3: ', result3);
    }
})();
```

```
err:   ErrorSleep
result1:  1
result2:  undefined
result3:  undefined
```

## Summary

### 好處

async/await的貢獻在語法上為Javascript進行大優化，原本執行多行Promise程式簡化成一行，不僅僅提高程式的可讀性，也是為function programming量身訂造的設計。

### 壞處

Promise處理Dynamic Asynchronize沒問題沒有進步，只能透過叫迂迴的路，使用其他iterable方法分別儲存parameters和function。

Async/Await的另一個問題，錯誤處理的聲音實在太安靜，聽不見。

---

參考來源：

[[Javascript] ES7 Async Await 聖經](https://medium.com/@peterchang_82818/javascript-es7-async-await-%E6%95%99%E5%AD%B8-703473854f29-tutorial-example-703473854f29)
const sleep = (para) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(para * para)
        }, 1000);
    })
};

// (async () => {
//     let result = await sleep(2);
//     console.log(result); // result is 4
// })();

// async function asyncSleep(para) {
//     return await sleep(para);
// }

// asyncSleep(2).then((result) => console.log(result));

// (async () => {
//     let result1 = await sleep(2);
//     let result2 = await sleep(result1);
//     let result3 = await sleep(result2);
//     console.log(result3);
// })();

// (async () => {
//     let results = await Promise.all([sleep(1), sleep(2)]);
//     console.log(results); // results is [1,4]
// })();

(async () => {
    for (let i = 0; i < 3; i++) {
        let result = await sleep(i);
        for (let j = 0; j < result; j++) {
            console.log(`i:${i}, j:${j}:`, await sleep(j));
        }
    }
})();
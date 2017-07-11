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
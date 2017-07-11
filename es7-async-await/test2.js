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

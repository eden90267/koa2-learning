const fs = require('fs');
const getSqlContentMap = require('./util/get-sql-content-map');
const {query} = require('./util/db');


const eventLog = function (err, sqlFile, index) {
  if (err) {
    console.log(`[ERROR] sql腳本元件: ${sqlFile} 第${index + 1}條腳本 執行失敗 o(╯□╰)o ！`);
  } else {
    console.log(`[SUCCESS] sql腳本文件: ${sqlFile} 第${index + 1}條腳本 執行成功 O(∩_∩)O !`);
  }
};

// 獲取所有sql腳本內容
let sqlContentMap = getSqlContentMap();

// 執行建表sql腳本
const createAllTables = async () => {
  for (let key in sqlContentMap) {
    let sqlShell = sqlContentMap[key];
    let sqlShellList = sqlShell.split(';');

    for (let [i, shell] of sqlShellList.entries()) {
      if (shell.trim()) {
        let result = await query(shell);
        if (result.serverStatus * 1 === 2) {
          eventLog(null, key, i);
        } else {
          eventLog(true, key, i);
        }
      }
    }
  }
  console.log('sql腳本執行結束！');
  console.log('請按 ctrl + c 鍵退出！');
};

createAllTables();
const express = require('express');
const app = express();

const createTunnel = require('./createTunnel.js');
const shutdownTunnel = require('./shutdownTunnel.js');
const globalMap = new Map(); // 這是我們的全域 HashMap
//設定時間單位為毫秒
const expirationTime = 60000; // 過期時間設定為一分鐘
// const expirationTime = 10000; // (測試用)過期時間設定為10秒
const intervalTime = 30000; // 檢查間隔時間設定為三十秒

app.get('/internaltoken', (req, res) => {
    const name = req.query.name; // 將 req.query.name 當作 HashMap 的 key
    if(typeof name === 'undefined'|| name===null || name === undefined || name ===''  ){
      res.status(400).send('Bad Request');
      return;
    }
    const timestamp = Date.now(); // 將目前時間轉換為時間戳

    if (globalMap.has(name)) {
        // 如果 name 已經存在於 HashMap 中，更新 timestamp
        current_sequence = globalMap.get(name).sequence;

        globalMap.set(name, {
            "timestamp":timestamp,
            "sequence":current_sequence + 1    
        });

        console.log(globalMap.get(name));


        console.log(`使用者 ${name} 的 timestamp 已更新`);
        res.send(`使用者 ${name} 的 timestamp 已更新`);
    } else {
        // 如果 name 不存在於 HashMap 中，創建新的 entry
        globalMap.set(name, {
            "timestamp":timestamp,
            "sequence":0      
        });
        
        createTunnel.run();

        console.log(`使用者 ${name} 已存入`);
        res.send(`使用者 ${name} 已存入`);
    }
});
app.get('/getsequence', (req, res) => {
    const name = req.query.name; 
    if(typeof name === 'undefined'|| name===null || name === undefined || name ===''  ){
        res.status(400).send('Bad Request');
        return;
    }
    if (!globalMap.has(name)) {
        res.status(400).send('Null username');
        return;
    }

    console.log("/getsequence ：sequence是　"+ globalMap.get(name).sequence);
    // res.status(400).send(globalMap.get(name).sequence);
    res.send(globalMap.get(name).sequence.toString());

});

setInterval(() => {
    // 每 intervalTime 檢查 HashMap 中的每筆資料
    const now = Date.now();

    for (let [name, data] of globalMap) {
        // 如果資料的 timestamp 加上過期時間小於目前時間，則刪除該筆資料
        if (data.timestamp + expirationTime < now) {
            shutdownTunnel.run();
            globalMap.delete(name);
            console.log(`資料 ${name} 已過期並被刪除`);
        }
    }
}, intervalTime); // 每 intervalTime 執行一次檢查

app.listen(3344, () => {
    console.log('Server started on port 3344');
});

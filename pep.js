const express = require('express');
const app = express();

const globalMap = new Map(); // 這是我們的全域 HashMap
const expirationTime = 60000; // 過期時間設定為一分鐘
const intervalTime = 30000; // 檢查間隔時間設定為三十秒

app.get('/internaltoken', (req, res) => {
    const name = req.query.name; // 將 req.query.name 當作 HashMap 的 key
    const timestamp = Date.now(); // 將目前時間轉換為時間戳

    if (globalMap.has(name)) {
        // 如果 name 已經存在於 HashMap 中，更新 timestamp
        globalMap.get(name).timestamp = timestamp;
        res.send(`使用者 ${name} 的 timestamp 已更新`);
    } else {
        // 如果 name 不存在於 HashMap 中，創建新的 entry
        globalMap.set(name, {timestamp});
        res.send(`使用者 ${name} 已存入`);
    }
});

setInterval(() => {
    // 每 intervalTime 檢查 HashMap 中的每筆資料
    const now = Date.now();

    for (let [name, data] of globalMap) {
        // 如果資料的 timestamp 加上過期時間小於目前時間，則刪除該筆資料
        if (data.timestamp + expirationTime < now) {
            globalMap.delete(name);
            console.log(`資料 ${name} 已過期並被刪除`);
        }
    }
}, intervalTime); // 每 intervalTime 執行一次檢查

app.listen(3344, () => {
    console.log('Server started on port 3344');
});

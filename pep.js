const express = require('express');
const session = require('express-session');
const app = express();

var challenge = require('./challenge_fun.js');
const host = '127.0.0.1';
const port = process.env.PORT || 3344;


app.use(session({
    secret: challenge.get_128bits(), // 需要設定一個秘鑰
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000, // 設定 session 過期時間，此處設定為 1 分鐘
    }
}));

app.get('/internaltoken', (req, res) => {
    if(req.session.name && req.session.displayName) {
        // 如果 session 存在，則更新 token
        console.log("session update\n","name",req.session.name,"\n","displayName",req.session.displayName);
        req.session.touch();
    } else {
      console.log("session create\n","name",req.session.name,"\n","displayName",req.session.displayName);
        // 如果 session 不存在，創建一個並賦予 token
        req.session.name = req.query.name;
        req.session.displayName = req.query.displayName;
        res.send('Token 已創建:' + req.session.token);
    }
});

setInterval(function() {
    // 每 1 分鐘檢查 session 過期的用戶並向外部服務器發送通知
    for(let sessionId in session.Session.sessions) {
        let sessionObj = session.Session.sessions[sessionId];
        if(Date.now() > sessionObj.cookie.expires) {
            //刪除tunnel
            console.log("刪除TUNEEL");
        }
    }
}, 60000);

app.listen(3000, () => {
    console.log('Server started on port ',port);
});
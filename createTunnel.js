const { spawn } = require('child_process');



function run(){

    // 創建一個子進程來執行 'docker-compose up -d' 命令
    const child = spawn('docker-compose', ['up', '-d']);
    //(測試用)
    // const child = spawn('ping', ['8.8.8.8']);

    // 處理子進程的標準輸出
    child.stdout.on('data', (data) => {
    console.log(`子進程標準輸出：${data}`);
    });

    // 處理子進程的錯誤輸出
    child.stderr.on('data', (data) => {
    console.error(`子進程標準錯誤輸出：${data}`);
    });

    // 當子進程結束時的處理
    child.on('exit', (code, signal) => {
    console.log(`子進程退出，退出碼 ${code}，信號 ${signal}`);
    });

    // 下面的代碼將會在 'docker-compose up -d' 命令執行的同時立即執行
    console.log("這段代碼會在 'docker-compose up -d' 命令同時執行");
}

module.exports = {
    run: run
  };
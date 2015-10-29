// Создаёт 8 процессов. Сервер грузится из файла proxy.js
var cluster = require('cluster');
var numProc = 8;    // Количество процессов.

cluster.setupMaster({exec: __dirname + '/proxy.js'});

for (var i = 0; i < numProc; i++)
{
    cluster.fork();
}

cluster.on('exit', function(proxy, code, signal)
{
    console.log('proxy ' + proxy.process.pid + ' died');
});

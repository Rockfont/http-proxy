// Для использования запустить app.js и вписать прокси 127.0.0.1:7000
// в настройках браузера.
var http = require('http');
var url = require('url');
var fs = require('fs');

var path = 'log.txt'; // Файл для хранения логов.
// user_ - всё, что относится к пользователю.
// proxy_ - всё, что относится к прокси.

http.createServer(function(user_req, user_res)
{
  // Пишем лог запросов:
  var date = new Date();
  var logItem = "[" +
    date.getFullYear() + "-" +
    (date.getMonth()+1) + "-" +
    date.getDate() + " " +
    date.getHours() + ":" +
    date.getMinutes() + ":" +
    date.getSeconds() + "]" + " " +
    user_req.connection.remoteAddress + " " +
    user_req.method + " " +
    user_req.url + "\n";
  fs.appendFile(path, logItem, function(error) // Добавить запись в конец файла.
  {
    if(error)
    {
      console.error(error.message);
    }
    else
    {
      console.log("Лог успешно записан в " + path);
    }
  });
  // Парсинг запрашиваемого url:
  var user_url = url.parse(user_req.url, true);
  var proxy_url = url
  // Отправить запрос на хост:
  var proxy_req = http.request(user_url, function(res)
  {
    // console.log('Status: ' + res.statusCode);
  });
  proxy_req.end();
  // Перенаправить ответ хоста пользователю:
  proxy_req.on('response', function(proxy_res)
  {
    // Отправить заголовки пользователю:
    user_res.writeHead(proxy_res.statusCode, proxy_res.headers);
    // Отправить данные пользователю:
    proxy_res.on('data', function(chunk)
    {
      user_res.write(chunk);
    });
    // Завершение запроса:
    proxy_res.on('end', function()
    {
      user_res.end();
    });
  });
}).listen(7000, '127.0.0.1');

console.log("HTTP-proxy-server running at http://127.0.0.1:7000");

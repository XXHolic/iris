var http = require("http");
var url = require("url");
var router = require("./router");
var port = 9001;

var server = http.createServer(function(req, res) {
  if (req.url !== "/favicon.ico") {
    var pathname = url.parse(req.url).pathname; //得到请求的路径
    pathname = pathname.replace(/\//, ""); //替换掉前面的 /
    pathname = pathname?pathname:'index';
    console.log('pathname',pathname);
    router[pathname](req, res);
  } else {
      res.writeHead(302, {
        Location: "http://www.xholic.cn/favicon.ico"
      });
      res.end();
  }
});

server.listen(port);
console.log("The node server can run: http://localhost:9001");

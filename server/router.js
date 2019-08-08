module.exports = {
  index: function(req, res) {
    res.setHeader("Content-Type", "text/html;charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Headers","Content-Type,Content-Length,Authorization,Accept,X-Requested-With");
    // res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.writeHead(200, "ok");
    res.write("Hello Node Server");
    res.end();
  },
  getData: function(req, res) {
    var data = JSON.stringify({
      code: 200,
      data: {
        crossOrigin: true
      }
    });
    // res.setHeader("Content-Type", "text/html;charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,Content-Length,Authorization,Accept,X-Requested-With"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT,POST,GET,DELETE,OPTIONS"
    );
    res.writeHead(200, "ok");
    res.end(data);
  }
};

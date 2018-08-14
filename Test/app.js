const http = require("http");
const url = require("url");
const fs = require("fs");

http.createServer((req, res) => {
    let pathname = url.parse(req.url, true).pathname;
    fs.readFile('./index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
}).listen(5000, function() {
    console.log("Server is listening port 5000");
});

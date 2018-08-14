const http = require("http");
const url = require("url");

http.createServer((req, res) => {
    let pathname = url.parse(req.url, true).pathname;
    if (pathname === "/") {
        res.end("FINISH");
    }
}).listen(5000, function() {
    console.log("Server is listening port 5000");
});

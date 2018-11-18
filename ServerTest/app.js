const http = require("http");
const url = require("url");
const fs = require("fs");

http.createServer((req, res) => {
    let pathname = url.parse(req.url, true).pathname;
    let content;
    fs.readFile("./main.html", (err, data) => {
        this.content = data;
        if (pathname === "/") {
            res.end(this.content);
        }
    })
}).listen(5000, function() {
    console.log("Server is listening port 5000");
});
const http = require("http");
const url = require("url");
const fs = require("fs");
const pug = require("pug");

const test = require("./abc");

var token = null;

var mockClient = {
    client_id: "123456789",
    client_secret: "secret123456789"
};

var mockCode = "";

var sang = "";

http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);

    var pathname = url.parse(req.url, true).pathname;
    var urlLink = url.parse(req.url, true).query;

    // getUserProfile();
    if (pathname === "/") {
        fs.readFile("./view/login.html", (err, data) => {
            if (err) throw err;
            res.writeHead(200, {
                "Centent-Type": "text/html"
            });
            res.end(data);
        });
    }

    if (pathname == "/user") {
        pug.renderFile(
            "./view/user.pug",
            {
                sang: sang
            },
            (err, data) => {
                if (err) throw err;
                res.writeHead(200, {
                    "Centent-Type": "text/html"
                });
                res.write(data);
                res.end();
            }
        );
    }

    if (req.method === "GET" && pathname === "/loginOther") {
        let url =
            "http://localhost:3000/authorize?response_type=code" +
            "&client_id=" +
            mockClient.client_id +
            "&redirect_url=http://localhost:3003/code" +
            "&scope=age";
        res.writeHead(301, { Location: url });
        res.end();
    }

    if (pathname === "/code") {
        let mockCode = urlLink.code;
        function getUserProfile() {
            var options = {
                hostname: "localhost",
                port: 3000,
                path:
                    "/UserProfile?response_type=code" +
                    "&client_id=" +
                    mockClient.client_id +
                    "&redirect_url=http://localhost:3003/user",
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token + "dasdad",
                    "Content-Type": "application/json"
                }
            };

            var req = http.request(options, function(res) {
                res.setEncoding("utf8");
                res.on("data", function(body) {
                    sang = body;
                });
            });
            req.on("error", function(e) {
                console.log("problem with request: " + e.message);
            });
            // write data to request body
            req.end();
        }

        function getAccessToken() {
            let url =
                "http://localhost:3000/GetAccessToken?" +
                "client_id=" +
                mockClient.client_id +
                "&client_secret=" +
                mockClient.client_secret +
                "&grant_type=authorization_code" +
                "&code=" + mockCode +
                "&redirect_url=http://localhost:3003/waitToken";
            http.get(url, resp => {
                let data = "";

                // A chunk of data has been recieved.
                resp.on("data", chunk => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on("end", () => {
                    token = JSON.parse(data).access_token;
                });
            }).on("error", err => {
                console.log("Error: " + err.message);
            });
        }

        async function run() {
            await getAccessToken();
            setTimeout(function() {
                getUserProfile();
            },100)
        }
        run();
        res.writeHead(301, { Location: "http://localhost:3003/land" });
        res.end();
    }
    if (pathname === "/land") {
        fs.readFile("./view/landingpage.html", (err, data) => {
            if (err) throw err;
            res.writeHead(200, {
                "Centent-Type": "text/html"
            });
            res.end(data);
        });
    }
    if (pathname == "/waitToken") {
        fs.readFile("./view/waitToken.html", (err, data) => {
            if (err) throw err;
            res.writeHead(200, {
                "Centent-Type": "text/html"
            });
            res.end(data);
        });
    }
    if (pathname == "/profile") {
        pug.renderFile("./view/user.pug", { sang: sang }, (err, data) => {
            if (err) throw err;
            res.writeHead(200, {
                "Centent-Type": "text/html"
            });
            res.end(data);
        });
    }

    if (pathname == "/login") {
        fs.readFile("./view/login.html", (err, data) => {
            if (err) throw err;
            res.writeHead(200, {
                "Centent-Type": "text/html"
            });
            res.end(data);
        });
    }
}).listen(3003, function() {
    console.log("Server is listening port 3003");
});

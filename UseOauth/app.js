const http = require("http");
const url = require("url");
const fs = require("fs");
const pug = require("pug");
const qs = require("querystring");

var token = null;

var mockClient = {
    client_id: "123456789",
    client_secret: "secret123456789"
};

var mockCode = "";

var ageUser = "";

http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);

    let authorizationTxt = req.headers.Authorization;

    var pathname = url.parse(req.url, true).pathname;
    var urlLink = url.parse(req.url, true).query;
    function authorization(username) {
        if (username === "shiorsher@gmail.com") {
        }
    }
    // getUserProfile();
    if (pathname === "/") {
        pug.renderFile(
            "./view/home.pug",
            { statusLogin: "Login" },
            (err, data) => {
                if (err) throw err;
                res.writeHead(200, {
                    "Centent-Type": "text/html"
                });
                res.end(data);
            }
        );
    }

    if (pathname === "/user") {
        pug.renderFile(
            "./view/user.pug",
            {
                ageUser: ageUser
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

    if (req.method === "GET" && pathname === "/login-other") {
        let url =
            "http://localhost:3000/authorize?response_type=code" +
            "&client_id=" +
            mockClient.client_id +
            "&redirect_url=http://localhost:3003/code" +
            "&scope=age";
        res.statusCode = 302;
        res.setHeader("Location", url);
        // res.writeH(301, { Location: url });
        res.end();
    }

    if (pathname === "/code") {
        let mockCode = urlLink.code;

        function getAccessToken() {
            let url =
                "http://localhost:3000/get-access-token?" +
                "client_id=" +
                mockClient.client_id +
                "&client_secret=" +
                mockClient.client_secret +
                "&grant_type=authorization_code" +
                "&code=" +
                mockCode +
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

        function getUserProfile() {
            var options = {
                hostname: "localhost",
                port: 3000,
                path:
                    "/user-profile?response_type=code" +
                    "&client_id=" +
                    mockClient.client_id +
                    "&redirect_url=http://localhost:3003/user",
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json"
                }
            };

            var req = http.request(options, function(res) {
                res.setEncoding("utf8");
                res.on("data", function(body) {
                    ageUser = body;
                });
            });
            req.on("error", function(e) {
                console.log("problem with request: " + e.message);
            });
            // write data to request body
            req.end();
        }

        async function run() {
            await getAccessToken();
            setTimeout(function() {
                getUserProfile();
            }, 100);
            // getUserProfile();
        }
        run();
        // res.setHeader("Location", "http://localhost:3003/land");
        setTimeout(function() {
            res.writeHead(301, { Location: "http://localhost:3003/profile" });
            res.end();
        }, 100);
    }

    if (pathname === "/land") {
        pug.renderFile(
            "./view/home.pug",
            { fullName: ageUser },
            (err, data) => {
                if (err) throw err;
                res.writeHead(200, {
                    "Centent-Type": "text/html"
                });
                res.end(data);
            }
        );
    }

    if (pathname === "/profile") {
        pug.renderFile(
            "./view/home.pug",
            { fullName: ageUser, statusLogin: "Sign out" },
            (err, data) => {
                if (err) throw err;
                res.writeHead(200, {
                    "Centent-Type": "text/html"
                });
                res.end(data);
            }
        );
    }

    if (pathname === "/login" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
            if (body.length > 1e6) request.connection.destroy();
        });
        req.on("end", () => {
            inforLogin = qs.parse(body);
            const genToken = require("./Model/GenToken");
            const data = genToken.token(
                inforLogin.username,
                inforLogin.password
            );
            if (data) {
                res.statusCode = 200;
                res.end(data);
            } else {
                res.statusCode = 401;
                res.end("Username or password is not valid");
            }
        });
    }

    if (pathname === "/admin") {
        const token = req.headers.authorization;
        const jwt = require("jsonwebtoken");
        const tokenInfor = jwt.verify(token, "12345");
        if (
            tokenInfor.userName === "shiorsher@gmail.com" &&
            tokenInfor.role === "admin"
        ) {
            pug.renderFile("./view/admin/home.pug", (err, data) => {
                res.end(data);
            });
        }
    }
}).listen(3003, function() {
    console.log("Server is listening port 3003");
});

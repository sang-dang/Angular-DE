const http = require("http");
const url = require("url");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const qs = require("querystring");
const pug = require("pug");

var infor = {
    redirect_url: ""
};

var dbClients = [
    {
        id: 001,
        client_id: 123456789,
        redirect_url: "http://localhost:3003/code"
    },
    {
        id: 002,
        client_id: 987654321,
        redirect_url: "http://localhost:2222/code"
    }
];

var user1 = {
    username: "shiorsher@gmail.com ",
    password: "something",
    id: "",
    age: 22
};

var obj = {
    access_token: "",
    expire_in: 3600
};

var data = "";


http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);

    var urlLink = url.parse(req.url, true).query;
    var pathname = url.parse(req.url, true).pathname;

    //when app request impicit Post: code, codeId, code_secret
    if (pathname === "/") {
        pug.renderFile("./view/landingpage.pug", (err, html) => {
            if (err) throw err;
            res.end(html);
        });
    }

    if (req.method === "GET" && pathname === "/authorize") {
        let checkClients = require("./Model/CheckClient");
        let client_id = urlLink.client_id;
        let redirect_url = urlLink.redirect_url;
        let client = {
            nameClient: "Super Hero",
            linkClient:
                "http://localhost:3003"
        };
        if (checkClients(dbClients, client_id, redirect_url)) {
            pug.renderFile(
                "./view/authozrize.pug",
                { client: client },
                (err, html) => {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(html);
                }
            );
        } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("Wrong client");
        }
    }

    if (req.method === "POST" && pathname === "/authorize") {
        let action = urlLink.action;
        let body = "";
        req.on("data", chunk => {
            body += chunk; // convert Buffer to string
            if (body.length > 1e6) request.connection.destroy();
        });
        req.on("end", () => {
            userInfor = qs.parse(body);
            let checkLogin = require("./Model/checkLogin");
            if (checkLogin(userInfor.username, userInfor.password)) {
                let genCode = require("./Model/GenCode");
                let url = "http://localhost:3003/code" + "?code=" + genCode();
                res.statusCode = 302;
                res.setHeader("Location", url);
                res.end();
            } else {
                res.write(`<h1>Login fail</h1>
                <a href="http://localhost:3000">Home</a>`);
                res.end();
            }
        });
    }

    if (req.method === "GET" && pathname === "/get-access-token") {
        //param when app request
        let client_id = urlLink.client_id;
        let clien_secret = urlLink.client_secret;
        let grand_type = urlLink.grand_type;
        let code = urlLink.code;
        let redirect_url = urlLink.redirect_url;

        let generateToken = require("./Model/GenerateToken");

        let validateCode = require("./Model/ValidateCode");
        //check code, client_id......

        if (validateCode.code() && redirect_url === validateCode.client()) {
            //make access_token

            function getUserName() {
                return "shiorsher@gmail.com";
            }

            function randomString() {
                return crypto.randomBytes(16).toString("hex");
            }
            let str = randomString();

            user1.id = str;

            let payload = {
                username: "shiorsher@gmail.com",
                id: str
            };

            obj.access_token = jwt.sign(payload, "privatekey_demo");
        }

        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.write(JSON.stringify(obj));
        res.end();
    }

    if (req.method === "POST" && pathname == "/user-profile") {
        //check access_token in request header
        let grand_type = urlLink.grand_type;
        let client_id = urlLink.client_id;
        let redirect_url = urlLink.redirect_url;
        let authorization = "Bearer " + obj.access_token;

        if (req.headers.authorization === authorization) {
            let getUserName = require("./Model/GetUserName");
            res.end(getUserName());
        } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("wrong");
        }
    }

    if (pathname === "/redirect") {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
    }

    if (pathname === "/register") {
        //check access_token in request header
        if (req.method === "GET") {
            pug.renderFile("./view/registerClient.pug", (err, html) => {
                if (err) throw err;
                res.end(html);
            });
        }
        if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
                body += chunk; // convert Buffer to string
                if (body.length > 1e6) request.connection.destroy();
            });
            
            req.on("end", () => {
                let clientInfor = qs.parse(body);
                dbClients.push(clientInfor);
                pug.renderFile("./view/RegisterFinish.pug", {client_id: "123456789", client_secret: "secret123456789"}, (err, html) => {
                    res.end(html);
                })
            });
        }
    }
}).listen(3000, () => {
    console.log("Server is listening port 3000");
});

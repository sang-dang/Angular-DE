var http = require("http");
var url = require("url");
var fs = require("fs");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
var qs = require("querystring");

var infor = {
    redirect_url: ""
};

var user1 = {
    username: "shiorsher@gmail.com ",
    password: "something",
    id: "",
    age: 22
};

var client = {
    client_id: "cliet_id_1",
    clien_secret: "client_secret_1"
};

var obj = {
    access_token: "",
    expire_in: 3600
};

var data = "";

var clientInfor = {};

http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);

    var urlLink = url.parse(req.url, true).query;
    var pathname = url.parse(req.url, true).pathname;

    //when app request impicit Post: code, codeId, code_secret
    if(pathname==="/") {
        res.end("<h1>Landing page 3000</h1>");
    }

    if (req.method == "GET" && pathname == "/authorize") {
        infor.redirect_url = urlLink.redirect_url;
        fs.readFile("./view/authozrize.html", (err, html) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        });
    }

    if (req.method == "POST" && pathname === "/authorize") {
        let action = urlLink.action;
        if (action === "accept") {
            let genCode = require("./Model/genCode");
            let url = infor.redirect_url + "?code=" + genCode();
            res.writeHead(302, { Location: url });
            res.end();
        }
    }

    if (req.method === "GET" && pathname === "/GetAccessToken") {
        //param when app request
        let client_id = urlLink.client_id;
        let clien_secret = urlLink.client_secret;
        let grand_type = urlLink.grand_type;
        let code = urlLink.code;
        let redirect_url = urlLink.redirect_url;

        let generateToken = require("./Model/generateToken");

        let validateCode = require("./Model/validateCode");
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

    if (req.method === "POST" && pathname == "/UserProfile") {
        //check access_token in request header

        let grand_type = urlLink.grand_type;
        let client_id = urlLink.client_id;
        let redirect_url = urlLink.redirect_url;
        let authorization = "Bearer " + obj.access_token;
        if (req.headers.authorization === authorization) {
            let getUserAge = require("./Model/getUserAge");
            res.end(getUserAge());
        }
        else {
            res.writeHead(404, {"Content-Type":"text/html"});
            res.end("wrong");
        }
    }

    if (pathname === "/register") {
        //check access_token in request header
        if (req.method === "GET") {
            fs.readFile("./view/registerClient.html", (err, html) => {
                if (err) throw err;
                res.end(html);
            });
        }
        if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
                body += chunk; // convert Buffer to string
                if (body.length > 1e6)
                request.connection.destroy();
            });
            req.on("end", () => {
                clientInfor = qs.parse(body);
                console.log(clientInfor);
                console.log(clientInfor.appname);
                res.write(`<h1>Register success</h1>
                <a href="http://localhost:3000">Go to homepage</a>`);

                res.end();
            });
        }
    }
}).listen(3000, () => {
    console.log("Server is listening port 3000");
});

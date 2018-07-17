
exports.token = function(username, password) {
    //check in db
    const crypto = require("crypto");
    const jwt = require("jsonwebtoken");
    const hash = crypto.createHash("sha256");
    const infor = {
        userId: "AH1212",
        role: "admin",
        userName: "shiorsher@gmail.com"
    };
    if (username === "shiorsher@gmail.com") {
        hash.update(password);
        if (hash.digest("hex") === "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8") {
            return jwt.sign(infor, "12345");
        } else {
            return false;
        }
    } else {
        return false;
    }
};



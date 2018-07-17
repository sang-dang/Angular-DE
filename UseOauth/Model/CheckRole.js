module.exports = function(authorization, dbUser) {
    const jwt = require("jsonwebtoken");
    if (authorization) {
        authorization = authorization.replace("Bearer ", "");
        const userId = jwt.verify(authorization, "11223344");
    }
    //check db to validate and get role
    console.log(userId);

    if(userId==="11") {
        return "normal";
    }
    return "unauthentication"
};

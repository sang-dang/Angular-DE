var jwt = require('jsonwebtoken');

module.exports.getUser = function(access_token) {
    access_token_dec = jwt.verify(access_token, 'privatekey_demo');
    return access_token_dec.username;
}

module.exports.getId = function(access_token) {
    access_token_dec = jwt.verify(access_token, 'privatekey_demo');
    return access_token_dec.id;
}
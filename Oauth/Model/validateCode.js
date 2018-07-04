module.exports.client = function(client_id, client_secret) {
    return "http://localhost:3003/waitToken";
}

module.exports.code = function() {
    return true;
}
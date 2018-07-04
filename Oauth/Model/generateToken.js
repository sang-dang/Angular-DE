module.export = function(username, codeId, randomString) {
    var hashString = username + codeId + randomString;

    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');

    hash.update(hashString);

    return (hash.digest('hex'));
}
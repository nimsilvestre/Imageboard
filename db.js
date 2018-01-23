//database stuff here
const spicedPg = require('spiced-pg');
const db = spicedPg(`postgres:postgres:postgrespsql@localhost:5432/imageboard`);

module.exports.showImages = function() {
    const query = `
        SELECT * FROM images
        ORDER BY created_at DESC`;
    return db.query(query).then((results) => {
       return results.rows; //returning results!!
   }).catch((err) => { console.log('ERR WITH GETIMAGES', err); });
}

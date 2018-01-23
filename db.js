//DATABASE
const spicedPg = require('spiced-pg');
const db = spicedPg(`postgres:postgres:postgrespsql@localhost:5432/imageboard`);

module.exports.showImage = function() {
    const query = `
        SELECT * FROM images`;
    return db.query(query).then((results) => {
       return results.rows; //returning results!!
   }).catch((err) => { console.log('ERR WITH GETIMAGES', err); });
}

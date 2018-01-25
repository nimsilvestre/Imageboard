//database stuff here
const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:postgrespsql@localhost:5432/imageboard`);

//MODULE UPLOAD IMAGES
module.exports.uploadImages = function(image, username, title, description) {
    const query = `
        INSERT INTO images (image, username, title, description)
        VALUES ($1, $2, $3, $4)`;
    const params = [image, username, title, description];
    return db
        .query(query, params)
        .then(results => {
            //DB query
            console.log("Image upload working");
            return results.rows; //returning back image upload stuff!
        })
        .catch(err => {
            console.log("ERR WITH UPLOADIMAGES", err);
        });
};

//MODULE GET ALL IMAGES
module.exports.getAllImages = function() {
    const query = `
        SELECT * FROM images`;
    return db
        .query(query)
        .then(results => {
            //DB QUERY
            return results.rows; //returning results!!
        })
        .catch(err => {
            console.log("ERR WITH getAllImages in the module", err);
        });
};

//MODULE GET SINGLE IMAGE
module.exports.getSingleImage = function(id) {
    const query = `
        SELECT *
        FROM images
        WHERE id = $1`;
    const params = [id];
    return db
        .query(query, params)

};

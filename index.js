//MIDDLEWARES
console.log("LISTENING TO INDEX.JS");

const express = require("express");
const app = express();
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const db = require("./db.js");
const s3 = require("./s3.js");
const bodyParser = require("body-parser");
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

//STATIC
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

//MULTER STORAGE
const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads"); //null is waiting for an error in node, if theres no error, null will be ignored.
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            //uidSafe generate un unique name with 24 caracters
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//ROUTER UPLOAD IMAGE

app.post("/uploads", uploader.single("file"), (req, res) => {
    if (req.file) {
        db.uploadImages(
            req.file.filename,
            req.body.username,
            req.body.title,
            req.body.description
        );

            .then(() => {
                res.json({
                    success: true
                });
                console.log("image has been uploaded to the server");
            })
            .catch(err => {
                console.log("ERR IN UPLOAD TO AWS SERVER", err);
            });
    } else {
        console.log("trying to upload req.file FAIL", req.file);
        res.json({
            success: false
        });
    }
});

//ROUTER GET ALL IMAGES
app.get("/all-images", (req, res) => {
    //route
    //console.log('Get all images is working!');
    return db
        .getAllImages()
        .then(results => {
            //query to db
            res.json(results);
        })
        .catch(err => {
            console.log("ERR WITH GET ALL IMAGES", err);
        });
});

//ROUTER TO GET SINGLE Image
app.get("/single-image/:id", (req, res) => {
    return db.getSingleImage(req.params.id).then(results => {
        res.json({
            image: results.rows[0]
        });
    });
});

//ROUTER GET COMMENTS
/*app.get('/single-image/:id', (req, res, next) => {
    console.log('req.params', req.params.id)
    const imageId = req.params.id;
    Promise.all([
        db.getSingleImage(req.params.id),
        db.getComments(req.params.id).then((results) => {
            console.log('RESULTS OF GETCOMMENTS SERVER.JS', results);
            return results;})
    ]).then((results) => {
        return res.json(results);
        res.redirect('/#/');
    }).catch((err) => { console.log('ERR WITH PROMISE.ALL', err); })
});*/

//ROUTER TO POST COMMENTS
app.post("/comment", function(req, res) {
    addComment(req.body.comment, req.body.username, req.body.id)
        .then(function() {
            res.json({
                success: true
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});
app.listen(8080, () => console.log(`I'm listening.`));

const express = require("express");
const app = express();
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const db = require('./db.js');

//STATIC
app.use("/public", express.static(__dirname + "/public"));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//MULTER STORAGE
const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");  //null is waiting for an error in node, if theres no error, null will be ignored.
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {       //uidSafe generate un unique name with 24 caracters
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

//ROUTER

app.post('/upload', uploader.single('file'), function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        console.log('it worked: App post upload');
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

//ROUTER

app.get('/images', (req, res) => {
    return db.showImages().then((results) => {
        res.json(results); // "res.json is deprecated in a favour of res.status().json()"
    }).catch((err) => {
        console.log('ERR WITH GETIMAGES', err)
    })
});




//SERVER
app.listen(8080,() => console.log(`I'm listening.`));

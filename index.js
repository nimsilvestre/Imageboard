//MIDDLEWARES
console.log('LISTENING INDEX.JS');

const express = require("express");
const app = express();
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const db = require('./db.js');
const s3 = require('./s3.js');


//STATIC
app.use(express.static(__dirname + "/public"));

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
app.post('/uploads', uploader.single('file'), (req, res) => {
    if (req.file) {
        s3.upload(req.file).then(() => {
            db.showImage(req.file.filename, req.body.username, req.body.title, req.body.description)
            console.log('image uploaded! sucessfully to AWS!')
            res.redirect('/#/');
        }).catch((err) => { console.log('ERR IN UPLOAD TO AWS', err) })
    } else {
        console.log('trying to upload req.file FAIL', req.file)
        res.json({
            success: false
        });
    }
});


//ROUTER


//SERVER
app.listen(8080,() => console.log(`I'm listening.`));

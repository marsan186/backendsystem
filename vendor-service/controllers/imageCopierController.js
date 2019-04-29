var base64ToImage = require('base64-to-image');
var fs = require('fs-extra')

var validateFile = function (file, cb) {
    allowedFileTypes = /jpeg|jpg|png|gif/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);
    if (extension && mimeType) {
        return cb(null, true);
    } else {
        cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
    }
}

exports.uploadImage = function (req, res, next) {
    var base64Str = req.file;
    var path = './images/';
    if (!fs.existsSync(path)) {
        console.log('directory created');
        fs.mkdirSync(path);
    }
    fs.exists(req.file, (exists) => {
        if (exists) {
            console.log('file exists!!!');
        }
        else {
            return;
        }
    });
    /* var optionalObj = { 'fileName': req.user_name + Date.now(), 'type': 'jpg' };
    var imageInfo = base64ToImage(base64Str, path, optionalObj);
    res = process.cwd() + '\\images\\' + imageInfo['fileName'];
    return res; */
    res = process.cwd() + '\\images\\' + req.user_name + Date.now();
    require("fs").writeFile(res, base64Str, 'base64', function (err) {
        if (err)
            console.log(err);
        else {
            console.log(res);
        }
    });
    console.log('out'+res);
    return res;
}
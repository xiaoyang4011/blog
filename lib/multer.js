var multer = require('multer');
var moment = require('moment');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './upload');
	},
	filename: function (req, file, cb) {
		cb(null, moment() + file.originalname);
	}
});

var limits = {
	fieldSize : '100MB'
};

var upload = multer({
	storage : storage,
	limits : limits
});

module.exports = upload;

var multer = require('multer');
var moment = require('moment');
var upload = multer({
	dest : './upload',
	rename : function(filedname, filename){
		return filedname + '_' + filename + '_' + moment();
	}
});

module.exports = upload;

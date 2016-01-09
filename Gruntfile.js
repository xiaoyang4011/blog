module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: [
				'gruntfile.js',
				'controllers/*.js',
				'models/*.js',
				'routes/*.js',
				'test/*.js'
			],
			options: {
				globals: {
					exports: true
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default', ['uglify','concat','qunit','jshint']);
};

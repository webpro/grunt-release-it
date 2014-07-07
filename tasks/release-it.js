var release = require('release-it');

module.exports = function(grunt) {

    grunt.registerTask('release-it', 'Release repository.', function(increment) {

        var done = this.async();

        var options = this.options();

        options.increment = increment || options.increment;
        options.verbose = grunt.option('verbose') === true || options.verbose;
        options.debug = grunt.option('debug') === true || options.debug;
        options.force = grunt.option('force') === true || options.force;
        options['dry-run'] = grunt.option('no-write') === true || options['dry-run'];

        release.execute(options).catch(grunt.fail.warn).finally(done);

    });
};

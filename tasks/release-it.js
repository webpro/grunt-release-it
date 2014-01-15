var release = require('release-it');

module.exports = function(grunt) {

    grunt.registerTask('release-it', 'Release repository.', function(increment) {

        var done = this.async();

        var options = this.options({
            increment: increment,
            verbose: !!grunt.option('verbose'),
            debug: !!grunt.option('debug'),
            force: !!grunt.option('force'),
            'dry-run' : !!grunt.option('no-write')
        });

        release.execute(options).catch(grunt.fail.warn).finally(done);

    });
};

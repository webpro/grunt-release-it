var path = require('path'),
    release = require('./lib/release');

module.exports = function(grunt) {

    var lib = require('./lib/lib')(grunt),
        util = lib.util,
        git = lib.git;

    grunt.registerTask('release-it', 'Release repository.', function(increment) {

        var done = this.async();

        // Read/set options from task config

        var options = this.options({
            pkgFiles: ['package.json'],
            commitMessage: 'Release %s',
            tagName: '%s',
            tagAnnotation: '%s',
            distRepo: false,
            distStageDir: '.stage',
            distFiles: ['dist/**/*'],
            distBase: 'dist/',
            distBuildTask: false
        });

        // Additional settings

        var pkg = grunt.file.readJSON(options.pkgFiles[0]);

        options.srcDir = path.resolve('');
        options.srcRepo = pkg.repository.url;
        options.distStageDir = path.resolve(options.srcDir, options.distStageDir);
        options.version = util.incrementVersion(pkg.version, increment);

        var finished = function() {
            util.cd(options.srcDir);
            done();
        };

        var releaseSourceRepo = function(done) {

            grunt.log.subhead('Release source repo');

            options.pkgFiles.forEach(function(pkgFile) {
                util.bump(pkgFile, options.version);
                git.stage(pkgFile);
            });

            if(git.hasChanges()) {

                util.runBuild(options.distBuildTask);

                release(git, options, options.srcRepo, done);

            } else {

                finished();

            }

        };

        var releaseDistRepo = function() {

            if(!options.distRepo) {
                return;
            }

            grunt.log.subhead('Release distribution repo');

            git.clone(options.distRepo, options.distStageDir);

            util.copy(options.distFiles, options.distBase, options.distStageDir);

            options.pkgFiles.forEach(function(pkgFile) {
                util.bump(path.join(options.distStageDir, pkgFile), options.version);
            });

            util.cd(options.distStageDir);

            git.stageAll();

            if(git.hasChanges()) {

                release(git, options, options.distRepo, finished);

            } else {

                finished();

            }

        };

        releaseSourceRepo(releaseDistRepo);

    });
};

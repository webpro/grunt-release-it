var path = require('path'),
    fs = require('fs'),
    release = require('./lib/release');

module.exports = function(grunt) {

    var lib = require('./lib/lib')(grunt),
        util = lib.util,
        git = lib.git;

    grunt.registerTask('release-it', 'Release repository.', function(increment) {

        var options = this.options({
            pkgFiles: ['package.json'],
            bowerFile: 'bower.json',
            srcDir: path.resolve(''),
            distStageDir: '.stage',
            distRepo: false,
            distFiles: ['dist/**/*'],
            distBase: 'dist/',
            distBuildTask: false,
            commitMessage: 'Release %s',
            tagName: '%s',
            tagAnnotation: '%s'
        });

        var pkg = grunt.file.readJSON(options.pkgFiles[0]);

        options.distStageDir = path.resolve(options.srcDir, options.distStageDir);
        options.srcRepo = pkg.repository.url;
        options.version = util.incrementVersion(pkg.version, increment);

        var done = this.async();

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

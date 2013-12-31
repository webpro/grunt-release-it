var path = require('path'),
    when = require('when'),
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
        options.srcRepo = options.srcRepo ? options.srcRepo : pkg.repository && pkg.repository.url ? pkg.repository.url : null;
        options.distDir = path.resolve(options.srcDir, options.distStageDir);
        options.version = util.incrementVersion(pkg.version, increment);

        var releaseSourceRepo = function() {

            grunt.log.subhead('Release source repo');

            var releaseSource = when.defer();

            if(!options.srcRepo) {
                return releaseSource.reject({fail: 'Unable to read Git source repo from either the "srcRepo" task config or the repository.url property in ' + options.pkgFiles[0] + '.'});
            }

            options.pkgFiles.forEach(function(pkgFile) {
                util.bump(pkgFile, options.version);
                git.stage(pkgFile);
            });

            if(git.hasChanges()) {

                util.runBuild(options.distBuildTask);

                var releaseEnquiry = release(lib, options, 'src');

                releaseSource.resolve(releaseEnquiry);

            } else {

                releaseSource.reject({fail: 'No changes to release in Git source repository.'});

            }

            return releaseSource.promise;

        };

        var releaseDistRepo = function() {

            grunt.log.subhead('Release distribution repo');

            var releaseDist = when.defer();

            if(!options.distRepo) {
                return releaseDist.reject({log: 'No Git endpoint provided for distribution repository ("distRepo").'});
            }

            git.clone(options.distRepo, options.distDir);

            util.copy(options.distFiles, options.distBase, options.distDir);

            options.pkgFiles.forEach(function(pkgFile) {
                util.bump(path.join(options.distDir, pkgFile), options.version);
            });

            util.cd(options.distDir);

            git.stageAll();

            if(git.hasChanges()) {

                var releaseEnquiry = release(lib, options, 'dist').then(function() {
                    util.cd(options.srcDir);
                });

                releaseDist.resolve(releaseEnquiry);

            } else {

                releaseDist.reject({fail: 'No changes to release in Git distribution repository.'});

            }

            return releaseDist.promise;

        };

        var handleRejection = function(reason) {
            if('log' in reason) {
                grunt.log.writeln(reason.log);
            }
            if('fail' in reason) {
                grunt.fail.warn(reason.fail);
            }
        };

        releaseSourceRepo().then(releaseDistRepo).otherwise(handleRejection).ensure(done);

    });
};

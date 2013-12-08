var path = require('path'),
    fs = require('fs'),
    util = require('util'),
    shell = require('shelljs'),
    semver = require('semver');

module.exports = function(grunt) {

    var isDryRun = grunt.option('dry-run'),
        isForced = grunt.option('force');

    function run(command, options, message) {

        if(typeof options === 'string') {
            message = options;
            options = {silent: true};
        }

        if(isDryRun) {
            grunt.log.writeln('[DRYRUN] ' + command);
        } else {
            grunt.verbose.writeln('Running: ' + command);
            shell.exec(command, options);
            if(message) {
                grunt.log.ok(message);
            }
        }
    }

    function cd(path) {
        if(isDryRun) {
            grunt.log.writeln('[DRYRUN] cd ' + path);
        } else {
            grunt.file.setBase(path);
        }
    }

    var incrementVersion = function(currentVersion, increment) {
        increment = increment || 'patch';
        if(['major', 'minor', 'patch'].indexOf(increment) === -1) {
            return increment;
        } else {
            return semver.inc(currentVersion, increment || 'patch');
        }
    };

    function bump(file, version) {
        if(isDryRun) {
            grunt.log.writeln('[DRYRUN]', 'Version bump to', version);
        } else {
            if(grunt.file.exists(file)) {
                var pkg = JSON.parse(fs.readFileSync(file).toString());
                pkg.version = version;
                grunt.file.write(file, JSON.stringify(pkg, null, 2));
                grunt.log.ok('Version bumped to ' + version);
            } else {
                grunt.log.writeln('File not found:', file);
            }
        }
    }

    function runBuild(task) {
        var command = 'grunt ' + task;
        if(task) {
            run(command);
        }
    }

    function copy(files, base, dir) {
        var message = 'Copying ' + files + ' to ' + dir;
        if(isDryRun) {
            grunt.log.writeln('[DRYRUN]', message);
        } else {
            var reBase = new RegExp('^' + base.replace(/\/$/, '') + '/');
            files.forEach(function(source) {
                grunt.file.expand(source).forEach(function(expandedSource) {
                    if(grunt.file.isFile(expandedSource)) {
                        grunt.file.copy(path.join('.', expandedSource), path.join(dir, expandedSource.replace(reBase, '')));
                    }
                });
            });
            grunt.verbose.writeln(message);
        }
    }

    function ensureClean() {
        var command = 'git diff-index --name-only HEAD --exit-code';
        if(isDryRun) {
            grunt.log.writeln('[DRYRUN] ' + command);
        } else {
            shell.exec(command, {silent: true});
            if(shell.error()) {
                grunt.fail.warn('Repository must be clean.');
            }
        }
    }

    function hasChanges() {
        var command = 'git diff-index --name-only HEAD --exit-code';
        if(isDryRun) {
            grunt.log.writeln('[DRYRUN] ' + command);
            return true;
        } else {
            run(command);
            if(shell.error()) {
                return true;
            } else {
                grunt.fail.warn('Nothing to commit.');
                return isForced;
            }
        }
    }

    function clone(repo, dir) {
        shell.rm('-rf', dir);
        run('git clone ' + repo + ' ' + dir, 'Cloned ' + repo + ' into ' + dir);
    }

    function stage(path) {
        if(grunt.file.exists(path)) {
            run('git add ' + path);
        }
    }

    function stageAll() {
        run('git add . --all');
    }

    function status() {
        run('git status --short --untracked-files=no', {silent: false});
    }

    function commit(path, message, version) {
        var message = util.format(message, version);
        run('git commit ' + path + ' -m "' + message + '"', 'Committed changes with message: ' + message);
    }

    function tag(version, tag, annotation) {
        run('git tag' + (isForced ? ' -f' : '') + ' -a --message="' + util.format(annotation, version) + '" ' + util.format(tag, version));
    }

    function push(repository) {
        run('git push ' + repository, {silent: false});
        if(shell.error()) {
            grunt.fail.fatal('Unable to push to remote ' + repository);
        }
    }

    function pushTags(version) {
        run('git push --tags' + (isForced ? ' -f' : ''), 'Pushed tag ' + version + ' to remote');
    }

    return {
        util: {
            incrementVersion: incrementVersion,
            bump: bump,
            copy: copy,
            cd: cd,
            runBuild: runBuild
        },
        git: {
            status: status,
            clone: clone,
            stage: stage,
            stageAll: stageAll,
            commit: commit,
            tag: tag,
            push: push,
            pushTags: pushTags,
            ensureClean: ensureClean,
            hasChanges: hasChanges
        }
    }
};

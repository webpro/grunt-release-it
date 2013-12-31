var inquirer = require('inquirer'),
    when = require('when');

module.exports = function(lib, options, subject) {

    var enquiry = when.defer(),
        util = lib.util,
        git = lib.git,
        repo = options[subject + 'Repo'],
        dir = options[subject + 'Dir'];

    inquirer.prompt([{
        type: 'confirm',
        name: 'status',
        message: 'Show updated files?',
        default: false
    }, {
        type: 'confirm',
        name: 'commit',
        message: 'Commit?',
        default: true,
        when: function(answers) {
            if(answers.status) {
                git.status();
            }
            return true;
        }
    }, {
        type: 'confirm',
        name: 'tag',
        message: 'Tag version ' + options.version + '?',
        default: true,
        when: function(answers) {
            if(answers.commit) {
                git.commit('.', options.commitMessage, options.version);
            }
            return answers.commit;
        }
    }, {
        type: 'confirm',
        name: 'push',
        message: 'Push to ' + repo + '?',
        default: true,
        when: function(answers) {
            if(answers.tag) {
                git.tag(options.version, options.tagName, options.tagAnnotation);
            }
            return answers.commit;
        }
    }, {
        type: 'confirm',
        name: 'publish',
        message: 'Publish to npm?',
        default: false,
        when: function(answers) {
            if(answers.push) {
                git.push(repo);
                git.pushTags(options.version);
            }
            return (subject === 'src' && !options.distRepo) || (subject === 'dist' && !!options.distRepo);
        }
    }], function(answers) {
        if(answers.publish) {
            util.npmPublish(dir);
        }
        enquiry.resolve();
    });

    return enquiry.promise;

};

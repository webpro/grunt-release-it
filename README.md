# Grunt Release It!

Interactive release task for Git repositories. Optionally release a build to distribution/component repository.

Automatically increments version in package.json, commit, tag, push, done.

## Getting Started

This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-release-it --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-release-it');
```

## The "release-it" task

### Configuration

In your project's Gruntfile, add a section named `release-it` to the data object passed into `grunt.initConfig()`. These are the options with their default values:

```js
grunt.initConfig({
    'release-it': {
        options: {
            pkgFiles: ['package.json'],
            commitMessage: 'Release %s',
            tagName: '%s',
            tagAnnotation: 'Release %s'
        }
    }
});
```

If you also want to release to "distribution repo", you'll need to provide the `distRepo` as well. Here are the _additional_ options with their default values:

```js
grunt.initConfig({
    'release-it': {
        options: {
            distRepo: false,
            distStageDir: '.stage',
            distFiles: ['dist/**/*'],
            distBase: 'dist',
            distBuildTask: false
        }
    }
});
```

You must set `distRepo` to a git endpoint (e.g. `'git@github.com:webpro/awesome-component.git'`).

### What it does

The version in each of the `pkgFiles` will be incremented (see [usage](#usage)), and committed with the `commitMessage`. It tags the commit `tagName` (and `tagAnnotation`). The `%s` will be replaced with the updated version.

The plugin will create the distribution build using the `distBuildTask` Grunt task. The `distStageDir` is where the plugin will clone the `distRepo`, and afterwards copies the `distFiles` into (normalized by removing the `distBase` from the target path).

### Usage

Make a "patch" release (increments the 0.0.x):

```shell
grunt release-it
```

Make a patch, minor, major or specific version release with e.g.:

```shell
grunt release-it:minor
grunt release-it:0.8.3
grunt release-it:2.0.0-rc.3
```

You can also do a dry run, which won't write/touch anything, but does output the commands it would execute, and shows the interactivity:

```shell
grunt release-it --dry-run
```

The Grunt option `--verbose` gives verbose output for this task.

### Example Output

```
$ grunt release-it
Running "release-it" task

Release source repo
>> Version bumped to 0.3.25
Running "build" (copy) task

Done, without errors.
[?] Show updated files? Yes
M  package.json
[?] Commit? Yes
>> Committed changes with message: Release 0.3.25
[?] Tag version 0.3.25? Yes
[?] Push to git@github.com:webpro/awesome.git? Yes
To git@github.com:webpro/awesome.git
   0081f9a..eb54244  master -> master
>> Pushed tag 0.3.25 to remote

Release distribution repo
>> Cloned git@github.com:webpro/awesome-component.git into /Users/lars/Projects/awesome/.stage
>> Version bumped to 0.3.25
[?] Show updated files? Yes
M  package.json
[?] Commit? Yes
>> Committed changes with message: Release 0.3.25
[?] Tag version 0.3.25? Yes
[?] Push to git@github.com:webpro/awesome-component.git? Yes
To git@github.com:webpro/awesome-component.git
   2b0f6b8..019d616  master -> master
>> Pushed tag 0.3.25 to remote

Done, without errors.
```

## Credits

This plugin uses [ShellJS](http://documentup.com/arturadib/shelljs) and [Inquirer.js](https://github.com/SBoudrias/Inquirer.js), two awesome projects that you need to check out anyway.

The following plugins have been a big source of inspiration:

* [grunt-release](https://github.com/geddski/grunt-release)
* [grunt-release-component](https://github.com/walmartlabs/grunt-release-component)

Why did I need to create yet another "release" plugin? The first misses the feature to release to a separate distribution repository, while the second does only that. This plugin supports both scenarios, and gives you a more control/insight to what's going on by providing interactivity.

## Todo/Ideas

* Option to publish to npm
* Option to disable interactivity
* Tests?!
* ...?

## License

[MIT](http://webpro.mit-license.org/)

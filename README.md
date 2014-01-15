# Grunt Release It!

Interactive release task for Git repositories. Optionally release a build to distribution/component repository. Publish to npm.

Automatically increments version in package.json, commit, tag, push, publish, done.

Grunt plugin for the stand-alone [Release It!](https://github.com/webpro/release-it)

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

See the [Release It!](https://github.com/webpro/release-it#release-it) for configuration options.

### Configuration

In your project's Gruntfile, add a section named `release-it` to the data object passed into `grunt.initConfig()`. These are the options with their default values:

```js
grunt.initConfig({
    'release-it': {
        options: {
            pkgFiles: ['package.json'],
            commitMessage: 'Release %s',
            tagName: '%s',
            tagAnnotation: 'Release %s',
            buildCommand: false
        }
    }
});
```

If you also want to release to "distribution repo", you'll need to provide the `distRepo` as well. Here are the _additional_ options with their default values:

```js
options: {
    distRepo: false,
    distStageDir: '.stage',
    distFiles: ['dist/**/*'],
    distBase: 'dist',
    publish: false
};
```

You must set `distRepo` to a git endpoint (e.g. `'git@github.com:webpro/awesome-component.git'`).

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

The Grunt options `-v`/`--verbose`, `-f`/`--force`, and `-d`/`--debug` or passed as-is, while `--no-write` is passed as `--dry-run` to Release It!

## License

[MIT](http://webpro.mit-license.org/)


![Analytics](https://ga-beacon.appspot.com/UA-17415234-3/grunt-release-it/readme?pixel)

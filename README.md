# Grunt Release It!

Interactive release tool for Git repositories. Options: run build command first, release to distribution repository (or branch), create GitHub release, publish to npm.

Automatically bump version, commit, tag, push, done.

This is the Grunt plugin of [Release It!](https://github.com/webpro/release-it)

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

See [Release It!](https://github.com/webpro/release-it) for [configuration options](https://github.com/webpro/release-it#configuration).

### Configuration

In your project's Gruntfile, add a section named `release-it` to the data object passed into `grunt.initConfig()`. These are some of the options with their default values:

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

### Usage

Release a new patch (increments from e.g. `1.0.4` to `1.0.5`):

```shell
grunt release-it
```

Release a patch, minor, major, or specific version:

```shell
grunt release-it:minor
grunt release-it:0.8.3
grunt release-it:2.0.0-rc.3
```

Make sure to check out the main [Release It](https://github.com/webpro/release-it) documentation to learn about all the options and features.

### Translated options

The following Grunt options are passed on to Release It:

Grunt option | Release-It! option
---|---
`--no-write` | `--dry-run`
`-v`/`--verbose` | _same_
`-f`/`--force` | _same_
`-d`/`--debug` | _same_

## License

[MIT](http://webpro.mit-license.org/)

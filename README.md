#[gulp](https://github.com/gulpjs/gulp)-json-to-yaml

> A [Gulp](https://github.com/gulpjs/gulp) plugin to convert [JSON](http://en.wikipedia.org/wiki/JSON) to[YAML](http://en.wikipedia.org/wiki/YAML) using [js-yaml](https://github.com/nodeca/js-yaml).


## Install

```sh
npm install --save-dev gulp-json-to-yaml
```

## Usage

```js
var jsonToYaml = require('gulp-json-to-yaml');

gulp.src('./src/*.json')
  .pipe(jsonToYaml())
  .pipe(gulp.dest('./dist/'))

gulp.src('./src/*.json')
  .pipe(jsonToYaml({ safe: true}))
  .pipe(gulp.dest('./dist/'))

```


## API

### jsonToYaml([options])



#### options.safe

Type: `Boolean`

Default: `true`

Enable or disable support for regexps, functions and undefined.

**This flag should always be enabled when working with untrusted data.**

When this flag is enabled then [safeDump] method is used, otherwise [dump].
The options object is passed on to js-yaml methods.
See [js-yaml for details](https://github.com/nodeca/js-yaml)

#### options.filename

Type `String`

Default: the path of the file processed

String to be used as a file path in error/warning messages.


## License

MIT

'use strict';

var through       = require('through2');
var gutil         = require('gulp-util');
var yaml          = require('js-yaml');
var xtend         = require('xtend');
var BufferStreams = require('bufferstreams');
var PluginError   = gutil.PluginError;
var PLUGIN_NAME   = 'gulp-json-to-yaml';


function json2yaml(buffer, options) {
  var contents = buffer.toString('utf8');
  var src = JSON.parse(contents);
  var ymlDocument = options.safe ? yaml.safeDump(src, options) : yaml.dump(src, options);
  return new Buffer(ymlDocument);
}

module.exports = function(options) {
  options = xtend({safe: true, replacer: null, space: null}, options);
  var providedFilename = options.filename;

  return through.obj(function(file, enc, callback) {
    if (!providedFilename) {
      options.filename = file.path;
    }

    if (file.isBuffer()) {
      if (file.contents.length === 0) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'File ' + file.path +
            ' is empty. JSON loader cannot load empty content'));
        return callback();
      }
      try {
        file.contents = json2yaml(file.contents, options);
        file.path = gutil.replaceExtension(file.path, '.yaml');
      }
      catch (error) {
        this.emit('error', new PluginError(PLUGIN_NAME, error, {showStack: true}));
        return callback();
      }
    }
    else if (file.isStream()) {
      var _this = this;
      var streamer = new BufferStreams(function(err, buf, cb) {
        if (err) {
          _this.emit('error', new PluginError(PLUGIN_NAME, err, {showStack: true}));
        }
        else {
          if (buf.length === 0) {
            _this.emit('error', new PluginError(PLUGIN_NAME, 'File ' + file.path +
                ' is empty. JSON loader cannot load empty content'));
          }
          else {
            try {
              var parsed = json2yaml(buf, options);
              file.path = gutil.replaceExtension(file.path, '.yaml');
              cb(null, parsed);
            }
            catch (error) {
              _this.emit('error', new PluginError(PLUGIN_NAME, error, {showStack: true}));
            }
          }
        }
      });
      file.contents = file.contents.pipe(streamer);
    }
    this.push(file);
    callback();
  });
};

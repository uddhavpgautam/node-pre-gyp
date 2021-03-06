
module.exports = exports = build

exports.usage = 'Attempts to compile the module by dispatching to node-gyp or nw-gyp'

var fs = require('fs')
  , compile = require('./util/compile.js')
  , versioning = require('./util/versioning.js')
  , path = require('path')
  , fs = require('fs')
  , mkdirp = require('mkdirp')

function build(gyp, argv, callback) {
    var gyp_args = [];
    if (argv.length && argv[0] == 'rebuild') {
        gyp_args.push('rebuild');
    } else {
        gyp_args.push('configure');
        gyp_args.push('build');
    }
    var package_json = JSON.parse(fs.readFileSync('./package.json'));
    // options look different depending on whether node-pre-gyp is called directly
    // or whether it is called from npm install, hence the following two lines.
    var command_line_opts = (typeof(gyp.opts.argv.original) === 'string') ? JSON.parse(gyp.opts.argv).original : gyp.opts.argv.original || [];
    command_line_opts = command_line_opts.filter(function(opt) { return opt.length > 2 && opt.slice(0,2) == '--'});
    var opts = versioning.evaluate(package_json, gyp.opts);
    Object.keys(opts).forEach(function(o) {
        var val = opts[o];
        if (val) {
            command_line_opts.push('--' + o + '=' + val);
        }
    })
    compile.run_gyp(gyp_args.concat(command_line_opts),gyp.opts,function(err,gopts) {
        return callback(err);
    });
}

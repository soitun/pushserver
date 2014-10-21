/**
 * Config options for all gulp tasks.
 */

var gutil = require('gulp-util');
var path = require('path');

var serverConfig = require('config').get('SERVER');

var BASE_DIR = path.join(__dirname, '..');
var COMPONENTS_DIR = path.join(BASE_DIR, 'bower_components');
var WWW_DIR = path.join(BASE_DIR, 'www');
var BUILD_DIR = path.join(WWW_DIR, 'build');
var DIST_DIR = path.join(WWW_DIR, 'dist');

module.exports = {

  appSettings: {
    dest: BUILD_DIR,
    fileName: 'pushServerSettings.js',
    settingsKeys: [
      'SUPPORTED_CHANNELS',
      'APPLICATION'
    ]
  },

  browserSync: {
    proxy: serverConfig.get('URL') + ':' + serverConfig.get('PORT'),
    files: [
      path.join(DIST_DIR, '/**/*'),
      '!' + path.join(DIST_DIR, '/**.map')
    ]
  },

  distDir: DIST_DIR,

  browserify: {
    debug: !gutil.env.production,
    entries: ['./www/js/app.js'],
    dest: DIST_DIR,
    outputName: 'push_server.min.js'
  },

  css: {
    dest: DIST_DIR,
    paths: path.join(WWW_DIR, 'css/*.css')
  },

  jsLibs: {
    distDir: DIST_DIR,
    jsLibs: [
      path.join(COMPONENTS_DIR, 'jquery/dist/jquery.js'),
      path.join(COMPONENTS_DIR, 'datatables/media/js/jquery.dataTables.js'),
      path.join(COMPONENTS_DIR, 'angular/angular.js'),
      path.join(COMPONENTS_DIR, 'angular-datatables/dist/angular-datatables.js'),
      path.join(COMPONENTS_DIR, 'angular-ui-router/release/angular-ui-router.js'),
      path.join(COMPONENTS_DIR, 'lodash/dist/lodash.compat.js'),
      path.join(COMPONENTS_DIR, 'bootstrap/dist/js/bootstrap.js')
    ]
  },

  ngTemplates: {
    dest: BUILD_DIR,
    paths: [
      path.join(WWW_DIR, 'templates/**/*.html'),
    ],
    fileRoot: 'ng_partials',
    ngModuleName: 'PushNotificationApp',
    templateFileName: 'pushNotificationTemplates.js',
    moduleSystem: 'browserify'
  },

  syncDatabase: {
    force: false
  },

  templates: {
    index: path.join(WWW_DIR, 'index.html'),
    indexDest: DIST_DIR,
    dest: path.join(DIST_DIR, 'templates'),
    // Paths is a little more complex here, as it's doing a recursive copy relative to a base dir
    paths: [path.join(WWW_DIR, 'templates/**/*.html')],
    pathsBaseDir: path.join(WWW_DIR, 'templates')
  },

  test: {
    mochaOptions: {
      reporter: 'spec'
    },
    paths: path.join(BASE_DIR, 'test/**/*.js')
  }

};

'use strict';

const gulp = require('gulp');
const bundleAnalyzer = require('webpack-bundle-analyzer');
const build = require('@microsoft/sp-build-web');
const fs = require("node:fs");
const JSZip = require("jszip");

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

// Paths
const path = require('path');

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    if(!generatedConfiguration.resolve.alias){
      generatedConfiguration.resolve.alias = {};
    }

    // root src folder
    generatedConfiguration.resolve.alias['@'] = path.resolve( __dirname, 'lib')

    // nullish-coalescing-operator
    // https://github.com/s-KaiNet/spfx-fast-serve/issues/58#issuecomment-1014477201
    generatedConfiguration.module.rules.push(
      {
        test: /node_modules[\/\\]@?orama[\/\\].*.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ],
            plugins: [
               '@babel/plugin-proposal-nullish-coalescing-operator', 
               "@babel/plugin-transform-logical-assignment-operators",
               "@babel/plugin-transform-class-properties",
            ]
          }
        }
      }
    );

    // https://learn.microsoft.com/en-us/sharepoint/dev/spfx/toolchain/optimize-builds-for-production
    // const lastDirName = path.basename(__dirname);
    // const dropPath = path.join(__dirname, 'temp', 'stats');
    // generatedConfiguration.plugins.push(new bundleAnalyzer.BundleAnalyzerPlugin({
    //   openAnalyzer: false,
    //   analyzerMode: 'static',
    //   reportFilename: path.join(dropPath, `${lastDirName}.stats.html`),
    //   generateStatsFile: true,
    //   statsFilename: path.join(dropPath, `${lastDirName}.stats.json`),
    //   logLevel: 'error'
    // }));

    return generatedConfiguration;
  }
});

// TailwindCSS
const postcss = require("gulp-postcss");
const atimport = require("postcss-import");
const tailwind = require("tailwindcss");

const tailwindcss = build.subTask(
   "tailwindcss",
   function (gulp, buildOptions, done) {
      gulp
         .src("assets/tailwind.css")
         .pipe(
            postcss([
               atimport(),
               tailwind("./tailwind.config.js"),
            ])
         )
         .pipe(gulp.dest("assets/dist"));
      done();
   }
);
build.rig.addPreBuildTask(tailwindcss);

build.task('fix-manifest', {
  execute: async () => {
    const zipPath = "./sharepoint/solution/half-year-calendar-webpart.sppkg";
    const data = fs.readFileSync(zipPath);
    const zip = await JSZip.loadAsync(data);

    const manifest = zip.file("81f8329d-67af-4b07-b59a-78e0120cd9ee/WebPart_81f8329d-67af-4b07-b59a-78e0120cd9ee.xml");
    const stream = manifest.nodeStream();
    function streamToString (stream) {
      const chunks = [];
      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      })
    }
    const content = await streamToString(stream);
    const newContent = content.replaceAll("18.2.0", "17.0.1");
    zip.file("81f8329d-67af-4b07-b59a-78e0120cd9ee/WebPart_81f8329d-67af-4b07-b59a-78e0120cd9ee.xml", newContent);

    return new Promise((resolve) => {
      zip
      .generateNodeStream({type:'nodebuffer',streamFiles:true})
      .pipe(fs.createWriteStream(zipPath))
      .on('finish', function () {
          console.log(`${zipPath} written.`);
          resolve();
        });
    })
  }}
);

build.initialize(require('gulp'));

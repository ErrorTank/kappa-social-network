const gulp = require("gulp");
const spawn = require('child_process').spawn;
const nodemon = require("gulp-nodemon");
const rimraf = require('rimraf');


const stylusCompiler = {
    watch: (desk, done) => {
        return require("./compile-stylus").createCompiler(desk, done).watch();
    },
    compile: (desk, done) => {
        return require("./compile-stylus").createCompiler(desk, done).compile();
    }
};

// const startServer = async (env) => {
//     return nodemon({
//         script: './server/server.js',
//         ext: 'js',
//         ignore: [
//             ".idea/",
//             ".git/",
//             "gulpfile.js",
//             "client/*",
//             "public/*",
//             "webpack.config.js",
//             "webpack.prod.config.js",
//             "build/*",
//             "dist/*",
//             "uploads/*"
//         ],
//         env,
//         stdout: true,
//         exec: "babel-node"
//     })
// };

gulp.task("dev", (done) => {
    rimraf('./build/**/*', () => {
        console.log("Delete old build successfully!");
        stylusCompiler.watch("build", done).then(() => {
            // spawn("node", ["./scripts/copy-assets", "dev"], {stdio: "inherit"})
            if (!/^win/.test(process.platform)) { // linux
                return spawn("webpack-dev-server", {stdio: "inherit"});
            } else {
                return spawn('cmd', ['/s', "/c", "webpack-dev-server"], {stdio: "inherit"});
            }
        }).catch(err => console.log(err));
    });


});


gulp.task("build-prod", (done) => {
    rimraf('./dist/**/*', () => {
        console.log("Delete old build successfully!");
        return stylusCompiler.compile("dist", done).then(() => {
            // spawn("node", ["./scripts/copy-assets", "prod"], {stdio: "inherit"})
            if (!/^win/.test(process.platform)) { // linux
                return spawn("webpack", ["--config", " ./webpack.prod.config.js"], {stdio: "inherit"});
            } else {
                return spawn('cmd', ['/s', "/c", "webpack", "--config", "./webpack.prod.config.js"], {stdio: "inherit"});
            }
        }).catch(err => {
            console.log(err);
        });
    });

});


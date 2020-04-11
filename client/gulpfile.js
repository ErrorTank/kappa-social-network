const gulp = require("gulp");
const spawn = require('child_process').spawn;
const nodemon = require("gulp-nodemon");
const rimraf = require('rimraf');


const stylusCompiler = {
    watch: (desk) => {
        return require("./compile-stylus").createCompiler(desk).watch();
    },
    compile: (desk) => {
        return require("./compile-stylus").createCompiler(desk).compile();
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

gulp.task("dev", () => {
    rimraf('./build/**/*', () => {
       stylusCompiler.watch("build").then(() => {
            spawn("node", ["./scripts/copy-assets", "dev"], {stdio: "inherit"})
            if (!/^win/.test(process.platform)) { // linux
                return spawn("webpack-dev-server", {stdio: "inherit"});
            } else {
                return spawn('cmd', ['/s', "/c", "webpack-dev-server"], {stdio: "inherit"});
            }
        });
    });


});


gulp.task("build-prod", () => {
    rimraf('./dist/**/*', () => {
        return stylusCompiler.compile("dist").then(() => {
            spawn("node", ["./scripts/copy-assets", "prod"], {stdio: "inherit"})
            if (!/^win/.test(process.platform)) { // linux
                return spawn("webpack", ["--config", " ./webpack.prod.config.js"], {stdio: "inherit"});
            } else {
                return spawn('cmd', ['/s', "/c", "webpack", "--config", "./webpack.prod.config.js"], {stdio: "inherit"});
            }
        })
    });

});


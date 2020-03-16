const chokidar = require("chokidar");
const gulp = require("gulp");

module.exports = {
    createCompiler(desk) {
        let compileStyl = function() {
            return new Promise((resolve, reject)=> {
                let stylus = require("gulp-stylus");
                gulp.src(`./style/main.styl`)
                    .pipe(stylus({
                        compress: true
                    }))
                    .pipe(gulp.dest(desk))
                    .on("end", function() {
                        resolve();
                        console.log("Compiling done");
                    })
                ;
            });
        };

        let inject_ = function() {
            return new Promise((resolve, reject)=> {

                let target = gulp.src(`./style/main.styl`);
                const sort = require('gulp-sort');
                let sources = gulp.src([`./react/**/*.styl`,`!./style/*.styl`], {read: false}).pipe(sort());

                const inject = require("gulp-inject");
                target
                    .pipe(inject(sources, {
                        starttag: '// inject:all',
                        endtag: '// endinject',
                        transform: function (filepath, file, i, length) {
                            return `@import "../..${filepath}";`;
                        }
                    }))
                    .pipe(gulp.dest(`./style/`))
                    .on("end", ()=>{
                        console.log("Inject done");
                        resolve();
                    })
                ;
            });
        };

        return {
            watch: () => {
                inject_().then(compileStyl);
                chokidar
                    .watch([`./**/*.styl`], {
                        ignoreInitial: true
                    })
                    .on('add', function(event, path) {
                        inject_().then(compileStyl);
                    })
                    .on('unlink', function(event, path) {
                        inject_().then(compileStyl);
                    })
                    .on('change', function(event, path) {
                        compileStyl();
                    })
                ;
            },
            compile: ()=> {
                return inject_().then(compileStyl);
            }
        }
    }
};
